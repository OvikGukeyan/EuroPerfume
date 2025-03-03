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
import { Container } from "@/shared/components/shared";
import Autoplay from "embla-carousel-autoplay";

export const Carusel: FC = () => {
  // Мемоизируем плагин, чтобы он создавался один раз
  const autoplayPlugin = useMemo(() => Autoplay({ delay: 4000 }), []);

  return (
      <Carousel className="w-full" plugins={[autoplayPlugin]}>
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index} className="w-full">
              <div className="relative w-full h-[600px]">
                <Image
                  src="/assets/images/slide1.avif"
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