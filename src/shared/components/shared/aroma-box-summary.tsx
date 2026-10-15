import React from "react";
import { CartStateItem } from "@/src/shared/lib/get-cart-details";
import { formatMoney, sumMoney } from "@/src/shared/lib/money";
export function AromaBoxSummary({ items }: { items: CartStateItem[] }) {
  const box = items.filter(item => item.aromaBox);
  if (box.length !== 8) return null;
  return <section aria-label="Aroma Box" className="rounded-xl border border-[#213830]/20 bg-[#f3f5f0] p-5">
    <h3 className="text-xl font-semibold">Aroma Box · 8 × 2 ml</h3>
    <ol className="my-3 list-decimal pl-5 text-sm space-y-1">{box.map(item => <li key={item.id}>{item.brand?.name} {item.name} · 2 ml</li>)}</ol>
    <p className="font-semibold">{formatMoney(sumMoney(box.map(item => item.price)))} €</p>
  </section>;
}
