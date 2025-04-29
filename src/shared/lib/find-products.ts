import { prisma } from "@/prisma/prisma-client";
import {
  Aromas,
  Classifications,
  Gender,
  Notes,
  PerfumeConcentration,
} from "@prisma/client";
import { SafeProduct } from "../services/dto/product.dto";

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
}

const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 50;

export const findProducts = async (
  params: GetSearchParams
): Promise<FindProductsResponse> => {
  try {
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

    const whereClause = {
      brandId: { in: brands },
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
      productGroupId: (productGroupId ? productGroupId : (categoryId === 1 || !categoryId  ? {notIn: [4]} : undefined)),
      aromas: aromas.length > 0 ? { hasSome: aromas as Aromas[] } : undefined,
      topNotes:
        topNotes.length > 0 ? { hasSome: topNotes as Notes[] } : undefined,
      heartNotes:
        heartNotes.length > 0 ? { hasSome: heartNotes as Notes[] } : undefined,
      baseNotes:
        baseNotes.length > 0 ? { hasSome: baseNotes as Notes[] } : undefined,
    };

    const [products, totalCount] = await prisma.$transaction([
      // prisma.category.findMany({
      //   include: {
      //     productGroups: {
      //       include: {
      //         products: {
      //           skip: (page - 1) * 10,
      //           take: 10,
      //           orderBy: orderBy,
      //           where: whereClause,

      //           include: {
      //             translations: true,
      //             variations: true,
      //             brand: true,
      //           },
      //         },
      //       },
      //     },
      //   },
      // }),
      prisma.product.findMany({
        skip: (page - 1) * 10,
        take: 10,
        orderBy: orderBy,
        where: whereClause,
        include: {
          translations: true,
          variations: true,
          brand: true,
        },
      }),
      prisma.product.count({
        where: whereClause,
      }),
    ]);
    const safeProducts = products.map((product) => ({
      ...product,
      price: product.price.toNumber(),
    }));
    const totalPages = Math.ceil(totalCount / 10);
    return { products: safeProducts, totalPages };
  } catch (error) {
    console.error(error);
    return { products: [], totalPages: 0 };
  }
};
