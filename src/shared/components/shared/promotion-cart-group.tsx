"use client";
import type { CartPromotionSummary } from "@/src/shared/services/dto/cart.dto";
import type { CartStateItem } from "@/src/shared/lib/get-cart-details";
import { formatMoney } from "@/src/shared/lib/money";
import { useLocale } from "next-intl";
import { Gift, X } from "lucide-react";

export function PromotionCartGroup({promotion,items,onRemove,renderItem}:{
 promotion:CartPromotionSummary;items:CartStateItem[];
 onRemove:(id:number)=>void;
 renderItem:(item:CartStateItem)=>React.ReactNode;
}) {
 const ru=useLocale()==="ru";
 const subset=items.filter(item=>promotion.productIds.includes(item.productId));
 const paidTotal=subset.reduce((sum,item)=>sum+item.price,0);
 const saved=promotion.eligible?promotion.giftPrice:0;
 return <section className="my-3 rounded-[22px] border border-[#e7ddd0] bg-[#faf8f3] p-3 md:p-4" aria-label={ru?"Акционный набор":"Aktionsset"}>
  <header className="mb-3 flex items-start gap-3">
   <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#266e52] text-white"><Gift size={22}/></div>
   <div className="min-w-0">
    <p className="text-[15px] font-semibold text-[#292824]">{ru?promotion.titleRu:promotion.titleDe}</p>
    <p className="mt-0.5 text-xs text-[#776f66]">{promotion.eligible?(ru?"Акция активна · подарок включён":"Aktion aktiv · Gratisgeschenk enthalten"):(ru?"Для подарка нужны все акционные ароматы":"Für das Geschenk werden alle Aktionsdüfte benötigt")}</p>
   </div>
  </header>
  <div className="space-y-2">
   {subset.map(item=><div key={item.id} className="overflow-hidden rounded-[14px] border border-[#e4e7e2] bg-white px-2">{renderItem(item)}</div>)}
   {promotion.eligible&&<div className="flex items-center gap-3 rounded-[14px] border border-[#cfe0d6] bg-[#f3f8f5] p-2">
    <div className="flex h-[64px] w-[64px] shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-[#ecece9]">
     {promotion.giftImage?<img src={promotion.giftImage} alt="" className="h-full w-full object-contain mix-blend-multiply"/>:<Gift size={24}/>}
    </div>
    <div className="min-w-0 flex-1">
     <p className="text-[13px] font-medium text-[#292824]">{promotion.giftName}</p>
     <p className="mt-1 text-xs text-[#787b78]">{promotion.giftMl} ml · <del>{formatMoney(promotion.giftPrice)} €</del></p>
     <p className="mt-0.5 text-sm font-semibold text-[#26704e]">{ru?"Подарок":"Gratis"} · 0,00 €</p>
    </div>
   </div>}
  </div>
  {promotion.eligible&&<div className="mt-3 flex items-center justify-between rounded-xl bg-[#e4f3ec] px-3 py-2.5 text-[13px] text-[#27684d]">
   <span>{ru?"Ваша выгода":"Deine Ersparnis"}</span><strong>−{formatMoney(saved)} €</strong>
  </div>}
  <div className="mt-3 flex items-center justify-between gap-2 text-sm font-semibold">
   <span>{ru?"Стоимость набора":"Setpreis"}</span><span className="tabular-nums">{formatMoney(paidTotal)} €</span>
  </div>
 </section>;
}
