"use client";
import { useLocale } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import { BLACK_FRIDAY, blackFridayActive } from "@/src/shared/lib/black-friday";
import { useDayOfferClock } from "@/src/shared/hooks/use-day-offer";
import toast from "react-hot-toast";

export function BlackFridayHero() {
  const ru = useLocale() === "ru";
  const now = useDayOfferClock({dayOfferStartsAt:BLACK_FRIDAY.startsAt,dayOfferEndsAt:BLACK_FRIDAY.endsAt});
  if (now >= Date.parse(BLACK_FRIDAY.endsAt)) return null;
  async function copyCode() {
    try { await navigator.clipboard.writeText(BLACK_FRIDAY.code); toast.success(ru ? "Промокод BLACK15 скопирован" : "Gutscheincode BLACK15 kopiert"); }
    catch { toast(ru ? "Промокод: BLACK15" : "Gutscheincode: BLACK15"); }
  }
  return <section aria-label={ru ? "Чёрная пятница — 27 ноября, скидка 15% по промокоду BLACK15" : "Black Friday — 27. November, 15% Rabatt mit BLACK15"} className="overflow-hidden rounded-[24px] bg-[#f5a8c5] md:grid md:grid-cols-2">
    <div className="relative mx-auto w-full self-center md:max-w-[480px]">
    <img src="/assets/campaigns/black-friday-2026-niche.webp" width="1122" height="1402" fetchPriority="high" alt={ru ? "EURO PERFUME. BLACK FRIDAY SALE. −15%. Промокод BLACK15. Только 27.11.2026, 00:00–23:59 по берлинскому времени. Не действует на товары со скидкой." : "EURO PERFUME. BLACK FRIDAY SALE. −15% mit BLACK15. Nur am 27.11.2026, 00:00–23:59 Berliner Zeit. Nicht auf bereits reduzierte Artikel."} className="block h-auto w-full"/>
    <div className="absolute left-[29.4%] top-[0.6%] flex h-[7%] w-[38.3%] items-center justify-center bg-white p-[1%]"><img src="/assets/logo.png" width="2886" height="573" alt="EURO PERFUME" className="h-auto w-full object-contain"/></div>
    </div>
    <div className="flex flex-col justify-center gap-4 px-6 py-5 text-[#211820] md:p-10">
      <img src="/assets/logo.png" width="2886" height="573" alt="EURO PERFUME · Niche & Luxury Perfumery" className="hidden h-auto w-full max-w-[320px] rounded bg-white p-2 md:block"/>
      <h2 className="hidden text-5xl font-black leading-none md:block">BLACK<br/>FRIDAY <span className="text-[#d90069]">−15%</span></h2>
      <p className="text-sm md:text-xl">{ru ? "Только 27 ноября 2026 · 00:00–23:59" : "Nur am 27. November 2026 · 00:00–23:59"}<br/><span className="text-xs md:text-sm">{ru ? "По берлинскому времени" : "Berliner Zeit"}</span></p>
      <button onClick={copyCode} type="button" className="rounded-xl bg-[#211820] px-5 py-3 font-bold text-white">{ru ? "Промокод" : "Gutscheincode"}: BLACK15 <span className="ml-2 text-xs font-normal">{ru ? "Скопировать" : "Kopieren"}</span></button>
      <p className="text-xs md:text-sm">{ru ? "Не действует на товары, на которые уже есть скидка. Скидки не суммируются." : "Gilt nicht für bereits reduzierte Artikel. Rabatte sind nicht kombinierbar."}</p>
      <Link href="/items" className="text-sm font-semibold underline underline-offset-4">{blackFridayActive(now) ? (ru ? "Выбрать ароматы →" : "Düfte entdecken →") : (ru ? "Смотреть каталог · акция начнётся 27 ноября →" : "Katalog ansehen · Aktion startet am 27. November →")}</Link>
    </div>
  </section>;
}
