"use client";
import "./storefront-hero.css";
import { BlackFridayHero } from "./black-friday-hero";
import { BLACK_FRIDAY, blackFridayBannerVisible } from "@/src/shared/lib/black-friday";
import { PromotionHero } from "./promotion-hero";
import { FragranceDayHero } from "./fragrance-day-hero";
import type { FeaturedDayFragrance } from "@/src/shared/server-lib/get-active-day-fragrance";
import { dayOfferActive } from "@/src/shared/lib/day-offer";
import type { HeroPromotion } from "@/src/shared/server-lib/get-hero-promotion";
import { useDayOfferClock } from "../../hooks/use-day-offer";

import React, { FC, useEffect, useMemo, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "../ui/carousel";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import { Languages, Slide, SlideImage } from "@prisma/client";
import { useLocale } from "next-intl";
import { Link } from "@/src/i18n/navigation";

interface Props {
  slides: (Slide & { images: SlideImage[] })[];
  className?: string;
  promotions?: HeroPromotion[];
  dayFragrances?: FeaturedDayFragrance[];
  blackFriday?: boolean;
}
export const Carusel: FC<Props> = ({ slides, promotions = [], dayFragrances = [], blackFriday = false }) => {
  const autoplayPlugin = useMemo(() => Autoplay({ delay: 6000, stopOnInteraction: false }), []);
  const [api,setApi] = useState<CarouselApi>();
  const [selected,setSelected] = useState(0);
  const locale = useLocale();
  const language = locale === "de" ? Languages.DE : Languages.RU;
  
  const now = useDayOfferClock([{dayOfferStartsAt:BLACK_FRIDAY.bannerStartsAt,dayOfferEndsAt:BLACK_FRIDAY.endsAt},...slides.map(s=>({dayOfferStartsAt:s.visibleFrom,dayOfferEndsAt:s.visibleUntil})),...dayFragrances.map(f=>({dayOfferStartsAt:f.startsAt,dayOfferEndsAt:f.endsAt}))]);
  const visibleSlides = slides.filter(s=>(!s.visibleFrom || new Date(s.visibleFrom).getTime() <= now) && (!s.visibleUntil || new Date(s.visibleUntil).getTime() > now));
  const featured=dayFragrances.find(f=>dayOfferActive({dayOfferStartsAt:f.startsAt,dayOfferEndsAt:f.endsAt},now));
  const showDay=Boolean(featured);
  const showBlackFriday = blackFriday && blackFridayBannerVisible(now);
  const featuredCount=promotions.length+(showDay?1:0)+(showBlackFriday?1:0);
  const slideCount = featuredCount + visibleSlides.length;
  useEffect(()=>{
    if(!api) return;
    const viewport = api.rootNode();
    const update=()=>{
      const index = api.selectedScrollSnap();
      setSelected(index);
      const slide = api.slideNodes()[index];
      if (slide) viewport.style.height = `${Math.ceil(slide.getBoundingClientRect().height)}px`;
    };
    viewport.style.transition = "height 220ms ease";
    const observer = new ResizeObserver(update);
    api.slideNodes().forEach(slide => observer.observe(slide));
    update();
    api.on("select",update);
    api.on("reInit",update);
    return ()=>{ observer.disconnect(); api.off("select",update);api.off("reInit",update);viewport.style.removeProperty("height");viewport.style.removeProperty("transition"); };
  },[api]);
  if (!visibleSlides.length && !featuredCount) {
    return null;
  }
  return (
    <Carousel className="storefront-carousel mx-auto w-full max-w-[1440px] px-4 md:px-8" opts={{loop:featuredCount+visibleSlides.length>1}} setApi={setApi} plugins={[autoplayPlugin]}>
      <div className="relative">
      <CarouselContent className="items-start">
        {showBlackFriday && <CarouselItem className="w-full" key="black-friday-2026"><BlackFridayHero/></CarouselItem>}
        {showDay && featured && <CarouselItem className="w-full" key="fragrance-week"><FragranceDayHero offer={featured}/></CarouselItem>}
        {promotions.map((promotion,index)=>(
          <CarouselItem className="w-full" key={promotion.slug}>
            <PromotionHero promotion={promotion}/>
          </CarouselItem>
        ))}
        {visibleSlides.map((slide, index) => (
          <CarouselItem key={index} className="w-full">
            <Link href={slide.href}>
              <div className="legacy-slide-frame relative w-full aspect-[3.6/4] md:aspect-[10/3.5]">
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
      {slideCount > 1 && <>
        <button type="button" className="storefront-slide-arrow storefront-slide-arrow-prev" onClick={() => api?.scrollPrev()} aria-label={locale === "ru" ? "Предыдущий слайд" : "Vorherige Folie"}>
          <ChevronLeft aria-hidden="true" />
        </button>
        <button type="button" className="storefront-slide-arrow storefront-slide-arrow-next" onClick={() => api?.scrollNext()} aria-label={locale === "ru" ? "Следующий слайд" : "Nächste Folie"}>
          <ChevronRight aria-hidden="true" />
        </button>
      </>}
      </div>
      {slideCount > 1 && (
        <nav aria-label={locale === "ru" ? "Выбор слайда" : "Folienauswahl"} className="mt-3 flex items-center justify-center gap-1">
          {Array.from({ length: slideCount }, (_, index) => (
            <button key={index} type="button" onClick={() => api?.scrollTo(index)} aria-label={`${locale === "ru" ? "Слайд" : "Folie"} ${index + 1} ${locale === "ru" ? "из" : "von"} ${slideCount}`} aria-current={selected === index ? "true" : undefined} className="flex h-11 min-w-8 items-center justify-center rounded-full px-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-700">
              <span aria-hidden="true" className={`block h-3 rounded-full transition-all duration-300 motion-reduce:transition-none ${selected === index ? "w-8 bg-neutral-900" : "w-3 bg-neutral-300 hover:bg-neutral-500"}`} />
            </button>
          ))}
        </nav>
      )}
    </Carousel>
  );
};
