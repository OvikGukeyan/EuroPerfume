"use client";
import { useLocale } from "next-intl";
import { useTaxPolicy } from "@/src/shared/hooks/use-tax-policy";
import { splitGross, cents } from "@/src/shared/lib/tax";

export function TaxPriceNotice({ gross, country = "DEU" }: { gross?: number; country?: string }) {
  const policy = useTaxPolicy();
  const ru = useLocale() === "ru";
  if (!policy) return <p className="mt-3 text-xs text-gray-600">{ru ? "Указаны конечные цены." : "Die angegebenen Preise sind Endpreise."}</p>;
  if (policy.mode === "exempt") return <p className="mt-3 text-xs text-gray-600">{ru ? "НДС не выделяется в соответствии с §19 UStG." : "Umsatzsteuer wird gemäß §19 UStG nicht ausgewiesen."}</p>;
  const tax = country === "DEU" && gross !== undefined && gross >= 0 ? splitGross(cents(gross), policy.rateBasisPoints ?? 1900) : null;
  return <p className="mt-3 text-xs text-gray-600">{tax ? (ru ? `В том числе НДС 19%: ${(tax.vatCents / 100).toFixed(2)} €.` : `Darin enthaltene MwSt. 19%: ${(tax.vatCents / 100).toFixed(2)} €.`) : (ru ? "Конечные цены включают применимый НДС." : "Endpreise einschließlich der anwendbaren Umsatzsteuer.")}</p>;
}
