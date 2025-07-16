import { prisma } from "@/prisma/prisma-client";
import { Review, User } from "@prisma/client";
import { SelectedProductDTO } from "./get-popular-products";

export interface RecentReviewDTO extends Review {
    user: User;
    product: SelectedProductDTO;
}

export const getRecentReviews = async (): Promise<RecentReviewDTO[]> => {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      take: 4,
      include: {
        user: true,
        product: {
            include: {
                variations: true,
                productGroup: true,
            },
        },
      },
    });

    const safeReviews = reviews.map((review) => ({
        ...review,
        product: {
            ...review.product,
            discountPrice: review.product?.discountPrice && review.product.discountPrice?.toNumber(),
            price: review.product?.price.toNumber(),
        }
    }))
    return safeReviews as RecentReviewDTO[];
  } catch (error) {
    console.error("Error fetching recent reviews:", error);
    return [];
  }
};
