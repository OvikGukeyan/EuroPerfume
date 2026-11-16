"use client";
import { trackPromotion } from "./promotion-tracker";
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
            <Link href={promotion.preview ? "/wood-trio" : `/offers/${promotion.slug}`} onClick={()=>{if(!promotion.preview) void trackPromotion(promotion.slug,"click")}} className="group block">
              <div className="relative flex h-[190px] w-full items-center overflow-hidden rounded-lg bg-[#eeeae2] px-5 md:h-[310px] md:px-16">
                <div className="relative z-10 flex w-[59%] flex-col items-start gap-3 md:w-1/2 md:gap-5">
                  <span className="text-[8px] font-medium tracking-[.2em] text-[#827b71] md:text-[11px]">EURO PERFUME · SPECIAL OFFER</span>
                  <h2 className="font-serif text-[20px] font-medium leading-tight text-[#282822] md:text-[44px]">{locale==="ru" ? promotion.titleRu : promotion.titleDe}</h2>
                  <span className="rounded-sm bg-[#282822] px-3 py-2 text-[10px] font-medium text-white transition-colors group-hover:bg-[#474740] md:px-6 md:py-3 md:text-[13px]">
                    {locale==="ru"?"Открыть акцию":"Aktion entdecken"}
                  </span>
                </div>
                <div className="absolute inset-y-3 right-2 flex w-[42%] items-center justify-center gap-1 md:right-8 md:w-[45%] md:gap-3">
                  {promotion.image ? <img src={promotion.image} alt="" className="h-full w-full object-contain" /> :
                  promotion.products.slice(0,3).map((p,i)=><div key={p.id} className="flex h-[75%] min-w-0 flex-1 items-center justify-center overflow-hidden rounded-md bg-[#eeeae2]">
                    {p.image && <img src={p.image} alt={p.name} className="h-full max-h-[185px] w-full object-contain mix-blend-multiply" style={{transform:i===1?"scale(1.08)":"scale(1)"}}/>}
                  </div>)}
                </div>
              </div>
            </Link>
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
