'use client';
import React, { FC, useMemo } from "react";
import { cn } from "../../lib/utils";
import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import Link from "next/link";
import { useRecommendations } from "../../hooks";
import { ProductDTO } from "../../services/dto/product.dto";

type Props = {
  className?: string;
  product: ProductDTO;
};

export const Recommendations: FC<Props> = ({ className, product }) => {
  const recommendations = useRecommendations(product);
  const autoplayPlugin = useMemo(() => Autoplay({ delay: 4000 }), []);
  console.log(recommendations);
  return (
    <div className={cn("", className)}>
      <Carousel className="w-full" plugins={[autoplayPlugin]}>
        <CarouselContent>
          {/* {items.map((item, index) => (
            <CarouselItem key={index} className="w-full">
              <Link href={item.href}></Link>
            </CarouselItem>
          ))} */}
        </CarouselContent>
      </Carousel>
    </div>
  );
};
