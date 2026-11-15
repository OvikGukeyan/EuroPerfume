"use client";
import { createContext, useContext, type ReactNode } from "react";
import { useLocale } from "next-intl";
import { useTaxPolicy } from "../../hooks/use-tax-policy";
import { Link } from "@/src/i18n/navigation";
import type { TaxPolicy } from "../../lib/tax";
const PricePolicy = createContext<TaxPolicy | null>(null);
export function HomePriceProvider({ children }: { children: ReactNode }) {
  const policy = useTaxPolicy();
  return <PricePolicy.Provider value={policy}>{children}</PricePolicy.Provider>;
}
export function HomePriceNote() {
  const policy = useContext(PricePolicy);
  const ru = useLocale() === "ru";
  return <p className="home-price-note catalog-price-note">{ru ? "Все цены: " : "Alle Preise: "}{policy?.mode === "exempt" ? (ru ? "НДС не выделяется (§ 19 UStG). " : "Kein USt-Ausweis (§ 19 UStG). ") : policy?.mode === "vat" ? (ru ? "Включая применимый НДС. " : "Inkl. anwendbarer MwSt. ") : (ru ? "Конечная цена. " : "Endpreis. ")}<Link href="/delivery-and-payment">{ru ? "Дополнительно доставка" : "Zzgl. Versand"}</Link></p>;
}
