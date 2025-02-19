import { prisma } from "@/prisma/prisma-client";
import { Brand, Gender } from "@prisma/client";

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
    .map((brand) => brand.trim().toUpperCase());
  const genders =
    params.gender?.split(",").map((gender) => gender.trim().toUpperCase()) ??
    [];
  const notes = params.notes?.split(",").map(Number);
  const types = params.types?.split(",").map(Number);
  const concentration = params.concentration?.split(",").map(Number);

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
        },
      },
    },
  });
  return categoryes;
};
