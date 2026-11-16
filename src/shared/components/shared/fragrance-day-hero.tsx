"use client";

import { useLocale } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import { useDayOfferClock } from "@/src/shared/hooks/use-day-offer";
import { dayOfferActive } from "@/src/shared/lib/day-offer";
import type { FeaturedDayFragrance } from "@/src/shared/server-lib/get-active-day-fragrance";
import { ArrowUpRight } from "lucide-react";

const money=(value:number)=>new Intl.NumberFormat("de-DE",{style:"currency",currency:"EUR"}).format(value);

/**
 * Reusable weekly editorial: only the product image/name/price changes.
 * The scenery is CSS architecture, never a second background on the image.
 */
export function FragranceDayHero({offer}:{offer:FeaturedDayFragrance}){
 const ru=useLocale()==="ru";
 const now=useDayOfferClock({dayOfferStartsAt:offer.startsAt,dayOfferEndsAt:offer.endsAt});
 if(!dayOfferActive({dayOfferStartsAt:offer.startsAt,dayOfferEndsAt:offer.endsAt},now))return null;
 const endDay=new Date(new Date(offer.endsAt).getTime()-1000);
 const until=new Intl.DateTimeFormat(ru?"ru-RU":"de-DE",{day:"numeric",month:"long",timeZone:"Europe/Berlin"}).format(endDay);
 return <section aria-label={ru?"Аромат недели":"Duft der Woche"} className="relative isolate min-h-[350px] overflow-hidden rounded-[18px] bg-[#eae5df] text-[#292525] md:min-h-[410px] md:rounded-[25px]">
   {/* Restrained architectural depth: a continuous neutral scene for any bottle color. */}
   <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,#f4f0eb_0%,#e9e5df_48%,#d4cec8_100%)]"/>
   <div aria-hidden="true" className="pointer-events-none absolute right-[-15%] top-[-27%] h-[94%] w-[72%] rounded-full border-[33px] border-[#6a565b]/[.27] md:right-[-3%] md:top-[-45%] md:h-[135%] md:w-[55%] md:border-[66px]"/>
   <div aria-hidden="true" className="pointer-events-none absolute -right-12 bottom-[-52%] h-[93%] w-[65%] rounded-full bg-[#a29891]/30 blur-[55px]"/>
   <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[15%] bg-[linear-gradient(180deg,transparent,rgba(101,87,81,.09))]"/>
   <div className="relative z-10 grid min-h-[350px] grid-cols-[57%_43%] items-center gap-0 px-5 py-7 sm:grid-cols-[55%_45%] sm:px-8 md:min-h-[410px] md:grid-cols-[52%_48%] md:px-14 md:py-11">
    <div className="relative z-20 min-w-0 py-1">
     <p className="text-[9px] font-medium uppercase tracking-[.17em] text-[#6b5c5e] sm:text-[11px] md:text-[12px] md:tracking-[.23em]">
      EURO PERFUME <span aria-hidden="true" className="mx-1">·</span> {ru?"АРОМАТ НЕДЕЛИ":"DUFT DER WOCHE"}
     </p>
     <div aria-hidden="true" className="mt-4 h-px w-10 bg-[#89767c]/65 md:mt-6 md:w-16"/>
     <h2 className="mt-4 max-w-[480px] break-words font-serif text-[clamp(25px,6.5vw,41px)] font-normal leading-[1.05] tracking-[-.035em] md:mt-5 md:text-[clamp(39px,4.8vw,66px)]">{offer.name}</h2>
     <p className="mt-2 text-[10px] font-medium uppercase tracking-[.11em] text-[#74656a] sm:text-xs md:mt-4 md:text-[14px] md:tracking-[.19em]">{offer.brand}</p>
     <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1 md:mt-7">
      <span className="font-serif text-[31px] font-normal tracking-[-.04em] text-[#522f3e] md:text-[45px]">−10%</span>
      <span className="text-[11px] text-[#706966] md:text-[13px]">{ru?"на отливанты":"auf Duftproben"}</span>
     </div>
     <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1 md:mt-2">
      <strong className="text-[17px] font-semibold tabular-nums md:text-[24px]">{money(offer.salePrice)}</strong>
      <del className="text-[12px] tabular-nums text-[#77706d] md:text-[16px]">{money(offer.regularPrice)}</del>
      <span className="text-[10px] text-[#6c625e] md:text-xs">{offer.volume} ml</span>
     </div>
     <p className="mt-3 text-[10px] leading-relaxed text-[#655f5b] md:mt-5 md:text-[13px]">{ru?"Нишевая парфюмерия · Отливанты":"Nischendüfte · Duftabfüllungen"}</p>
     <p className="mt-1 text-[10px] text-[#766f6b] md:text-xs">{ru?"Акция до":"Angebot bis"} {until}</p>
     <Link href={offer.href} className="mt-4 inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-[3px] bg-[#2c2828] px-4 py-2.5 text-[11px] font-medium text-white transition-colors hover:bg-[#51434a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2c2828] md:mt-6 md:min-h-[48px] md:gap-3 md:px-7 md:text-[14px]">
      {ru?"Открыть аромат":"Duft entdecken"}<ArrowUpRight aria-hidden="true" size={15}/>
     </Link>
    </div>
    <Link href={offer.href} aria-label={offer.brand+" "+offer.name} className="relative z-10 flex h-full min-h-[290px] w-full items-center justify-center py-4 md:min-h-[360px] md:py-2">
      {offer.image?<img src={offer.image} alt={offer.brand+" "+offer.name} className="max-h-[305px] h-[91%] w-[112%] max-w-none object-contain mix-blend-multiply [mask-image:radial-gradient(ellipse_79%_85%_at_center,#000_66%,transparent_100%)] drop-shadow-[0_20px_18px_rgba(49,38,41,.16)] md:max-h-[360px] md:w-full"/>:null}
    </Link>
   </div>
 </section>;
}
