"use client";

import { useLocale } from "next-intl";
import { CountButton } from "./count-button";
import { MAX_DECANT_PACK_COUNT } from "../../lib/decant-pack";
import { formatMoney } from "../../lib/money";

export function DecantQuantityPicker({ count, volume, onChange, unitPrice }: {
  count: number; volume: number; onChange: (count: number) => void; unitPrice: number;
}) {
  const ru = useLocale() === "ru";
  return <div className="my-3 flex flex-wrap items-center justify-between gap-2" role="group"
    aria-label={ru ? "Количество атомайзеров" : "Anzahl Zerstäuber"}>
    <div>
      <p className="text-xs font-medium">{ru ? "Количество атомайзеров" : "Anzahl Zerstäuber"}</p>
      <p className="text-xs text-neutral-700" aria-live="polite">{ru ? "За выбранное количество: " : "Gesamt für diese Menge: "}
        <strong>{formatMoney(Math.round(unitPrice*100)*count/100)} €</strong></p>
    </div>
    <CountButton value={count} packMl={volume} max={MAX_DECANT_PACK_COUNT}
      onClick={type => onChange(Math.min(MAX_DECANT_PACK_COUNT, Math.max(1, count + (type === "plus" ? 1 : -1))))}/>
  </div>;
}
