import "server-only";
import { prisma } from "@/prisma/prisma-client";
import { Brand, ProductGroup, ProductVariation, Review } from "@prisma/client";
import { SafeProduct } from "../services/dto/product.dto";

export interface SelectedProductDTO extends SafeProduct {
  variations: ProductVariation[];
  productGroup: ProductGroup;
  reviews: Review[];
  brand: Brand;
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
            variations: {
              where: {
                available: true,
              },
            },
            productGroup: true,
            reviews: true,
            brand: true,
          },
        },
      },
    });

    const popularProducts = await prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 24,
    });

    const popularProductIds = popularProducts.map((p) => p.productId);

    if (existingPopularProducts) {
      const safeProducts = popularProductIds
        .map((id) => existingPopularProducts.products.find((p) => p.id === id))
        .filter(
          (p): p is (typeof existingPopularProducts.products)[number] => !!p
        )
        .map((product) => ({
          ...product,
          discountPrice: product.discountPrice?.toNumber() ?? null,
          price: product.price.toNumber(),
        }));
      return safeProducts;
    }

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
            variations: {
              where: {
                available: true,
              },
            },
            productGroup: true,
            reviews: true,
            brand: true,
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

    if (!newPopularProducts) return [];

    const safeProducts = popularProductIds
      .map((id) => newPopularProducts.products.find((p) => p.id === id))
      .filter((p): p is (typeof newPopularProducts.products)[number] => !!p)
      .map((product) => ({
        ...product,
        discountPrice: product.discountPrice?.toNumber() ?? null,
        price: product.price.toNumber(),
      }));

    return safeProducts || [];
  } catch (error) {
    console.error("Error fetching popular products:", error);
    return [];
  }
};
