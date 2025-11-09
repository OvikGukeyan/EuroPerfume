import { prisma } from "@/prisma/prisma-client";
import { SelectedProductDTO } from "./get-popular-products";



export const getNewProducts = async (): Promise<SelectedProductDTO[]> => {
    try {
        const newProducts = await prisma.product.findMany({
          where: {
            available: true,
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
            reviews: true,
            brand: true,
          },
        });

        const safeProducts = newProducts.map((product) => ({
          ...product,
          discountPrice: product.discountPrice && product.discountPrice?.toNumber(),
          price: product.price.toNumber(),
        }))
    
        return safeProducts;
      } catch (error) {
        console.error("Error fetching new products:", error);
        return [];
      }
    }