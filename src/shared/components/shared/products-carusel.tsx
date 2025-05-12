import React, { FC, useMemo } from "react";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import { ProductDTO } from "../../services/dto/product.dto";
import { cn } from "../../lib/utils";
import Autoplay from "embla-carousel-autoplay";
import { ProductCard } from ".";
import Link from "next/link";

type Props = {
  items: ProductDTO[];
  title: string;
  className?: string;
};

export const ProductsCarusel: FC<Props> = ({ className, items, title }) => {
  const autoplayPlugin = useMemo(() => Autoplay({ delay: 4000 }), []);
  return (
    <div className={cn("", className)}>
      <h2 className="text-3xl text-center font-bold mb-4">{title}</h2>
      <Carousel className="w-full" plugins={[autoplayPlugin]}>
        <CarouselContent className="px-2">
          {items.map((item, index) => (
            <CarouselItem
              key={index}
              className="w-full basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <Link href={`/product/${item.id}`}>
                <ProductCard
                  id={item.id}
                  name={item.name}
                  imageUrl={item.imageUrl[0] || item.variations[0].imageUrl}
                  price={item.price}
                  variations={item.variations}
                  categoryId={item.categoryId}
                  productGroupId={item.productGroupId}
                />
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};
