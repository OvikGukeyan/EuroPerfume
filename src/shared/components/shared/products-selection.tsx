import React, { FC, use } from "react";
import { Button, ProductCaruselItem, Title } from "..";
import { ProductDTO } from "../../services/dto/product.dto";
import { useTranslations } from "next-intl";

type Props = {
  title: string;
  getFunction: () => Promise<ProductDTO[]>;
  className?: string;
};
export const ProductsSelection: FC<Props> = ({
  className,
  title,
  getFunction,
}) => {
  const products = use(getFunction());
  const t = useTranslations("ProductsSelection");

  return (
    <>
      {products.length > 0 && (
        
        <div className="flex flex-col items-center px-5">
          <div className="flex items-center justify-center gap-4 w-full">
            <div className="h-1 w-12 bg-black"></div>
            <Title
              className="text-2xl sm:text-3xl  md:text-5xl   font-extrabold text-center my-10"
              text={title}
            />
            <div className="h-1 w-12 bg-black"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4  gap-4">
            {products.slice(0, 4).map((product) => (
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

          <Button variant="outline">{t("showAll")}</Button>
        </div>
      )}
    </>
  );
};
