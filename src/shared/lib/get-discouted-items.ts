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
      },
      include: {
        variations: true,
        productGroup: true,
        reviews: true,
        brand: true,
      },
      take: 24,
    });

    const safeDiscountedItems = discountedItems.map((product) => ({
      ...product,
      discountPrice: product.discountPrice && product.discountPrice?.toNumber(),
      price: product.price.toNumber(),
    }));
    return safeDiscountedItems;
  } catch (error) {
    console.error("Error fetching discounted items:", error);
    return [];
  }
};
