import React, { FC } from "react";
import { cn } from "@/src/lib/utils";
import { ReviewComponent } from ".";
import { Product, ProductVariation, Review, User } from "@prisma/client";
import { ProductDTO } from "../../services/dto/product.dto";


type ProductWithVariations = Product & {
  variations: ProductVariation[]
}
type Props = {
  reviews:  (Review & { user: User; product?: ProductWithVariations })[];
  className?: string;
 
};

export const ReviewsList: FC<Props> = ({ className, reviews }) => {
  return (
    <div
      id="reviews"
      className={cn(
        "bg-secondary px-5 md:px-16 py-10 md:py-20 flex flex-col  ",
        className
      )}
    >
      {reviews.map((review) => (
        <ReviewComponent
          key={review.id}
          text={review.text}
          userName={review.user.fullName}
          rating={review.rating}
          createdAt={review.createdAt}
          productId={review.productId || undefined}
          productName={ review?.product && review?.product.name }
          imageUrl={review?.product && review?.product.imageUrl[0] || review?.product?.variations[0].imageUrl || undefined}
        />
      ))}
    </div>
  );
};
