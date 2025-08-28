"use client";
import React, { FC } from "react";
import { cn } from "../../lib/utils";
import { Rating } from "./rating";
import { ProductCaruselItem, Separator } from "..";
import { useFavorites } from "../../hooks";
import { Review, User } from "@prisma/client";
import { SelectedProductDTO } from "../../lib/get-popular-products";

type Props = {
  reviews: (Review & { product: SelectedProductDTO; user: User })[];
  className?: string;
};

export const RecentReviewsList: FC<Props> = ({ className, reviews }) => {
  const { items: favorites, addFavoritesItem } = useFavorites();

  return (
    <div
      className={cn(
        "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6  gap-4 px-5 mb-5",
        className
      )}
    >
      {reviews.map((review) => (
        <div key={review.id}>
          <ProductCaruselItem
            brand={review.product.brand}
            productGroup={review.product.productGroup}
            id={review.product.id}
            name={review.product.name}
            imageUrl={
              review.product.imageUrl[0] ||
              review.product.variations[0].imageUrl
            }
            variations={review.product.variations}
            isFavorite={favorites.some(
              (item) => item.productId === review.product.id
            )}
            toggleIsFavorite={addFavoritesItem}
            discountPrice={review.product.discountPrice || undefined}
            isBestseller={!!review.product.isBestseller}
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
  );
};
