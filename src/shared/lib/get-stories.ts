import { prisma } from "@/prisma/prisma-client";
import { Product } from "@prisma/client";

export const getStories = async (): Promise<Product[]> => {
  try {
    const stories = await prisma.product.findMany({
      where: {
        AND: [{ videoUrl: { not: null } }, { videoUrl: { not: "" } }],
      },
      take: 10,
    });
    return stories;
  } catch (error) {
    console.error("Error fetching stories:", error);
    return [];
  }
};
