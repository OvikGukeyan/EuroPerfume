"use client";
import { useLocale } from "next-intl";
import { formatMoney } from "../../lib/money";
import { BottleOption, unitPricePerLitre } from "../../lib/full-bottle";
import "./fragrance-detail.css";

export function FragranceFormatPicker({ bottles, selected, onSelect, decantAvailable=true }: {
  bottles: BottleOption[]; selected: number | null; onSelect: (id:number|null)=>void; decantAvailable?: boolean;
}) {
  const ru=useLocale()==="ru";
  if (!bottles.length) return null;
  const first=bottles.find(b=>b.available) ?? bottles[0];
  return <div className="fragrance-formats">
    <div className="fragrance-format-tabs" role="group" aria-label={ru?"Формат аромата":"Duftformat"}>
      <button type="button" aria-pressed={selected===null} onClick={()=>onSelect(null)}>
        <strong>{ru?"Попробовать аромат":"Duft entdecken"}</strong><span>{ru?"Отливанты 2–30 мл":"Abfüllungen 2–30 ml"}{!decantAvailable?ru?" · нет в наличии":" · ausverkauft":""}</span>
      </button>
      <button type="button" aria-pressed={selected!==null} onClick={()=>onSelect(first.id)}>
        <strong>{ru?"Полный флакон":"Originalflakon"}</strong><span>{ru?"Оригинальный формат":"Originalgröße"}</span>
      </button>
    </div>
    {selected!==null && <div className="fragrance-bottle-options">{bottles.map(b=><button type="button" key={b.id} aria-pressed={selected===b.id} onClick={()=>onSelect(b.id)}>
      <strong className="fragrance-bottle-ml">{b.ml}<small> ml</small></strong>
      <span><strong>{ru?"Полный флакон":"Originalflakon"}</strong><small>{b.available?(ru?"В наличии":"Verfügbar"):(ru?"Нет в наличии":"Ausverkauft")}</small></span>
      <span className="fragrance-bottle-price"><strong>{formatMoney(b.price)} €</strong><small>{formatMoney(unitPricePerLitre(b.price,b.ml) ?? 0)} €/l</small></span>
    </button>)}</div>}
  </div>;
}
