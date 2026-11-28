"use client";

import { useLocale } from "next-intl";
import { useDayOfferClock } from "../../hooks/use-day-offer";
import { CATALOG_VAT_START_MS } from "../../lib/day-offer";

export function TaxPriceNotice(_props: { gross?: number; country?: string }) {
  const now = useDayOfferClock();
  const ru = useLocale() === "ru";
  if (now < CATALOG_VAT_START_MS) return null;
  return <small className="block text-xs text-neutral-600">{ru ? "Включая НДС" : "inkl. MwSt."}</small>;
}
