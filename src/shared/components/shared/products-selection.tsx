import React, { FC, use } from "react";
import { ProductsCarusel } from "..";
import { ProductDTO } from "../../services/dto/product.dto";

type Props = {
  title: string;
  getFunction: () => Promise<ProductDTO[]>
  className?: string;
};
export const ProductsSelection: FC<Props> = ({ className, title, getFunction }) => {
const popularProducts = use(getFunction());

  return (
    <>
      {popularProducts.length > 0 && (
        <ProductsCarusel
          className={className}
          items={popularProducts}
          title={title}
        />
      )}
    </>
  );
};
