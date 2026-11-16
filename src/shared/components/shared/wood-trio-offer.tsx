"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "@/src/i18n/navigation";
import { useCartStore } from "@/src/shared/store/cart";
import toast from "react-hot-toast";

type Item = { id: number; name: string; brand: string; image: string } | null;
const CAMPAIGN = "WOOD_TRIO_GIFT_2026";
export function WoodTrioOffer({ cedar, bois, gift }: { cedar: Item; bois: Item; gift: Item }) {
  const ru = useLocale() === "ru";
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const add = useCartStore((s) => s.addCartItem);
  const ready = Boolean(cedar && bois && gift);
  async function onAdd() {
    if (!cedar || !bois || !gift || busy) return;
    setBusy(true);
    try {
      await add({ productId: cedar.id, volume: 5 });
      await add({ productId: bois.id, volume: 5 });
      // The free 2 ml gift is fulfilled manually; never charge for it as a cart line.
      router.push(`/checkout?campaign=${CAMPAIGN}`);
    } catch {
      toast.error(ru
        ? "Не удалось полностью добавить набор. Проверьте корзину: часть товаров могла добавиться."
        : "Das Set konnte nicht vollständig hinzugefügt werden. Bitte Warenkorb prüfen.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="mx-auto max-w-6xl px-4 py-9 md:py-16">
      <section className="overflow-hidden rounded-3xl bg-[#20291f] px-6 py-11 text-[#f6f1e8] md:px-14 md:py-16">
        <p className="text-xs uppercase tracking-[.3em] text-[#e7ca9f]">EURO PERFUME · PRIVATE SELECTION</p>
        <h1 className="mt-5 max-w-3xl font-serif text-4xl leading-tight md:text-6xl">
          {ru ? "Три оттенка древесины" : "Drei Facetten von Holz"}
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-[#e5e5db]">
          {ru ? "Выберите Cedar Chic 5 мл и Bois Impérial 5 мл в одном заказе — Encre Noire 2 мл получите в подарок."
              : "Cedar Chic 5 ml und Bois Impérial 5 ml zusammen bestellen und Encre Noire 2 ml als Geschenk erhalten."}
        </p>
        <p className="mt-3 text-sm text-[#ded4c5]">
          {ru ? "Стоимость двух ароматов рассчитывается по действующим ценам каталога. Подарок добавляется при комплектации заказа и не оплачивается."
              : "Die beiden Düfte werden zum aktuellen Katalogpreis berechnet. Das kostenlose Geschenk wird bei der Verpackung beigelegt."}
        </p>
        <div className="mt-9 grid grid-cols-3 gap-3 md:gap-7">
          {[{ product: cedar, ml: 5 }, { product: bois, ml: 5 }, { product: gift, ml: 2 }].map(({product,ml},i) =>
            <div key={i} className="min-w-0 rounded-2xl bg-white/10 p-3 md:p-5">
              <div className="flex aspect-square items-center justify-center rounded-xl bg-[#eee8dc] p-2">
                {product?.image
                  ? <img src={product.image} alt={product.name} className="h-full w-full object-contain" />
                  : <span className="text-center text-sm text-stone-600">{product?.name || (i===0?"Cedar Chic":i===1?"Bois Impérial":"Encre Noire")}</span>}
              </div>
              <p className="mt-3 text-xs uppercase tracking-wide text-[#dcd1bf]">{product?.brand || "PARFUM"}</p>
              <p className="mt-1 text-sm font-semibold md:text-lg">{product?.name || (i===0?"Cedar Chic":i===1?"Bois Impérial":"Encre Noire")}</p>
              <p className="mt-1 text-sm">{ml} ml {i===2 ? (ru?"· Подарок":"· Geschenk") : ""}</p>
            </div>
          )}
        </div>
        <button type="button" disabled={!ready || busy} onClick={onAdd}
          className="mt-9 w-full rounded-full bg-[#e7ca9f] px-8 py-4 text-base font-semibold text-[#182018] transition hover:bg-[#f3dbb8] disabled:cursor-not-allowed disabled:opacity-50 md:w-auto">
          {busy ? (ru?"Добавляем…":"Wird hinzugefügt…") : (ru?"Добавить предложение в корзину":"Angebot in den Warenkorb")}
        </button>
        {!ready && <p role="status" className="mt-3 text-sm text-[#f0d3bb]">
          {ru ? "Временно недоступно: один из ароматов отсутствует в каталоге или не отмечен как доступный." : "Zurzeit nicht verfügbar: Mindestens ein Duft ist im Katalog nicht verfügbar."}
        </p>}
        <p className="mt-4 text-xs text-[#ded4c5]">
          {ru ? "Акция действует при покупке обоих объёмов 5 мл в одном заказе, пока подарок в наличии. Доставка оплачивается по обычным условиям."
              : "Gilt beim gemeinsamen Kauf beider 5-ml-Abfüllungen, solange der Vorrat des Geschenks reicht. Versand gemäß den regulären Bedingungen."}
        </p>
      </section>
    </main>
  );
}
