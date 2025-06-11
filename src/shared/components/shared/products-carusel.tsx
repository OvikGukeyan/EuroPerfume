import React, { FC, useMemo } from "react";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import { ProductDTO } from "../../services/dto/product.dto";
import { cn } from "../../lib/utils";
import Autoplay from "embla-carousel-autoplay";
import { ProductCard, ProductCaruselItem, Title } from ".";
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
      <Title size="xl" className="font-extrabold text-center my-10" text={title} />
      <Carousel className="w-full" plugins={[autoplayPlugin]}>
        <CarouselContent className="px-2">
          {items.map((item, index) => (
            <CarouselItem
              key={index}
              className="w-full basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <Link href={`/product/${item.id}`}>
                <ProductCaruselItem
                  productGroup={item.productGroup}
                  id={item.id}
                  name={item.name}
                  imageUrl={item.imageUrl[0] || item.variations[0].imageUrl}
                  variations={item.variations}
                />
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};
