import React, { FC } from "react";
import { cn } from "../../lib/utils";
import { ReviewForm, ReviewsList, Title } from ".";
import { ProductDTO } from "../../services/dto/product.dto";
import { Review, User } from "@prisma/client";
import { useTranslations } from "next-intl";

type Props = {
  product: ProductDTO;
  className?: string;
};

export const ReviewsComponent: FC<Props> = ({ product, className }) => {
  const t = useTranslations('Reviews');
  return (
    <div className={cn("px-4 md:px-0", className)}>
      {product.reviews.length > 0 ? (
        <>
          <Title text={t("title")} size="lg" className="font-extrabold my-10" />
          <ReviewsList
            reviews={product.reviews as (Review & { user: User })[]}
            className="mb-10"
          />
        </>
      ) : (
        <Title
          text={t("noReviews")}
          size="lg"
          className="font-extrabold my-10"
        />
      )}

      <ReviewForm productId={product.id} />
    </div>
  );
};
