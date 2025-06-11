"use client";
import React, { FC, useEffect, useState } from "react";
import { ProductsCarusel } from "..";
import { Api } from "../../services/api-client";
import { ProductDTO } from "../../services/dto/product.dto";

type Props = {
  className?: string;
};

export const PopularProducts: FC<Props> = ({ className }) => {
  const [popularProducts, setPopularProducts] = useState<ProductDTO[]>([]);
  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        const response = await Api.products.getPopularProducts();
        setPopularProducts(response);
      } catch (error) {
        console.error("Error fetching popular products:", error);
      }
    };
    fetchPopularProducts();
  }, []);
  return (
    <>
      {popularProducts.length > 0 && (
        <ProductsCarusel
          className={className}
          items={popularProducts}
          title="Popular Products"
        />
      )}
    </>
  );
};
