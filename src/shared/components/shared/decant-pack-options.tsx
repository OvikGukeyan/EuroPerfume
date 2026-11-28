"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { volumes } from "../../constants/perfume";
import { useCartStore } from "../../store/cart";
import type { CartStateItem } from "../../lib/get-cart-details";

export function DecantPackOptions({ item }: { item: CartStateItem }) {
  const ru = useLocale() === "ru";
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const add = useCartStore(s => s.addCartItem);
  if (!item.productGroup?.onTap || item.aromaBox) return null;
  return <div className="mt-2 text-xs">
    {item.invalidPack && <p role="status" className="mb-2 text-amber-800">{ru
      ? "Этот объём не выпускается одним атомайзером. Удалите эту строку и добавьте нужные объёмы ниже."
      : "Diese Menge gibt es nicht als einzelnen Zerstäuber. Entferne diese Zeile und füge unten die passenden Größen hinzu."}</p>}
    <button type="button" onClick={() => setOpen(!open)} aria-expanded={open}
      className="min-h-8 text-neutral-700 underline underline-offset-4">{ru ? "Добавить другой объём" : "Andere Größe hinzufügen"}</button>
    {open && <div className="mt-1 flex flex-wrap gap-1.5">
      {volumes.filter(ml => ml !== item.packMl).map(ml => <button key={ml} type="button" disabled={busy}
        className="min-h-9 rounded border border-neutral-300 px-2.5 hover:border-neutral-700 disabled:opacity-50"
        onClick={async () => {
          setBusy(true); setError(false);
          try {
            await add({ productId: item.productId, variationId: item.variationId ?? undefined, volume: ml });
            setOpen(false);
          } catch { setError(true); }
          finally { setBusy(false); }
        }}>{ml} {ru ? "мл" : "ml"}</button>)}
    </div>}
    {error && <p role="alert" className="mt-2 text-red-700">{ru ? "Не удалось добавить объём." : "Die Größe konnte nicht hinzugefügt werden."}</p>}
  </div>;
}
