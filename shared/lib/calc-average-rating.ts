import { Review } from "@prisma/client";

export const calcAverageRating = (reviews: Review[]): {averageRating: number, count: number} => {
    if (reviews?.length === 0) return {averageRating: 0, count: 0};
    const average = reviews?.reduce((total, review) => total + review.rating, 0) / reviews?.length;
    return {averageRating: average, count: reviews?.length}
}