import { prisma } from "@/prisma/prisma-client";
import { Product, ProductGroup, ProductVariation } from "@prisma/client";
import { SafeProduct } from "../services/dto/product.dto";

export interface SelectedProductDTO extends SafeProduct {
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
      const safeProducts = existingPopularProducts.products.map((product) => ({
        ...product,
        discountPrice:
          product.discountPrice && product.discountPrice?.toNumber(),
        price: product.price.toNumber(),
      }));
      return safeProducts;
    }

    const popularProducts = await prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 24,
    });

    const popularProductIds = popularProducts.map((p) => p.productId);

    const availableProducts = await prisma.product.findMany({
      where: {
        id: { in: popularProductIds },
        available: true,
      },
      select: { id: true },
    });
    await prisma.$transaction([
      prisma.popularProducts.deleteMany(),
      prisma.popularProducts.create({
        data: {
          date: startOfDay,
          products: { connect: availableProducts },
        },
      }),
    ]);
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

    await prisma.$transaction([
      prisma.product.updateMany({
        data: { isBestseller: false },
      }),
      prisma.product.updateMany({
        where: { id: { in: popularProductIds } },
        data: { isBestseller: true },
      }),
    ]);

    const safeProducts = newPopularProducts?.products.map((product) => ({
      ...product,
      discountPrice: product.discountPrice && product.discountPrice?.toNumber(),
      price: product.price.toNumber(),
    }));

    return safeProducts || [];
  } catch (error) {
    console.error("Error fetching popular products:", error);
    return [];
  }
};
