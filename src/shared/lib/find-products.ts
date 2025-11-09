import { prisma } from "@/prisma/prisma-client";
import { Gender, NoteType, PerfumeConcentration, Prisma } from "@prisma/client";
import { ProductDTO, SafeProduct } from "../services/dto/product.dto";
import { getAvailableFilters } from ".";
import { AvailableFilters } from "../store/product";
import { tr } from "date-fns/locale";
import { getUserSession } from "./get-user-session";

export interface GetSearchParams {
  query?: string;
  sortBy?: string;
  brands?: string;
  gender?: string;
  topNotes?: string;
  heartNotes?: string;
  baseNotes?: string;
  aromas?: string;
  classification?: string;
  concentration?: string;
  priceFrom?: string;
  priceTo?: string;
  orderBy?: string;
  page?: string;
  category?: string;
  productGroup?: string;
}

export interface FindProductsResponse {
  products: SafeProduct[];
  totalPages: number;
  availableFilters: AvailableFilters | null;
}

const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 50;

export const findProducts = async (
  params: GetSearchParams
): Promise<FindProductsResponse> => {
  try {
    const user = await getUserSession();
    const isAdmin = user?.role === "ADMIN";

    const brands = (await params).brands
      ?.split(",")
      .map((item) => Number(item.trim()));
    const genders =
      (await params).gender
        ?.split(",")
        .map((item) => item.trim().toUpperCase()) ?? [];
    const topNotes =
      (await params).topNotes
        ?.split(",")
        .map((item) => item.trim().toUpperCase()) ?? [];
    const heartNotes =
      (await params).heartNotes
        ?.split(",")
        .map((item) => item.trim().toUpperCase()) ?? [];
    const baseNotes =
      (await params).baseNotes
        ?.split(",")
        .map((item) => item.trim().toUpperCase()) ?? [];
    const aromas =
      (await params).aromas
        ?.split(",")
        .map((item) => item.trim().toUpperCase()) ?? [];
    const classification =
      (await params).classification
        ?.split(",")
        .map((item) => item.trim().toUpperCase()) ?? [];
    const concentration = (await params).concentration
      ?.split(",")
      .map((item) => item.trim().toUpperCase());
    const page = Number((await params).page) || 1;

    const priceFrom = Number((await params).priceFrom) || DEFAULT_MIN_PRICE;
    const priceTo = Number((await params).priceTo) || DEFAULT_MAX_PRICE;
    const orderBy = JSON.parse((await params).orderBy || "{}");

    const categoryId = Number((await params).category);
    const productGroupId = Number((await params).productGroup);
    const noteFilters: Prisma.ProductWhereInput[] = [];

    if (topNotes.length > 0) {
      noteFilters.push({
        productNotes: {
          some: {
            noteType: NoteType.TOP,
            noteId: { in: topNotes.map(Number) },
          },
        },
      });
    }

    if (heartNotes.length > 0) {
      noteFilters.push({
        productNotes: {
          some: {
            noteType: NoteType.HEART,
            noteId: { in: heartNotes.map(Number) },
          },
        },
      });
    }

    if (baseNotes.length > 0) {
      noteFilters.push({
        productNotes: {
          some: {
            noteType: NoteType.BASE,
            noteId: { in: baseNotes.map(Number) },
          },
        },
      });
    }
    const whereClause = {
      brandId: { in: brands },
      gender: genders.length > 0 ? { in: genders as Gender[] } : undefined,
      classification:
        classification.length > 0
          ? {
              some: {
                id: {
                  in: classification.map((classification) =>
                    Number(classification)
                  ),
                },
              },
            }
          : undefined,
      concentration: { in: concentration as PerfumeConcentration[] },
      price:
        priceFrom && priceTo ? { gte: priceFrom, lte: priceTo } : undefined,
      available: true,
      categoryId: categoryId || 1,
      productGroupId: productGroupId
        ? productGroupId
        : categoryId === 1 || !categoryId
        ? { in: [1, 2, 3] }
        : undefined,
      aromas:
        aromas.length > 0
          ? { some: { id: { in: aromas.map((aroma) => Number(aroma)) } } }
          : undefined,
      ...(noteFilters.length > 0 && { AND: noteFilters }),
    };

    const allFilteredProducts = await prisma.product.findMany({
      where: whereClause,
      include: {
        productGroup: true,
        translations: true,
        variations: true,
        brand: true,
        productNotes: {
          include: {
            note: true,
          },
        },
        aromas: true,
        classification: true,
        effect: true,
        purpose: true,
        skinType: true,
        packagingFormat: true,
        finish: true,
        applicationMethod: true,
        texture: true,
        formula: true,
      },
    });

    const availableFilters = getAvailableFilters(
      allFilteredProducts as unknown as ProductDTO[]
    );
    const [products, totalCount] = await prisma.$transaction([
      prisma.product.findMany({
        skip: (page - 1) * 24,
        take: 24,
        orderBy: orderBy,
        where: whereClause,
        include: {
          productGroup: true,
          translations: true,
          variations: isAdmin
            ? true
            : {
                where: {
                  available: true,
                },
              },
          brand: true,
          productNotes: {
            include: {
              note: true,
            },
          },
          aromas: true,
          classification: true,
          effect: true,
          purpose: true,
          skinType: true,
          packagingFormat: true,
          finish: true,
          applicationMethod: true,
          texture: true,
          formula: true,
          reviews: true,
        },
      }),
      prisma.product.count({
        where: whereClause,
      }),
    ]);
    const safeProducts = products.map((product) => ({
      ...product,
      price: product.price.toNumber(),
      discountPrice: product.discountPrice?.toNumber() || null,
    }));
    const totalPages = Math.ceil(totalCount / 24);
    return { products: safeProducts, totalPages, availableFilters };
  } catch (error) {
    console.error(error);
    return { products: [], totalPages: 0, availableFilters: null };
  }
};
