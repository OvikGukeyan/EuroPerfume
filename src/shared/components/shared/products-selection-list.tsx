"use client";
import React, { FC, useState } from "react";
import { ProductCaruselItem } from ".";
import { Button } from "..";
import { useTranslations } from "next-intl";
import { cn } from "../../lib/utils";
import { SelectedProductDTO } from "../../lib/get-popular-products";

interface Props {
  className?: string;
  products: SelectedProductDTO[];
}

export const ProductsSelectionList: FC<Props> = ({ products, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("ProductsSelection");
  const productsToShow = isOpen ? products : products.slice(0, 12);

  return (
    <div className={cn(className, "w-full flex flex-col items-center  py-10")}>
      <div
        className={cn(
          "w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 transition-all duration-700 overflow-hidden",
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
          />
        ))}
      </div>

      {products.length > 4 && (
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full sm:w-[200px] mt-10"
          variant="outline"
        >
          {isOpen ? t("showLess") : t("showAll")}
        </Button>
      )}
    </div>
  );
};
