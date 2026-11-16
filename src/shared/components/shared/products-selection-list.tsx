"use client";
import React, { FC, useState } from "react";
import { ProductSelectionItem } from ".";
import { LoadMoreButton } from "./load-more-button";
import { useTranslations } from "next-intl";
import { cn } from "../../lib/utils";
import { SelectedProductDTO } from "../../server-lib/get-popular-products";
import { useFavorites } from "../../hooks";

interface Props {
  className?: string;
  products: SelectedProductDTO[];
}

export const ProductsSelectionList: FC<Props> = ({ products, className }) => {
  const [visibleCount, setVisibleCount] = useState(8);
  const t = useTranslations("ProductsSelection");
  const productsToShow = products.slice(0, visibleCount);

  const { favoriteIds, addFavoritesItem } = useFavorites();
  return (
    <div className={cn(className, "w-full flex flex-col items-center  ")}>
      <div
        className={cn(
          "home-products-grid w-full"
        )}
      >
        {productsToShow.map((product) => (
          <ProductSelectionItem
            key={product.id}
            productGroup={product.productGroup}
            id={product?.id}
            name={product.name}
            imageUrl={product.imageUrl[0] || product.variations[0]?.imageUrl }
            variations={product.variations}
            concentration={product.concentration || undefined}
            discountPrice={product.discountPrice || undefined}
            isBestseller={!!product.isBestseller}
            isFavorite={favoriteIds.includes(product.id)}
            toggleIsFavorite={addFavoritesItem}
            reviews={product.reviews}
            brand={product.brand}
                  bottles={product.bottles}
                  available={product.available}
            price={product.price}
          />
        ))}
      </div>

      {products.length > visibleCount && (
        <LoadMoreButton
          onClick={() => setVisibleCount(count => count + 8)}
        >
          {t("loadMore")}
        </LoadMoreButton>
      )}
    </div>
  );
};
