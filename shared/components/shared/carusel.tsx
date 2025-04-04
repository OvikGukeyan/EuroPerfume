"use client";

import React, { FC, useMemo } from "react";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { Slide } from "@prisma/client";
import Link from "next/link";

interface Props {
  slides: Slide[];
  className?: string;
}
export const Carusel: FC<Props> = ({ slides }) => {
  const autoplayPlugin = useMemo(() => Autoplay({ delay: 4000 }), []);

  return (
    <Carousel className="w-full" plugins={[autoplayPlugin]}>
      <CarouselContent>
        {slides.map((slide, index) => (
          <CarouselItem key={index} className="w-full">
            <Link href={slide.href}>
              <div className="relative w-full h-[600px]">
                <Image
                  src={slide.desctopImg}
                  alt="slide"
                  layout="fill"
                  objectFit="cover"
                  quality={80}
                />
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};
