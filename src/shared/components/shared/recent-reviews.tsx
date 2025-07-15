import React, { FC, use } from "react";
import { getRecentReviews } from "../../lib";
import { ProductCaruselItem } from ".";
import { Rating } from "./rating";
import { Separator, Title } from "..";
import { useTranslations } from "next-intl";
import { cn } from "../../lib/utils";

interface Props {
  className?: string;
}

export const RecentReviews: FC<Props> = ({className}) => {
  const reviews = use(getRecentReviews());
  const t = useTranslations("RecentReviews");
  return (
    <div className={cn(className)}>
      {reviews.length > 0 && (
        <>
          <div className="flex items-center justify-center gap-4 w-full">
            <div className="h-1 w-12 bg-black"></div>
            <Title
              className="text-2xl sm:text-3xl  md:text-5xl   font-extrabold text-center my-10"
              text={t("title").toUpperCase()}
            />
            <div className="h-1 w-12 bg-black"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6  gap-4 px-5 mb-5">
            {reviews.map((review) => (
              <div key={review.id}>
                <ProductCaruselItem
                  productGroup={review.product.productGroup}
                  id={review.product.id}
                  name={review.product.name}
                  imageUrl={
                    review.product.imageUrl[0] ||
                    review.product.variations[0].imageUrl
                  }
                  variations={review.product.variations}
                />
                <div>
                  <Rating className="mb-5" value={review.rating} withNumber />
                  <Separator className="mb-5" />

                  <p className="mb-2">{review.user.fullName}</p>

                  <p className="text-sm text-gray-500">{review.text}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
