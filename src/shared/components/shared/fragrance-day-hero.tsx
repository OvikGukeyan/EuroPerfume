"use client";

import {useLocale} from "next-intl";
import {Link} from "@/src/i18n/navigation";
import {useDayOfferClock} from "@/src/shared/hooks/use-day-offer";
import {catalogGrossPrice, dayOfferActive, hasPreVatPriceHistory} from "@/src/shared/lib/day-offer";
import type {FeaturedDayFragrance} from "@/src/shared/server-lib/get-active-day-fragrance";
import {WeeklyLuxuryArtwork} from "./weekly-luxury-artwork";

/** Keep the same responsive editorial slide regardless of which fragrance is selected. */
export function FragranceDayHero({offer}:{offer:FeaturedDayFragrance}){
 const ru=useLocale()==="ru";
 const now=useDayOfferClock({dayOfferStartsAt:offer.startsAt,dayOfferEndsAt:offer.endsAt});
 if(!dayOfferActive({dayOfferStartsAt:offer.startsAt,dayOfferEndsAt:offer.endsAt},now))return null;
 const showPriceComparison=!hasPreVatPriceHistory(now);
 const until=new Intl.DateTimeFormat(ru?"ru-RU":"de-DE",{day:"numeric",month:"long",timeZone:"Europe/Berlin"}).format(new Date(new Date(offer.endsAt).getTime()-1000));
 return <section aria-label={ru?"Аромат недели":"Duft der Woche"} className="weekly-luxury-hero w-full overflow-hidden rounded-[22px] md:rounded-[32px]">
  <Link href={offer.href} className="weekly-luxury-link block w-full" aria-label={`${offer.brand} ${offer.name}${showPriceComparison ? ` — ${ru?"скидка":"Rabatt"} 10%` : ""}`}>
   <WeeklyLuxuryArtwork
    name={offer.name} brand={offer.brand} image={offer.image} productId={offer.id}
    salePrice={catalogGrossPrice(offer.salePriceBasis,now)} regularPrice={catalogGrossPrice(offer.regularPriceBasis,now)} volume={offer.volume}
    showPriceComparison={showPriceComparison}
    ru={ru} until={until}/>
  </Link>
 </section>;
}
