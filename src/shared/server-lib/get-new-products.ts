import { fullBottleInclude, withBottleOptions } from "../lib/full-bottle";
import "server-only";
import { prisma } from "@/prisma/prisma-client";
import { SelectedProductDTO } from "./get-popular-products";



export const getNewProducts = async (): Promise<SelectedProductDTO[]> => {
    try {
        const newProducts = await prisma.product.findMany({
          where: {
            available: true,
            bottleParentId: null,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 24,
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
        });

        const safeProducts = newProducts.map((product) => ({
          ...withBottleOptions(product),
          discountPrice: product.discountPrice && product.discountPrice?.toNumber(),
          price: product.price.toNumber(),
        }))
    
        return safeProducts;
      } catch (error) {
        console.error("Error fetching new products:", error);
        return [];
      }
    }