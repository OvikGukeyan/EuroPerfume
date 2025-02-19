import { prisma } from "@/prisma/prisma-client";
import { Brand, Gender, Notes, PerfumeConcentration, Types } from "@prisma/client";

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
}

const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 50;
export const findProducts = async (params: GetSearchParams) => {
  const brands = params.brands
    ?.split(",")
    .map((item) => item.trim().toUpperCase());
  const genders =
    params.gender?.split(",").map((item) => item.trim().toUpperCase()) ??
    [];
  const notes = params.notes?.split(",").map((item) => item.trim().toUpperCase()) ?? [];
  const types =
    params.types?.split(",").map((item) => item.trim().toUpperCase()) ?? [];
  const concentration = params.concentration?.split(",").map((item) => item.trim().toUpperCase());

  const priceFrom = Number(params.priceFrom) || DEFAULT_MIN_PRICE;
  const priceTo = Number(params.priceTo) || DEFAULT_MAX_PRICE;

  const categoryes = await prisma.category.findMany({
    include: {
      products: {
        orderBy: {
          id: "desc",
        },
        where: {
          brand: { in: brands as Brand[] },
          gender:
            genders.length > 0 ? { hasSome: genders as Gender[] } : undefined,
          types: types.length > 0 ? { hasSome: types as Types[] } : undefined,
          concentration: {in: concentration as PerfumeConcentration[]},
          notes: notes.length > 0 ? { hasSome: notes as Notes[] } : undefined,
          price: { gte: priceFrom, lte: priceTo }
        },
      },
    },
  });
  return categoryes;
};
