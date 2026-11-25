"use client";
import { useId } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import { BLACK_FRIDAY } from "@/src/shared/lib/black-friday";
import { useDayOfferClock } from "@/src/shared/hooks/use-day-offer";
import toast from "react-hot-toast";

// Original catalogue photography, kept separate from the generated studio scene.
const bottles = [
  { name: "Parfums de Marly Delina Exclusif", src: "/assets/campaigns/delina-exclusif-original.webp", position: "left-[-5%] top-[50%] h-[35%] w-[35%] -rotate-6" },
  { name: "Ex Nihilo Blue Talisman", src: "/assets/campaigns/blue-talisman-original.webp", position: "right-[-4%] top-[51%] h-[34%] w-[34%] rotate-6" },
  { name: "Maison Francis Kurkdjian Baccarat Rouge 540 Extrait", src: "/assets/campaigns/baccarat-rouge-540-extrait-original.webp", position: "left-[36%] top-[72%] h-[20%] w-[28%]" },
];
export function BlackFridayHero() {
  const cutoutId = useId().replace(/:/g, "");
  const ru = useLocale() === "ru";
  const minimum = BLACK_FRIDAY.minimumEligibleCents / 100;
  const terms = ru ? `От ${minimum} € без доставки и акционных товаров` : `Ab ${minimum} € ohne Versand und Aktionsartikel`;
  const now = useDayOfferClock({ dayOfferStartsAt: BLACK_FRIDAY.startsAt, dayOfferEndsAt: BLACK_FRIDAY.endsAt });
  if (now >= Date.parse(BLACK_FRIDAY.endsAt)) return null;
  async function copyCode() {
    try { await navigator.clipboard.writeText(BLACK_FRIDAY.code); toast.success(ru ? "BLACK15 скопирован · действует только 27 ноября" : "BLACK15 kopiert · gültig nur am 27. November"); }
    catch { toast("BLACK15 · 27.11.2026"); }
  }
  return <section aria-label={ru ? "Чёрная пятница — 15% по промокоду BLACK15, только 27 ноября" : "Black Friday — 15% mit BLACK15, nur am 27. November"} className="relative isolate overflow-hidden rounded-[22px] bg-[#f4a7c6] md:rounded-[32px]">
    <svg width="0" height="0" aria-hidden="true" className="absolute"><defs><filter id={cutoutId} colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -10 -10 -10 0 29.5"/><feComposite in2="SourceAlpha" operator="in"/></filter></defs></svg>
    <div className="relative mx-auto aspect-[1.05/1] w-full md:hidden">
      <img src="/assets/campaigns/black-friday-square-scene.webp" width="1254" height="1254" alt="Black Friday SALE −15% · BLACK15" fetchPriority="high" className="absolute left-0 top-[5%] h-[88%] w-full object-fill"/>
      <Link href="/items" aria-label={ru ? "Выбрать ароматы в каталоге" : "Düfte im Katalog entdecken"} className="absolute inset-0 z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"/>
      {bottles.map(bottle => <img key={bottle.name} src={bottle.src} width="500" height="500" alt={bottle.name} style={{filter:`url(#${cutoutId})`}} className={`pointer-events-none absolute object-contain ${bottle.position}`}/>)}
      <button type="button" onClick={copyCode} aria-label={ru ? "Скопировать промокод BLACK15" : "Gutscheincode BLACK15 kopieren"} title={ru ? "Нажмите, чтобы скопировать BLACK15" : "BLACK15 kopieren"} className="absolute left-[28%] top-[45.5%] z-20 h-[6%] w-[47%] rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"><span className="sr-only">BLACK15</span></button>
      <div className="pointer-events-none absolute inset-x-[3%] bottom-[1%] text-center text-[9px] font-medium leading-[1.35] text-[#291c24] min-[390px]:text-[10px] md:text-[13px]">
        <p>27.11.2026 · 00:00–23:59 · {ru ? "по берлинскому времени" : "Berliner Zeit"}</p>
        <p>{terms}</p>
      </div>
    </div>
    <div className="storefront-desktop-hero relative hidden md:block">
      <img src="/assets/campaigns/black-friday-desktop-wide.webp" width="3072" height="1024" alt="Black Friday SALE −15%" loading="lazy" className="storefront-desktop-art"/>
      <Link href="/items" aria-label={ru?"Выбрать ароматы":"Düfte entdecken"} className="absolute inset-y-0 left-0 z-10 w-[53%]"/>
      <div className="desktop-bf-content">
        <p className="desktop-bf-date">{ru?"Только 27 ноября":"Nur am 27. November"} · −15%</p>
        <div className="desktop-bf-bottles">{bottles.map(bottle=><img key={bottle.name} src={bottle.src} alt={bottle.name} width="500" height="500" loading="lazy" style={{filter:`url(#${cutoutId})`}}/>)}</div>
        <button type="button" onClick={copyCode} className="desktop-bf-code" aria-label={ru?"Скопировать промокод BLACK15":"Gutscheincode BLACK15 kopieren"}>BLACK15 <span>{ru?"Скопировать":"Kopieren"}</span></button>
        <p className="desktop-bf-terms">27.11.2026 · 00:00–23:59 · {ru?"по берлинскому времени":"Berliner Zeit"}<br/>{terms}</p>
      </div>
    </div>
  </section>;
}
