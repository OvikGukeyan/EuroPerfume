"use client";
import { useId } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import { BLACK_FRIDAY } from "@/src/shared/lib/black-friday";
import { useDayOfferClock } from "@/src/shared/hooks/use-day-offer";
import toast from "react-hot-toast";

// Original catalogue photography, kept separate from the generated studio scene.
const bottles = [
  { name: "Parfums de Marly Delina Exclusif", src: "/assets/campaigns/delina-exclusif-original.webp" },
  { name: "Ex Nihilo Blue Talisman", src: "/assets/campaigns/blue-talisman-original.webp" },
  { name: "Maison Francis Kurkdjian Baccarat Rouge 540 Extrait", src: "/assets/campaigns/baccarat-rouge-540-extrait-original.webp" },
];
export function BlackFridayHero() {
  const cutoutId = useId().replace(/:/g, "");
  const ru = useLocale() === "ru";

  const now = useDayOfferClock({ dayOfferStartsAt: BLACK_FRIDAY.startsAt, dayOfferEndsAt: BLACK_FRIDAY.endsAt });
  if (now >= Date.parse(BLACK_FRIDAY.endsAt)) return null;
  async function copyCode() {
    try { await navigator.clipboard.writeText(BLACK_FRIDAY.code); toast.success(ru ? "BLACK15 скопирован · действует только 27 ноября" : "BLACK15 kopiert · gültig nur am 27. November"); }
    catch { toast(ru ? "Не удалось скопировать. Введите BLACK15 вручную." : "Kopieren nicht möglich. Gib BLACK15 bitte manuell ein."); }
  }
  return <section aria-label={ru ? "Чёрная пятница: до 15% с BLACK15" : "Black Friday: bis zu 15 % mit BLACK15"} className="relative isolate grid min-h-[320px] w-full items-center overflow-hidden rounded-[22px] bg-[#f4a7c6] px-4 py-5 text-center text-[#291c24] md:h-[380px] md:grid-cols-[1fr_1fr] md:rounded-[32px] md:px-12">
    <svg width="0" height="0" aria-hidden="true" className="absolute"><defs><filter id={cutoutId} colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -10 -10 -10 0 29.5"/><feComposite in2="SourceAlpha" operator="in"/></filter></defs></svg>
    <Link href="/items" aria-label={ru ? "Выбрать ароматы" : "Düfte entdecken"} className="absolute inset-0 z-10 rounded-[inherit] focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"/>
    <div className="md:order-2">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] md:text-sm">Black Friday · {ru ? "27 ноября" : "27. November"}</p>
      <p className="mt-1 text-[clamp(34px,7vw,80px)] font-semibold leading-none">{ru ? "До −15%" : "Bis zu −15 %"}</p>
      <div className="mx-auto mt-3 flex max-w-sm justify-center gap-1.5 text-[11px] leading-tight sm:text-sm">
        {[{rate:"5%",label:ru?"до 50 €":"unter 50 €"},{rate:"10%",label:"50–79,99 €"},{rate:"15%",label:ru?"от 80 €":"ab 80 €"}].map(tier => <div key={tier.rate} className="min-w-0 flex-1 rounded-xl bg-white/55 px-1.5 py-1.5"><strong className="block text-base md:text-xl">{tier.rate}</strong>{tier.label}</div>)}
      </div>
      <button type="button" onClick={copyCode} className="relative z-20 mt-3 rounded-full bg-[#251820] px-4 py-2 text-sm font-semibold text-white" aria-label={ru?"Скопировать промокод BLACK15":"Gutscheincode BLACK15 kopieren"}>BLACK15 · {ru?"Скопировать":"Kopieren"}</button>
      <div className="mx-auto mt-3 max-w-[450px] space-y-1 text-xs leading-snug md:text-[13px]">
        <p><strong>{ru ? "Как считается скидка:" : "So wird der Rabatt berechnet:"}</strong>{" "}{ru
          ? "Учитываем только стоимость неакционных товаров до применения кода. Акционные и уже уценённые товары, а также доставка не учитываются и не получают скидку."
          : "Es zählt nur der Warenwert nicht reduzierter Artikel vor Eingabe des Codes. Aktionsartikel, bereits reduzierte Artikel und Versandkosten zählen nicht mit und werden nicht rabattiert."}</p>
        <p>{ru
          ? "Минимум заказа: 20 € за товары до скидок, без доставки. BLACK15 не суммируется с другими промокодами."
          : "Mindestbestellwert: 20 € Warenwert vor Rabatten, ohne Versand. BLACK15 ist nicht mit anderen Gutscheincodes kombinierbar."}</p>
        <p>{ru ? "27 ноября, 00:00–23:59 по Берлину" : "27. November, 00:00–23:59 Uhr (Berliner Zeit)"}</p>
      </div>
    </div>
    <div className="pointer-events-none relative mx-auto mt-2 h-[95px] w-full max-w-sm md:order-1 md:mt-0 md:h-[300px] md:max-w-none">
      {bottles.map((bottle,i) => <img key={bottle.name} src={bottle.src} width="500" height="500" alt={bottle.name} style={{filter:`url(#${cutoutId})`}} className={`absolute top-0 h-full w-[39%] object-contain ${["left-0 -rotate-6","right-0 rotate-6","left-[30.5%] z-[1]"][i]}`}/>)}
    </div>
  </section>;
}
