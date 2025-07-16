import { prisma } from "@/prisma/prisma-client";
import { SelectedProductDTO } from "./get-popular-products";



export const getNewProducts = async (): Promise<SelectedProductDTO[]> => {
    try {
        const newProducts = await prisma.product.findMany({
          orderBy: {
            createdAt: "desc",
          },
          take: 24,
          include: {
            variations: true,
            productGroup: true,
          },
        });
    
        return newProducts;
      } catch (error) {
        console.error("Error fetching new products:", error);
        return [];
      }
    }