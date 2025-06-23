import React, { FC, use } from "react";
import { ProductsSelectionList, Title } from "..";
import { ProductDTO } from "../../services/dto/product.dto";
import { SelectedProductDTO } from "../../lib/get-popular-products";

type Props = {
  title: string;
  getFunction: () => Promise<SelectedProductDTO[]>;
  className?: string;
};
export const ProductsSelection: FC<Props> = ({
  className,
  title,
  getFunction,
}) => {
  const products = use(getFunction());

  return (
    <>
      {products.length > 0 && (
        
        <div className="flex flex-col items-center px-5">
          <div className="flex items-center justify-center gap-4 w-full">
            <div className="h-1 w-12 bg-black"></div>
            <Title
              className="text-2xl sm:text-3xl  md:text-5xl   font-extrabold text-center my-10"
              text={title.toUpperCase()}
            />
            <div className="h-1 w-12 bg-black"></div>
          </div>

          <ProductsSelectionList products={products} />
        </div>
      )}
    </>
  );
};
