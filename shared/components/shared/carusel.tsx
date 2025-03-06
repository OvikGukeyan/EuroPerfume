"use client";

import React, { FC, useMemo } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { Slide } from "@prisma/client";


interface Props {
  slides: Slide[],
  className?: string    
}
export const Carusel: FC<Props> = ({ slides }) => {
  // Мемоизируем плагин, чтобы он создавался один раз
  const autoplayPlugin = useMemo(() => Autoplay({ delay: 4000 }), []);

  return (
      <Carousel className="w-full" plugins={[autoplayPlugin]}>
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index} className="w-full">
              <div className="relative w-full h-[600px]">
                <Image
                  src={slide.desctopImg}
                  alt="slide"
                  layout="fill"
                  objectFit="cover"
                  quality={80}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Если нужны стрелки, раскомментируйте их */}
        {/* <CarouselPrevious /> */}
        {/* <CarouselNext /> */}
      </Carousel>
  );
};