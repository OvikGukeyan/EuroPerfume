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
  const productsToShow = isOpen ? products : products.slice(0, 4);
  return (
    <div className={cn(className, "flex flex-col items-center")}>
      <div className="grid grid-cols-2 md:grid-cols-4  gap-4">
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
          {t("showAll")}
        </Button>
      )}
    </div>
  );
};
