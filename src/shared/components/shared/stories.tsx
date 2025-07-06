"use client";

import React, { FC, useMemo } from "react";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Product } from "@prisma/client";
import { Title } from ".";

interface Props {
  items: Product[];
  className?: string;
}
export const Stories: FC<Props> = ({ items }) => {
  const autoplayPlugin = useMemo(() => Autoplay({ delay: 8000 }), []);
  return (
    <Carousel
      className="w-full px-5"
      plugins={[autoplayPlugin]}
      opts={{ align: "start" }}
    >
      <CarouselContent>
        {items.map((item, index) => (
          <CarouselItem
            key={index}
            className="w-full basis-1/2 md:basis-1/4 relative"
          >
            <video
              preload="auto"
              src={item.videoUrl || ""}
              loop
              muted
              playsInline
              onTouchStart={(e) => e.currentTarget.play()}
              onTouchEnd={(e) => {
                e.currentTarget.pause();
                e.currentTarget.currentTime = 0;
              }}
              onMouseEnter={(e) => e.currentTarget.play()}
              onMouseLeave={(e) => {
                e.currentTarget.pause();
                e.currentTarget.currentTime = 0;
              }}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 right-0 text-white p-5">
              <p className="text-sm md:text-xl font-bold">{item.name}</p>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};
