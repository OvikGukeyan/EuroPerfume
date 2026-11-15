import React, { FC, use } from "react";
import { ProductsSelectionList, Title } from "..";
import { SelectedProductDTO } from "../../server-lib/get-popular-products";
import { cn } from "../../lib/utils";


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
        
        <section className={cn("home-section flex flex-col items-center", className)}>
          <div className="home-section-heading w-full"><div>
            <p className="home-eyebrow">EURO PERFUME</p>
            <h2>{title}</h2>
          </div></div>

          <ProductsSelectionList products={products}/>
        </section>
      )}
    </>
  );
};
