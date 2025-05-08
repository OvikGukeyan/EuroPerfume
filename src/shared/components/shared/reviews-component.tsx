import React, { FC } from "react";
import { cn } from "../../lib/utils";
import { ReviewForm, ReviewsList, Title } from ".";
import { ProductDTO } from "../../services/dto/product.dto";
import { Review, User } from "@prisma/client";

type Props = {
  product: ProductDTO;
  className?: string;
};

export const ReviewsComponent: FC<Props> = ({ product, className }) => {
  return (
    <div className={cn("px-4 md:px-0", className)}>
      {product.reviews.length > 0 ? (
        <>
          <Title text="Reviews" size="lg" className="font-extrabold my-10" />
          <ReviewsList
            reviews={product.reviews as (Review & { user: User })[]}
            className="mb-10"
          />
        </>
      ) : (
        <Title
          text="No reviews yet"
          size="lg"
          className="font-extrabold my-10"
        />
      )}

      <ReviewForm productId={product.id} />
    </div>
  );
};
