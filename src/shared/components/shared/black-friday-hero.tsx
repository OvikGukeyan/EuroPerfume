"use client";
import { useLocale } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import { BLACK_FRIDAY } from "@/src/shared/lib/black-friday";
import { useDayOfferClock } from "@/src/shared/hooks/use-day-offer";
import toast from "react-hot-toast";

// Original catalogue photography, kept separate from the generated studio scene.
const bottles = [
  { name: "Parfums de Marly Delina Exclusif", src: "/assets/campaigns/delina-exclusif-original.webp", position: "left-[-5%] top-[50%] h-[35%] w-[35%] -rotate-6" },
  { name: "Ex Nihilo Blue Talisman", src: "/assets/campaigns/blue-talisman-original.webp", position: "right-[-4%] top-[51%] h-[34%] w-[34%] rotate-6" },
  { name: "Maison Francis Kurkdjian Baccarat Rouge 540 Extrait", src: "/assets/campaigns/baccarat-rouge-540-extrait-original.webp", position: "left-[36%] top-[73%] h-[23%] w-[28%]" },
];
export function BlackFridayHero() {
  const ru = useLocale() === "ru";
  const now = useDayOfferClock({ dayOfferStartsAt: BLACK_FRIDAY.startsAt, dayOfferEndsAt: BLACK_FRIDAY.endsAt });
  if (now >= Date.parse(BLACK_FRIDAY.endsAt)) return null;
  async function copyCode() {
    try { await navigator.clipboard.writeText(BLACK_FRIDAY.code); toast.success(ru ? "BLACK15 скопирован · действует только 27 ноября" : "BLACK15 kopiert · gültig nur am 27. November"); }
    catch { toast("BLACK15 · 27.11.2026"); }
  }
  return <section aria-label={ru ? "Чёрная пятница — 15% по промокоду BLACK15, только 27 ноября" : "Black Friday — 15% mit BLACK15, nur am 27. November"} className="relative isolate overflow-hidden rounded-[22px] bg-[#f4a7c6] md:rounded-[32px]">
    <div className="relative mx-auto aspect-[1.05/1] w-full md:h-[540px] md:w-[567px]">
      <img src="/assets/campaigns/black-friday-square-scene.webp" width="1254" height="1254" alt="Black Friday SALE −15% · BLACK15" fetchPriority="high" className="absolute inset-0 h-full w-full object-fill"/>
      <Link href="/items" aria-label={ru ? "Выбрать ароматы в каталоге" : "Düfte im Katalog entdecken"} className="absolute inset-0 z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"/>
      <img src="/assets/logo.png" width="2886" height="573" alt="EURO PERFUME · Niche & Luxury Perfumery" className="pointer-events-none absolute left-[32%] top-[1.5%] w-[36%] mix-blend-multiply"/>
      {bottles.map(bottle => <img key={bottle.name} src={bottle.src} width="500" height="500" alt={bottle.name} className={`pointer-events-none absolute object-contain mix-blend-multiply ${bottle.position}`}/>)}
      <button type="button" onClick={copyCode} aria-label={ru ? "Скопировать промокод BLACK15" : "Gutscheincode BLACK15 kopieren"} title={ru ? "Нажмите, чтобы скопировать BLACK15" : "BLACK15 kopieren"} className="absolute left-[28%] top-[46%] z-20 h-[6%] w-[47%] rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"><span className="sr-only">BLACK15</span></button>
      <div className="pointer-events-none absolute inset-x-[3%] bottom-[1%] text-center text-[9px] font-medium leading-[1.35] text-[#291c24] min-[390px]:text-[10px] md:text-[13px]">
        <p>27.11.2026 · 00:00–23:59 · {ru ? "по берлинскому времени" : "Berliner Zeit"}</p>
        <p>{ru ? "Не действует на товары со скидкой" : "Gilt nicht für bereits reduzierte Artikel"}</p>
      </div>
    </div>
  </section>;
}
