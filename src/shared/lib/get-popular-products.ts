import { prisma } from "@/prisma/prisma-client";
import { Product, ProductGroup, ProductVariation } from "@prisma/client";

export interface SelectedProductDTO extends Product {
  variations: ProductVariation[];
  productGroup: ProductGroup;
}

export const getPopularProducts = async (): Promise<SelectedProductDTO[]> => {
  try {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const existingPopularProducts = await prisma.popularProducts.findFirst({
      where: { date: startOfDay },
      include: {
        products: {
          include: {
            variations: true,
            productGroup: true,
          },
        },
      },
    });

    if (existingPopularProducts) {
      return existingPopularProducts.products;
    }

    const popularProducts = await prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 12,
    });

    const popularProductIds = popularProducts.map((p) => p.productId);

    const availableProducts = await prisma.product.findMany({
      where: {
        id: { in: popularProductIds },
        available: true,
      },
      select: { id: true },
    });

    const data = await prisma.popularProducts.create({
      data: {
        date: startOfDay,
        products: { connect: availableProducts },
      },
    });
    const newPopularProducts = await prisma.popularProducts.findFirst({
      where: { date: startOfDay },
      include: {
        products: {
          include: {
            variations: true,
            productGroup: true,
          },
        },
      },
    });

    return newPopularProducts?.products || [];
  } catch (error) {
    console.error("Error fetching popular products:", error);
    return [];
  }
};
