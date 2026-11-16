import { fullBottleInclude, withBottleOptions } from "../lib/full-bottle";
import "server-only";

import { prisma } from "@/prisma/prisma-client";
import { SelectedProductDTO } from "./get-popular-products";

export const getDiscountedItems = async (): Promise<SelectedProductDTO[]> => {
  try {
    const discountedItems = await prisma.product.findMany({
      where: {
        discountPrice: {
          not: null,
        },
        available: true,
        bottleParentId: null,
      },
      include: {
        variations: {
          where: {
            available: true,
          },
        },
        productGroup: true,
            fullBottles: fullBottleInclude,
        reviews: true,
        brand: true,
      },
      take: 24,
    });

    const safeDiscountedItems = discountedItems.map((product) => ({
      ...withBottleOptions(product),
      discountPrice: product.discountPrice && product.discountPrice?.toNumber(),
      price: product.price.toNumber(),
    }));
    return safeDiscountedItems;
  } catch (error) {
    console.error("Error fetching discounted items:", error);
    return [];
  }
};
