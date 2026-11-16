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
              <div className="relative isolate h-[224px] overflow-hidden rounded-[20px] bg-[#eee8df] px-5 py-6 sm:h-[250px] md:h-[350px] md:rounded-[28px] md:px-14 md:py-12">
                <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-20 h-[250px] w-[290px] rounded-full bg-[#dfd2c5]/55 blur-[65px] md:right-4 md:h-[400px] md:w-[520px]" />
                <div className="relative z-10 flex h-full w-[58%] flex-col items-start justify-center md:w-[52%]">
                  <span className="text-[9px] font-semibold uppercase tracking-[.15em] text-[#877769] md:text-[12px]">EURO PERFUME · {locale==="ru"?"ПОДБОРКА":"DUFT-SET"}</span>
                  <h2 className="mt-3 max-w-[320px] font-serif text-[25px] leading-[1.1] tracking-[-.03em] text-[#2b2925] sm:text-[30px] md:mt-5 md:text-[49px]">{locale==="ru" ? promotion.titleRu : promotion.titleDe}</h2>
                  <p className="mt-2 max-w-[240px] text-[11px] leading-snug text-[#625a51] sm:text-[12px] md:mt-4 md:max-w-[370px] md:text-[16px]">{locale==="ru"?"Два древесных аромата + третий в подарок":"Zwei holzige Düfte + eine Gratisprobe"}</p>
                  <span className="mt-4 inline-flex items-center rounded-full bg-[#292825] px-4 py-2.5 text-[11px] font-medium text-white transition-colors group-hover:bg-[#51463c] md:mt-6 md:px-7 md:py-3 md:text-[14px]">
                    {locale==="ru"?"Смотреть предложение":"Angebot entdecken"} <span aria-hidden="true" className="ml-2">→</span>
                  </span>
                </div>
                <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-[49%] md:right-8 md:w-[48%]">
                  <div className="absolute bottom-[10%] right-[2%] h-[20%] w-[92%] rounded-[50%] bg-[#b6a596]/20 blur-[17px]" />
                  {promotion.image ? <img src={promotion.image} alt="" className="absolute inset-0 h-full w-full object-contain" /> :
                    promotion.products.slice(0,3).map((p,i)=>(
                      <div key={p.id} className={`absolute bottom-[13%] flex h-[67%] w-[48%] items-end justify-center md:bottom-[11%] md:h-[78%] ${i===0?"right-[47%] z-[2]":i===1?"right-[26%] z-[3]":"right-[0%] z-[1]"}`}>
                        {p.image&&<img src={p.image} alt="" className="h-full w-full object-contain mix-blend-multiply drop-shadow-[0_16px_12px_rgba(70,54,42,0.17)]" />}
                      </div>
                    ))}
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
