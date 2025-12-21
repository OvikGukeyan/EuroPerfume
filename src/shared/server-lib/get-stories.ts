import "server-only";
import { prisma } from "@/prisma/prisma-client";
import { Product } from "@prisma/client";

export const getStories = async (): Promise<Product[]> => {
  try {
    const stories = await prisma.$queryRaw<Product[]>`
    SELECT *
    FROM "Product"
    WHERE "available" = true AND "videoUrl" IS NOT NULL AND "videoUrl" != ''
    ORDER BY RANDOM()
    LIMIT 10;
  `;
    return stories;
  } catch (error) {
    console.error("Error fetching stories:", error);
    return [];
  }
};
