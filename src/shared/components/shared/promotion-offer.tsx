"use client";
import { PromotionViewTracker } from "./promotion-tracker";
import { useLocale } from "next-intl";
import { useRouter } from "@/src/i18n/navigation";
import { useState } from "react";
import { useCartStore } from "@/src/shared/store/cart";
import toast from "react-hot-toast";
type Product={id?:number;name:string;brand:string;image:string;price?:number};
export function PromotionOffer({slug,titleRu,titleDe,requiredMl,giftMl,available,items,gift}:{
 slug:string;titleRu:string;titleDe:string;requiredMl:number;giftMl:number;available:boolean;items:Product[];gift:Product|null;
}) {
 const ru=useLocale()==="ru",router=useRouter(),refresh=useCartStore(s=>s.fetchCartItems);
 const [busy,setBusy]=useState(false);
 const price=items.reduce((sum,item)=>sum+(item.price||0),0);
 const giftValue=gift?.price&&gift.price>0?gift.price:0;
 const regular=price+giftValue;
 const money=(value:number)=>new Intl.NumberFormat(ru?"ru-RU":"de-DE",{style:"currency",currency:"EUR"}).format(value);
 async function add() {
  setBusy(true);
  try {
   const res=await fetch(`/api/promotions/${encodeURIComponent(slug)}/add`,{method:"POST"});
   if(!res.ok) throw new Error("promotion unavailable");
   await refresh();
   router.push("/checkout");
  }catch{toast.error(ru?"Не удалось добавить набор. Проверьте наличие.":"Set nicht verfügbar. Bitte Bestand prüfen.");}
  finally{setBusy(false);}
 }
 return <main className="mx-auto max-w-[1160px] px-4 py-6 md:py-14">
  <PromotionViewTracker slug={slug}/>
  <section className="overflow-hidden rounded-[24px] bg-[#eee8df] px-5 py-7 text-[#292823] md:rounded-[32px] md:px-14 md:py-12">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <span className="text-[10px] font-semibold uppercase tracking-[.18em] text-[#8a7565]">EURO PERFUME · {ru?"СПЕЦИАЛЬНОЕ ПРЕДЛОЖЕНИЕ":"EXKLUSIVES ANGEBOT"}</span>
      <span className="rounded-full bg-[#ded0c1] px-3 py-1.5 text-[11px] font-semibold text-[#5a4435]">{ru?"ПОДАРОК В НАБОРЕ":"GRATISPROBE IM SET"}</span>
    </div>
    <h1 className="mt-5 font-serif text-[34px] leading-[1.07] tracking-[-.03em] md:text-[58px]">{ru?titleRu:titleDe}</h1>
    <p className="mt-3 max-w-[650px] text-[14px] leading-relaxed text-[#675c52] md:text-[17px]">{ru?`${items.map(p=>p.name.trim()).join(" и ")} по ${requiredMl} мл — ${gift?.name.trim()||"аромат"} ${giftMl} мл в подарок.`:`${items.map(p=>p.name.trim()).join(" und ")} je ${requiredMl} ml – ${gift?.name.trim()||"Duft"} ${giftMl} ml gratis.`}</p>
    <div className="mt-7 grid grid-cols-3 gap-2 md:mt-10 md:gap-5">
      {[...items.map(p=>({...p,isGift:false})),...(gift?[{...gift,isGift:true}]:[])].map((p,i)=><article key={p.id??i} className="relative min-w-0 rounded-[15px] bg-[#f7f3ee] p-2.5 pb-4 md:rounded-[22px] md:p-5">
        {p.isGift&&<span className="absolute right-2 top-2 z-10 rounded-full bg-[#564638] px-2 py-1 text-[9px] font-semibold text-white md:right-4 md:top-4 md:px-3 md:text-[11px]">{ru?"ПОДАРОК":"GRATIS"}</span>}
        <div className="flex aspect-[4/4.5] items-center justify-center overflow-hidden rounded-lg">
          {p.image&&<img src={p.image} alt={p.name} className="h-[88%] w-[88%] object-contain mix-blend-multiply drop-shadow-[0_10px_9px_rgba(66,53,45,0.12)]" />}
        </div>
        <p className="mt-2 min-h-[28px] text-[9px] uppercase leading-[1.3] tracking-[.045em] text-[#85786d] md:min-h-0 md:text-[11px]">{p.brand}</p>
        <h2 className="mt-1 min-h-[30px] break-words text-[12px] font-semibold leading-tight md:min-h-0 md:text-[18px]">{p.name}</h2>
        <p className="mt-2 text-[11px] text-[#75675a] md:text-[14px]">{p.isGift?giftMl:requiredMl} ml</p>
        <p className="mt-1 text-[11px] font-semibold md:text-[15px]">{p.isGift?<><span className="text-[#9b8e82] line-through">{giftValue>0?money(giftValue):""}</span> <span className="text-[#426043]">{money(0)}</span></>:money(p.price||0)}</p>
      </article>)}
    </div>
    <div className="mt-7 rounded-[18px] bg-[#fffaf4] px-4 py-5 md:mt-9 md:px-7 md:py-6">
      <div className="flex items-center justify-between gap-3 text-[13px] text-[#74695e] md:text-[17px]">
        <span>{ru?"Обычная стоимость":"Regulärer Gesamtwert"}</span>
        <span className="tabular-nums line-through">{regular>price?money(regular):money(price)}</span>
      </div>
      <div className="mt-2 flex items-center justify-between gap-3">
        <span className="text-[16px] font-semibold md:text-[21px]">{ru?"Цена по акции":"Aktionspreis"}</span>
        <strong className="text-[28px] tabular-nums tracking-tight md:text-[40px]">{money(price)}</strong>
      </div>
      {giftValue>0&&<div className="mt-3 flex items-center justify-between gap-3 border-t border-[#e7dcd0] pt-3 text-[13px] font-semibold text-[#37613e] md:text-[17px]">
        <span>{ru?"Ваша выгода":"Dein Vorteil"}</span><span className="tabular-nums">{money(giftValue)}</span>
      </div>}
      <p className="mt-3 text-[11px] leading-relaxed text-[#736a60] md:text-[13px]">{ru?"Подарок включён бесплатно. Доставка рассчитывается отдельно.":"Die Gratisprobe ist enthalten. Versand wird separat berechnet."}</p>
    </div>
    <button type="button" disabled={!available||busy} onClick={add} className="mt-5 w-full rounded-[12px] bg-[#292825] px-8 py-4 text-[14px] font-semibold text-white transition-colors hover:bg-[#4e423a] disabled:cursor-not-allowed disabled:opacity-50 md:text-[16px]">{busy?(ru?"Добавляем…":"Wird hinzugefügt…"):(ru?"Добавить весь набор в корзину":"Gesamtes Set in den Warenkorb")}</button>
    {!available&&<p role="status" className="mt-3 text-sm text-red-800">{ru?"Акция временно недоступна":"Aktion derzeit nicht verfügbar"}</p>}
  </section>
 </main>
}
