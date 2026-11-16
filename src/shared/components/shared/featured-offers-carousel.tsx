"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import { Languages, Slide, SlideImage } from "@prisma/client";
import type { FeaturedDayFragrance } from "@/src/shared/server-lib/get-active-day-fragrance";
import type { HeroPromotion } from "@/src/shared/server-lib/get-hero-promotion";
import { FragranceDayHero } from "./fragrance-day-hero";
import { PromotionHero } from "./promotion-hero";

type SlideWithImages=Slide & {images:SlideImage[]};
type Item=
 | {kind:"week";key:string;offer:FeaturedDayFragrance}
 | {kind:"promo";key:string;offer:HeroPromotion}
 | {kind:"slide";key:string;slide:SlideWithImages};

export function FeaturedOffersCarousel({featured,promotions,slides}:{
 featured?:FeaturedDayFragrance;promotions:HeroPromotion[];slides:SlideWithImages[];
}){
 const locale=useLocale(),language=locale==="de"?Languages.DE:Languages.RU;
 const offers:Item[]=[
  ...(featured?[{kind:"week" as const,key:"fragrance-week",offer:featured}]:[]),
  ...promotions.map(p=>({kind:"promo" as const,key:p.slug,offer:p})),
  ...slides.map(p=>({kind:"slide" as const,key:"slide-"+p.id,slide:p}))
 ];
 const [active,setActive]=useState(0);
 const start=useRef<number|null>(null);
 const swipeClick=useRef(false);
 const count=offers.length;
 const index=count?Math.min(active,count-1):0;
 useEffect(()=>{
   if(count<=1)return;
   const timer=window.setTimeout(()=>setActive(i=>(i+1)%count),6500);
   return ()=>window.clearTimeout(timer);
 },[count,active]);
 if(!count)return null;
 const go=(n:number)=>setActive((n+count)%count);
 const item=offers[index];
 const onStart=(e:React.TouchEvent)=>{swipeClick.current=false;start.current=e.changedTouches[0]?.clientX??null;};
 const onEnd=(e:React.TouchEvent)=>{
   if(start.current===null)return;
   const delta=(e.changedTouches[0]?.clientX??start.current)-start.current;
   start.current=null;
   if(Math.abs(delta)>=45){swipeClick.current=true;go(index+(delta<0?1:-1));}
 };
 return <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8">
  <div className="w-full min-w-0 overflow-hidden" aria-label={locale==="ru"?"Слайдер предложений":"Angebotskarussell"} onTouchStart={onStart} onTouchEnd={onEnd} onClickCapture={e=>{if(swipeClick.current){e.preventDefault();e.stopPropagation();swipeClick.current=false;}}}>
   <div key={item.key} className="w-full min-w-0 animate-in fade-in duration-300">
    {item.kind==="week"?<FragranceDayHero offer={item.offer}/>:
     item.kind==="promo"?<PromotionHero promotion={item.offer}/>:
      <Link href={item.slide.href} className="block w-full overflow-hidden rounded-[18px] md:rounded-[25px]">
       <picture>
        <source media="(max-width:767px)" srcSet={item.slide.images.find(i=>i.language===language)?.mobileImg}/>
        <source media="(min-width:768px)" srcSet={item.slide.images.find(i=>i.language===language)?.desctopImg}/>
        <Image src={item.slide.images.find(i=>i.language===language)?.mobileImg||""} alt={item.slide.name||"EURO PERFUME"} width={1100} height={750} className="block h-auto w-full object-contain" quality={85}/>
       </picture>
      </Link>}
   </div>
  </div>
  {count>1&&<nav aria-label={locale==="ru"?"Переключение предложений":"Angebote wechseln"} className="mt-4 flex flex-wrap items-center justify-center gap-3">
   <button type="button" onClick={()=>go(index-1)} aria-label={locale==="ru"?"Предыдущее предложение":"Vorheriges Angebot"} className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d7d4d0] bg-white text-[#4b4341] hover:bg-[#f6f4f2]">‹</button>
   <div className="flex items-center gap-2">
    {offers.map((o,i)=><button type="button" key={o.key} onClick={()=>go(i)} aria-label={locale==="ru"?"Слайд "+(i+1)+" из "+count:"Folie "+(i+1)+" von "+count} aria-current={index===i?"true":undefined} className={`h-2.5 rounded-full transition-all ${index===i?"w-8 bg-[#342f30]":"w-2.5 bg-[#d3cfcb] hover:bg-[#968d87]"}`}/>)}
   </div>
   <button type="button" onClick={()=>go(index+1)} aria-label={locale==="ru"?"Следующее предложение":"Nächstes Angebot"} className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d7d4d0] bg-white text-[#4b4341] hover:bg-[#f6f4f2]">›</button>
  </nav>}
 </div>;
}
