"use client";

import { useCartStore } from "@/shared/store";
import React, { FC } from "react";
import toast from "react-hot-toast";
import { ChooseProductForm } from "./choose-product-form";
import { Product } from "@prisma/client";
import { Volume } from "@/shared/constants/perfume";

interface Props {
  product: Product;
  onSubmit?: VoidFunction;
  className?: string;
}
export const ProductForm: FC<Props> = ({
  product,
  className,
  onSubmit: _onSubmit,
}) => {
  const [addCartItem, loading] = useCartStore((state) => [
    state.addCartItem,
    state.loading,
  ]);

  const onSubmit = async (productId: number, volume: Volume) => {
    try {
      await addCartItem({
        productId,
        volume
      });
      toast.success(product.name + " added to cart");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
    _onSubmit?.();
  };

  // if (isPizzaForm) {
  //     return (
  //         <ChoosePizzaForm
  //             imageUrl={product.imageUrl}
  //             name={product.name}
  //             ingredients={product.ingredients}
  //             items={product.items}
  //             onSubmit={onSubmit}
  //             loading={loading}
  //         />
  //     )
  // }

  return (
    <ChooseProductForm
      id={product.id}
      imageUrl={product.imageUrl}
      name={product.name}
      description={product.description}
      onSubmit={onSubmit}
      price={product.price}
      itemNotes={product.notes}
      gender={product.gender}
      loading={loading}
      
    />
  );
};
