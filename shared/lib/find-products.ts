import { prisma } from "@/prisma/prisma-client";
import {
  Brands,
  Gender,
  Notes,
  PerfumeConcentration,
  Types,
} from "@prisma/client";

export interface GetSearchParams {
  query?: string;
  sortBy?: string;
  brands?: string;
  gender?: string;
  notes?: string;
  types?: string;
  concentration?: string;
  priceFrom?: string;
  priceTo?: string;
  page?: string;
}

const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 50;
export const findProducts = async (params: GetSearchParams) => {
  const brands = (await params).brands
    ?.split(",")
    .map((item) => item.trim().toUpperCase());
  const genders =
    (await params).gender
      ?.split(",")
      .map((item) => item.trim().toUpperCase()) ?? [];
  const notes =
    (await params).notes?.split(",").map((item) => item.trim().toUpperCase()) ??
    [];
  const types =
    (await params).types?.split(",").map((item) => item.trim().toUpperCase()) ??
    [];
  const concentration = (await params).concentration
    ?.split(",")
    .map((item) => item.trim().toUpperCase());
  const page = Number((await params).page) || 1;

  const priceFrom = Number((await params).priceFrom) || DEFAULT_MIN_PRICE;
  const priceTo = Number((await params).priceTo) || DEFAULT_MAX_PRICE;
  const whereClause = {
    brand: { in: brands as Brands[] },
    gender: genders.length > 0 ? { in: genders as Gender[] } : undefined,
    types: types.length > 0 ? { hasSome: types as Types[] } : undefined,
    concentration: { in: concentration as PerfumeConcentration[] },
    notes: notes.length > 0 ? { hasSome: notes as Notes[] } : undefined,
    price: priceFrom && priceTo ? { gte: priceFrom, lte: priceTo } : undefined,
  };
  const [categoryes, totalCount] = await prisma.$transaction([
    prisma.category.findMany({
      include: {
        products: {
          skip: (page - 1) * 6,
          take: 6,
          orderBy: { id: "desc" },
          where: whereClause,

          include: {
            translations: true,
            reviews: true,
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
};
