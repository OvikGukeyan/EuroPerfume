"use client";
import React, { FC, useMemo } from "react";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import { ProductDTO } from "../../services/dto/product.dto";
import { cn } from "../../lib/utils";
import Autoplay from "embla-carousel-autoplay";
import { ProductSelectionItem, Title } from ".";
import { useFavorites } from "../../hooks";

type Props = {
  items: ProductDTO[];
  title: string;
  className?: string;
};

export const ProductsCarusel: FC<Props> = ({ className, items, title }) => {
  const autoplayPlugin = useMemo(() => Autoplay({ delay: 4000 }), []);
  const { favoriteIds, addFavoritesItem } = useFavorites();

  return (
    <div className={cn("recommendations-carousel", className)}>
      <Title
        size="lg"
        className="mb-5 mt-4 text-center font-normal tracking-tight md:mb-7 md:mt-7"
        text={title}
      />
      <Carousel
        className="w-full"
        plugins={[autoplayPlugin]}
        opts={{ align: "start" }}
      >
        <CarouselContent className="items-start px-1 sm:px-2">
          {items.map((item, index) => (
            <CarouselItem
              key={index}
              className="flex min-w-0 basis-1/2 items-start py-2 md:basis-1/3 md:py-3 lg:basis-1/4"
            >
                <ProductSelectionItem dayOffer={item}
                  brand={item.brand}
                  bottles={item.bottles}
                  available={item.available}
                  productGroup={item.productGroup}
                  id={item.id}
                  name={item.name}
                  imageUrl={item.imageUrl[0] || item.variations[0]?.imageUrl}
                  variations={item.variations}
                  concentration={item.concentration || undefined}
                  discountPrice={item.discountPrice || undefined}
                  price={item.price}
                  isBestseller={!!item.isBestseller}
                  isFavorite={favoriteIds.includes(item.id)}
                  toggleIsFavorite={addFavoritesItem}
                />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};
