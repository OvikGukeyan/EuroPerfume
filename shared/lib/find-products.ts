import { prisma } from "@/prisma/prisma-client";
import {
  Brands,
  Category,
  Classifications,
  Gender,
  Notes,
  PerfumeConcentration,
  Product,
  ProductGroup,
} from "@prisma/client";

export interface GetSearchParams {
  query?: string;
  sortBy?: string;
  brands?: string;
  gender?: string;
  notes?: string;
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
  categoryes: (Category & {
    productGroups: (ProductGroup & {
      products: Product[];
    })[];
  })[];
  totalPages: number;
}

const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 50;

export const findProducts = async (
  params: GetSearchParams
): Promise<FindProductsResponse> => {
  try {
    const brands = (await params).brands
      ?.split(",")
      .map((item) => item.trim().toUpperCase());
    const genders =
      (await params).gender
        ?.split(",")
        .map((item) => item.trim().toUpperCase()) ?? [];
    const notes =
      (await params).notes
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

    const whereClause = {
      brand: { in: brands as Brands[] },
      gender: genders.length > 0 ? { in: genders as Gender[] } : undefined,
      classification:
        classification.length > 0
          ? { hasSome: classification as Classifications[] }
          : undefined,
      concentration: { in: concentration as PerfumeConcentration[] },
      price:
        priceFrom && priceTo ? { gte: priceFrom, lte: priceTo } : undefined,
      available: true,
      categoryId: categoryId || 1,
      productGroupId: productGroupId || undefined,
      ...(notes.length > 0 && {
        OR: [
          { topNotes: { hasSome: notes as Notes[] } },
          { heartNotes: { hasSome: notes as Notes[] } },
          { baseNotes: { hasSome: notes as Notes[] } },
        ],
      }),
    };
    const [categoryes, totalCount] = await prisma.$transaction([
      prisma.category.findMany({
        include: {
          productGroups: {
            include: {
              products: {
                skip: (page - 1) * 6,
                take: 6,
                orderBy: orderBy,
                where: whereClause,

                include: {
                  translations: true,
                  variations: true,
                },
              },
            },
          },
        },
      }),
      prisma.product.count({
        where: whereClause,
      }),
    ]);

    const totalPages = Math.ceil(totalCount / 6);
    return { categoryes, totalPages };

  } catch (error) {
    console.error(error);
    return { categoryes: [], totalPages: 0 };
  }
};
