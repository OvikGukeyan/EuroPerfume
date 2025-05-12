"use client";
import React, { FC } from "react";
import { useRecommendations } from "../../hooks";
import { ProductDTO } from "../../services/dto/product.dto";
import { ProductsCarusel } from "..";

type Props = {
  className?: string;
  product: ProductDTO;
};

export const Recommendations: FC<Props> = ({ className, product }) => {
  const recommendations = useRecommendations(product);
  return <ProductsCarusel className={className} items={recommendations} title="You may also like" />;
};
