"use client";

import React, { useRef } from "react";
import { useIntersection } from "react-use";
import { ProductCard, Title } from ".";
import { cn } from "@/shared/lib/utils";

import { ProductDTO } from "@/shared/services/dto/product.dto";

interface Props {
  title: string;
  items: ProductDTO[];
  className?: string;
  listClassName?: string;
  categoryId: number;
}

export const ProductsGroupList: React.FC<Props> = ({
  title,
  items,
  listClassName,
  categoryId,
  className,
}) => {
  const intersectionRef = useRef(null);
  const intersection = useIntersection(intersectionRef, { threshold: 0.4 });



  return (
    <div className={className} id={title} ref={intersectionRef}>
      <Title text={title} size="lg" className="font-extrabold mb-5" />
      <div
        className={cn(
          "grid grid-cols-2 gap-x-3   lg:grid-cols-4 md:gap-x-[20px] md:gap-y-[60px]",
          listClassName
        )}
      >
        {items.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            imageUrl={product.imageUrl[0]}
            price={product.price}
            available={product.available}
            categoryId={product.categoryId}
            variations={product.variations}
          />
        ))}
      </div>
    </div>
  );
};
