"use client";
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
 return <main className="mx-auto max-w-[1120px] px-4 py-8 md:py-14">
  <div className="rounded-2xl bg-[#eeeae2] px-6 py-9 md:px-14 md:py-14">
   <p className="text-[10px] tracking-[.2em] text-[#746d62]">EURO PERFUME · SPECIAL OFFER</p>
   <h1 className="mt-3 font-serif text-3xl text-[#262622] md:text-5xl">{ru?titleRu:titleDe}</h1>
   <p className="mt-4 max-w-2xl text-sm text-[#555049] md:text-base">{ru?"Два любимых аромата — третий в подарок.":"Zwei Düfte entdecken – den dritten gratis erhalten."}</p>
   <div className="mt-8 grid grid-cols-3 gap-2 md:gap-5">
    {[...items.map(p=>({...p,isGift:false})),...(gift?[{...gift,isGift:true}]:[])].map((p,i)=><article key={i} className="min-w-0 rounded-xl bg-[#f4f1eb] p-2 md:p-4">
     <div className="flex aspect-square items-center justify-center overflow-hidden rounded-md bg-[#f4f1eb]">{p.image&&<img src={p.image} alt={p.name} className="h-full w-full object-contain mix-blend-multiply"/>}</div>
     <p className="mt-2 text-[9px] uppercase tracking-wider text-[#827b72]">{p.brand}</p>
     <h2 className="mt-1 break-words text-xs font-medium leading-tight md:text-lg">{p.name}</h2>
     <p className="mt-1 text-[11px] text-[#524c45]">{p.isGift?giftMl:requiredMl} ml {p.isGift?(ru?"· Подарок":"· Geschenk"):""}</p>
    </article>)}
   </div>
   <p className="mt-7 text-base font-medium">{ru?"Стоимость набора: ":"Setpreis: "}{price.toFixed(2)} €</p>
   <p className="mt-1 text-xs text-neutral-600">{ru?"Подарок 0,00 € · Доставка рассчитывается отдельно.":"Geschenk 0,00 € · Versand wird separat berechnet."}</p>
   <button type="button" disabled={!available||busy} onClick={add} className="mt-6 w-full rounded-md bg-[#252521] px-8 py-3.5 text-sm text-white disabled:opacity-50 md:w-auto">{busy?(ru?"Добавляем…":"Wird hinzugefügt…"):(ru?"Добавить набор в корзину":"Set in den Warenkorb")}</button>
   {!available&&<p role="status" className="mt-3 text-sm text-red-800">{ru?"Акция временно недоступна":"Aktion derzeit nicht verfügbar"}</p>}
  </div>
 </main>
}
