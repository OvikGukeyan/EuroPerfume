"use client";
import { useLocale } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import { useDayOfferClock } from "@/src/shared/hooks/use-day-offer";
import { dayOfferActive } from "@/src/shared/lib/day-offer";
import { Sparkles, ArrowUpRight } from "lucide-react";
import type { FeaturedDayFragrance } from "@/src/shared/server-lib/get-active-day-fragrance";

const money=(n:number)=>new Intl.NumberFormat("de-DE",{style:"currency",currency:"EUR"}).format(n);
export function FragranceDayHero({offer}:{offer:FeaturedDayFragrance}) {
 const ru=useLocale()==="ru";
 const now=useDayOfferClock({dayOfferStartsAt:offer.startsAt,dayOfferEndsAt:offer.endsAt});
 if(!dayOfferActive({dayOfferStartsAt:offer.startsAt,dayOfferEndsAt:offer.endsAt},now))return null;
 const end=new Date(offer.endsAt);
 const lastDay=new Date(end.getTime()-1000);
 const time=new Intl.DateTimeFormat(ru?"ru-RU":"de-DE",{day:"numeric",month:"long",timeZone:"Europe/Berlin"}).format(lastDay);
 return <section aria-label={ru?"Аромат недели со скидкой":"Duft der Woche"} className="relative isolate overflow-hidden rounded-[22px] bg-[#eee8df] px-5 py-7 text-[#282622] md:min-h-[410px] md:rounded-[28px] md:px-14 md:py-12">
  <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-28 h-[380px] w-[460px] rounded-full bg-[#d6c6b5]/50 blur-[80px]" />
  <div className="relative grid grid-cols-[1.15fr_.85fr] items-center gap-3 md:grid-cols-2 md:gap-12">
   <div className="relative z-10">
    <div className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.18em] text-[#8a715e] md:text-[12px]"><Sparkles size={14}/>{ru?"АРОМАТ НЕДЕЛИ":"DUFT DER WOCHE"}</div>
    <h2 className="mt-4 font-serif text-[30px] leading-[1.07] tracking-[-.035em] md:mt-6 md:text-[58px]">{offer.name}</h2>
    <p className="mt-2 text-[12px] uppercase tracking-[.12em] text-[#83746a] md:text-[15px]">{offer.brand}</p>
    <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1 md:mt-7">
      <strong className="text-[27px] tracking-tight md:text-[39px]">{money(offer.salePrice)}</strong>
      <del className="text-[14px] text-[#8c8076] md:text-[19px]">{money(offer.regularPrice)}</del>
      <span className="rounded-full bg-[#41372f] px-3 py-1 text-[12px] font-semibold text-white">−10%</span>
    </div>
    <p className="mt-1 text-[11px] text-[#75685d] md:text-[13px]">{offer.volume} ml · {ru?"До конца":"Bis Ende"} {time}</p>
    <Link href={offer.href} className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#292825] px-5 py-3 text-[12px] font-semibold text-white transition hover:bg-[#54473d] md:mt-8 md:px-7 md:text-[15px]">
      {ru?"Посмотреть аромат":"Duft entdecken"}<ArrowUpRight size={16}/>
    </Link>
   </div>
   <Link href={offer.href} aria-label={offer.brand+" "+offer.name} className="relative flex aspect-[3/4] w-full items-center justify-center rounded-[20px] bg-[#f7f3ed]/55 p-3 md:aspect-[4/4] md:p-8">
    {offer.image&&<img src={offer.image} alt={offer.brand+" "+offer.name} className="h-full w-full object-contain mix-blend-multiply drop-shadow-[0_16px_14px_rgba(85,67,54,.16)]"/>}
   </Link>
  </div>
 </section>;
}
