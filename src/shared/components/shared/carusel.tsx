"use client";
import { PromotionHero } from "./promotion-hero";
import type { HeroPromotion } from "@/src/shared/server-lib/get-hero-promotion";
import { useDayOfferClock } from "../../hooks/use-day-offer";

import React, { FC, useEffect, useMemo, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
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
  promotions?: HeroPromotion[];
}
export const Carusel: FC<Props> = ({ slides, promotions = [] }) => {
  const autoplayPlugin = useMemo(() => Autoplay({ delay: 6000, stopOnInteraction: false }), []);
  const [api,setApi] = useState<CarouselApi>();
  const [selected,setSelected] = useState(0);
  const locale = useLocale();
  const language = locale === "de" ? Languages.DE : Languages.RU;
  
  const now = useDayOfferClock(slides.map(s=>({dayOfferStartsAt:s.visibleFrom,dayOfferEndsAt:s.visibleUntil})));
  const visibleSlides = slides.filter(s=>(!s.visibleFrom || new Date(s.visibleFrom).getTime() <= now) && (!s.visibleUntil || new Date(s.visibleUntil).getTime() > now));
  useEffect(()=>{
    if(!api) return;
    const update=()=>setSelected(api.selectedScrollSnap());
    update();
    api.on("select",update);
    api.on("reInit",update);
    return ()=>{api.off("select",update);api.off("reInit",update);};
  },[api]);
  if (!visibleSlides.length && !promotions.length) {
    return null;
  }
  return (
    <Carousel className="mx-auto w-full max-w-[1440px] px-4 md:px-8" opts={{loop:promotions.length+visibleSlides.length>1}} setApi={setApi} plugins={[autoplayPlugin]}>
      <CarouselContent>
        {promotions.map((promotion,index)=>(
          <CarouselItem className="w-full" key={promotion.slug}>
            <PromotionHero promotion={promotion}/>
          </CarouselItem>
        ))}
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
      {promotions.length>1 && (
        <nav aria-label={locale==="ru"?"Переключение акций":"Aktionen wechseln"} className="mt-3 flex items-center justify-center gap-3">
          <span className="text-xs font-medium text-neutral-600">{locale==="ru"?"Другие акции":"Weitere Aktionen"}</span>
          {promotions.map((promotion,index)=><button key={promotion.slug} type="button" onClick={()=>api?.scrollTo(index)} aria-label={`${locale==="ru"?"Акция":"Aktion"} ${index+1} ${locale==="ru"?"из":"von"} ${promotions.length}`} aria-current={selected===index?"true":undefined} className={`h-3 rounded-full transition-all ${selected===index?"w-8 bg-neutral-900":"w-3 bg-neutral-300 hover:bg-neutral-500"}`}/>)}
          <button type="button" className="rounded-full border border-neutral-300 px-3 py-1 text-xs text-neutral-800 hover:bg-neutral-100" onClick={()=>api?.scrollTo((selected+1)%promotions.length)}>{locale==="ru"?"Следующая акция →":"Nächste Aktion →"}</button>
        </nav>
      )}
      <CarouselPrevious className="left-5 hidden md:flex" />
      <CarouselNext className="right-5 hidden md:flex" />
    </Carousel>
  );
};
