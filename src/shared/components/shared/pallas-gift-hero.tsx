"use client";
import { useLocale } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import { pallasGiftCopy, PALLAS_GIFT_HREF } from "@/src/shared/lib/pallas-gift-copy";
import "./pallas-gift-hero.css";

export function PallasGiftHero() {
  const copy = pallasGiftCopy(useLocale());
  return <section className="pallas-hero" aria-label={`${copy.threshold} — ${copy.name}: ${copy.gift}`}>
    <picture className="pallas-hero-art" aria-hidden="true">
      <source media="(max-width:767px)" srcSet="/images/promotions/pallas-mobile.webp" />
      <img src="/images/promotions/pallas-desktop.webp" alt="" width="1942" height="809" />
    </picture>
    <div className="pallas-hero-copy">
      <span className="pallas-brand">EURO PERFUME</span>
      <p className="pallas-kicker">{copy.eyebrow}</p>
      <p className="pallas-threshold">{copy.threshold}</p>
      <h2>{copy.name}</h2>
      <p className="pallas-gift">{copy.gift}</p>
      <p className="pallas-limit">{copy.limit}</p>
    </div>
    <div className="pallas-hero-action">
      <Link href={PALLAS_GIFT_HREF}>{copy.cta}<span aria-hidden="true"> →</span></Link>
      <p>{copy.illustration}</p>
    </div>
  </section>;
}

