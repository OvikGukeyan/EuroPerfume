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
import { Languages, Slide, SlideImage } from "@prisma/client";
import Link from "next/link";
import { useLocale } from "next-intl";

interface Props {
  slides: (Slide & { images: SlideImage[] })[];
  className?: string;
}
export const Carusel: FC<Props> = ({ slides }) => {
  const autoplayPlugin = useMemo(() => Autoplay({ delay: 4000 }), []);
  const locale = useLocale();
  const language = locale === "de" ? Languages.DE : Languages.RU;
  return (
    <Carousel className="w-full" plugins={[autoplayPlugin]}>
      <CarouselContent>
        {slides.map((slide, index) => (
          <CarouselItem key={index} className="w-full">
            <Link href={slide.href}>
              <div className="relative w-full aspect-[3.6/4] md:aspect-[10/3.5]">
                <picture className="w-full h-full">
                  <source media="(max-width: 767px)" srcSet={slide.images.find((img) => img.language === language)?.mobileImg} />
                  <source
                    media="(min-width: 767px)"
                    srcSet={slide.images.find((img) => img.language === language)?.desctopImg}
                  />
                  <Image
                    src={slide.images.find((img) => img.language === language)?.mobileImg || ''}
                    alt="slide"
                    layout="fill"
                    objectFit="cover"
                    quality={80}
                  />
                </picture>
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-5  hidden md:flex" />
      <CarouselNext className="right-5 hidden md:flex" />
    </Carousel>
  );
};
