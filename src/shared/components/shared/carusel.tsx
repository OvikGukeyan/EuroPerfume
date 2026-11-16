"use client";
import { PromotionHero } from "./promotion-hero";
import type { HeroPromotion } from "@/src/shared/server-lib/get-hero-promotion";
import { useDayOfferClock } from "../../hooks/use-day-offer";

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
import { useLocale } from "next-intl";
import { Link } from "@/src/i18n/navigation";

interface Props {
  slides: (Slide & { images: SlideImage[] })[];
  className?: string;
  promotion?: HeroPromotion | null;
}
export const Carusel: FC<Props> = ({ slides, promotion }) => {
  const autoplayPlugin = useMemo(() => Autoplay({ delay: 6000 }), []);
  const locale = useLocale();
  const language = locale === "de" ? Languages.DE : Languages.RU;
  
  const now = useDayOfferClock(slides.map(s=>({dayOfferStartsAt:s.visibleFrom,dayOfferEndsAt:s.visibleUntil})));
  const visibleSlides = slides.filter(s=>(!s.visibleFrom || new Date(s.visibleFrom).getTime() <= now) && (!s.visibleUntil || new Date(s.visibleUntil).getTime() > now));
  if (!visibleSlides.length && !promotion) {
    return null;
  }
  return (
    <Carousel className="mx-auto w-full max-w-[1440px] px-4 md:px-8" plugins={[autoplayPlugin]}>
      <CarouselContent>
        {promotion && (
          <CarouselItem className="w-full">
            <PromotionHero promotion={promotion}/>
          </CarouselItem>
        )}
        {visibleSlides.map((slide, index) => (
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
