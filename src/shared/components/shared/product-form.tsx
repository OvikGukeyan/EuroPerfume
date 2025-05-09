"use client";

import { useCartStore } from "@/src/shared/store";
import React, { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ChooseProductForm } from "./choose-product-form";
import {
  ProductTranslation,
  ProductVariation,
} from "@prisma/client";
import { Volume } from "@/src/shared/constants/perfume";
import { ProductDTO } from "@/src/shared/services/dto/product.dto";

export interface ProductWithTranslations extends ProductDTO {
  translations: ProductTranslation[];
}
interface Props {
  product: ProductWithTranslations;
  onSubmit?: VoidFunction;
  className?: string;
}
export const ProductForm: FC<Props> = ({
  product,
  className,
  onSubmit: _onSubmit,
}) => {
  const [activeVariation, setActiveVariation] = useState<ProductVariation>(
    product.variations[0]
  );

  const [addCartItem, loading] = useCartStore((state) => [
    state.addCartItem,
    state.loading,
  ]);

  const onSubmit = async (productId: number, volume: Volume) => {
    try {
      await addCartItem({
        productId,
        volume:
          product.categoryId === 1 &&
          product.productGroupId &&
          product.productGroupId < 4
            ? volume
            : 1,
        variationId: activeVariation.id,
      });
      toast.success(product.name + " added to cart");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
    _onSubmit?.();
  };

  useEffect(() => {
    const viewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
    const updated = [product.id, ...viewed.filter((id: number) => id !== product.id)].slice(0, 10);
    localStorage.setItem("recentlyViewed", JSON.stringify(updated));
  }, [product.id]);

  return (
    <ChooseProductForm
      activeVariation={activeVariation}
      setActiveVariation={setActiveVariation}
      onSubmit={onSubmit}
      loading={loading}
      product={product}
    />
  );
};
