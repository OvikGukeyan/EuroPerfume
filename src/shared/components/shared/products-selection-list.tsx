"use client";
import React, { FC, useState } from "react";
import { ProductSelectionItem } from ".";
import { Button } from "..";
import { useTranslations } from "next-intl";
import { cn } from "../../lib/utils";
import { SelectedProductDTO } from "../../lib/get-popular-products";
import { useFavorites } from "../../hooks";

interface Props {
  className?: string;
  products: SelectedProductDTO[];
}

export const ProductsSelectionList: FC<Props> = ({ products, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("ProductsSelection");
  const productsToShow = isOpen ? products : products.slice(0, 12);

  const { items: favorites, addFavoritesItem } = useFavorites();
  return (
    <div className={cn(className, "w-full flex flex-col items-center  ")}>
      <div
        className={cn(
          "w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-5 transition-all duration-700 overflow-hidden p-4 md:p-5",
          isOpen ? "md:max-h-[2400px]" : "md:max-h-[1200px]"
        )}
      >
        {productsToShow.map((product) => (
          <ProductSelectionItem
            key={product.id}
            productGroup={product.productGroup}
            id={product.id}
            name={product.name}
            imageUrl={product.imageUrl[0] || product.variations[0].imageUrl}
            variations={product.variations}
            concentration={product.concentration || undefined}
            discountPrice={product.discountPrice || undefined}
            isBestseller={!!product.isBestseller}
            isFavorite={favorites.some((item) => item.productId === product.id)}
            toggleIsFavorite={addFavoritesItem}
            reviews={product.reviews}
            brand={product.brand}
            price={product.price}
          />
        ))}
      </div>

      {products.length > 12 && (
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full sm:w-[200px] mt-10"
        >
          {isOpen ? t("showLess") : t("showAll")}
        </Button>
      )}
    </div>
  );
};
