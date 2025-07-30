"use client";
import React, { FC, useState } from "react";
import { ProductCaruselItem } from ".";
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
    <div className={cn(className, "w-full flex flex-col items-center  py-10")}>
      <div
        className={cn(
          "w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 transition-all duration-700 overflow-hidden pt-3",
          isOpen ? "md:max-h-[2300px]" : "md:max-h-[1100px]"
        )}
      >
        {productsToShow.map((product) => (
          <ProductCaruselItem
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
