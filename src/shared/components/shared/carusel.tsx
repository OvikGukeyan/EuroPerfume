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
              <div className="relative isolate flex h-[184px] w-full items-center overflow-hidden rounded-[18px] bg-[#ebe7e0] px-5 sm:h-[208px] md:h-[300px] md:rounded-[24px] md:px-14">
                <div className="relative z-10 flex w-[58%] min-w-0 flex-col items-start justify-center md:w-[55%]">
                  <span className="text-[8px] font-medium uppercase tracking-[.13em] text-[#756f67] md:text-[11px]">EURO PERFUME</span>
                  <h2 className="mt-2 max-w-[275px] font-serif text-[23px] leading-[1.13] tracking-[-.025em] text-[#282520] sm:text-[28px] md:mt-4 md:max-w-[440px] md:text-[46px]">
                    {locale==="ru" ? promotion.titleRu : promotion.titleDe}
                  </h2>
                  <span className="mt-4 inline-flex items-center rounded-md bg-[#272522] px-3.5 py-2.5 text-[10px] font-medium text-white transition-colors group-hover:bg-[#4c4740] md:mt-6 md:px-6 md:py-3 md:text-[13px]">
                    {locale==="ru" ? "Открыть акцию" : "Aktion entdecken"}
                  </span>
                </div>
                <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-2 flex w-[42%] items-center justify-center md:right-12 md:w-[39%]">
                  <div className="absolute bottom-[17%] h-[10%] w-[95%] rounded-full bg-[#94816c]/15 blur-[13px]" />
                  {promotion.image ? (
                    <img src={promotion.image} alt="" className="relative h-[83%] w-full object-contain" />
                  ) : (
                    <div className="relative flex h-[77%] w-full items-end justify-center gap-[6%] md:h-[73%]">
                      {promotion.products.slice(0,3).map((p,i)=>(
                        <div key={p.id} className="relative flex h-full w-[29%] max-w-[98px] flex-col items-center justify-end" style={{transform:i===1?"translateY(-3%)":"none"}}>
                          <div className="relative z-10 h-[15%] w-[45%] rounded-t-[3px] bg-gradient-to-r from-[#292824] via-[#494540] to-[#1e1e1c] shadow-sm" />
                          <div className="relative z-10 h-[9%] w-[58%] rounded-t-[2px] bg-gradient-to-r from-[#161715] via-[#3d3b38] to-[#171817]" />
                          <div className="relative h-[72%] w-[72%] overflow-hidden rounded-b-[5px] rounded-t-[2px] border border-[#bdb3a4]/60 bg-gradient-to-r from-[#d8ccaf]/60 via-[#f2e9d5]/85 to-[#baa783]/65 shadow-[inset_2px_0_5px_rgba(255,255,255,.72),0_10px_12px_rgba(65,50,33,.12)]">
                            <div className="absolute left-[12%] top-[7%] h-[81%] w-[9%] rounded-full bg-white/40 blur-[2px]" />
                            <div className="absolute inset-x-[6%] top-[35%] flex min-h-[37%] items-center justify-center bg-[#f8f5ee]/95 px-[1px] py-1">
                              <span className="line-clamp-3 break-words text-center text-[5px] font-semibold leading-tight text-[#3f3b36] sm:text-[7px] md:text-[10px]">{p.name.trim()}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
