"use client";
import {useEffect,useState} from "react";
import {Gift} from "lucide-react";
import {PALLAS_GIFT,qualifyingGiftAmount,type PallasOfferState} from "@/src/shared/lib/pallas-gift-rules";

export function usePallasOffer(refreshKey:unknown){
 const [state,setState]=useState<PallasOfferState>("off");
 useEffect(()=>{
  if(refreshKey===false)return;
  const ac=new AbortController();
  void fetch("/api/pallas-gift",{signal:ac.signal,cache:"no-store"}).then(r=>r.json()).then(r=>{
   if(!ac.signal.aborted)setState(["eligible","claimed","exhausted"].includes(r.state)?r.state:"off");
  }).catch(()=>{if(!ac.signal.aborted)setState("off");});
  return ()=>ac.abort();
 },[refreshKey]);
 return state;
}
export function PallasGiftLine({state,goodsCents,couponCents=0,pointsCents=0,ru,cart=false}:{state:PallasOfferState;goodsCents:number;couponCents?:number;pointsCents?:number;ru:boolean;cart?:boolean}){
 if(state!=="eligible")return null;
 const eligible=state==="eligible"&&qualifyingGiftAmount(goodsCents,couponCents,pointsCents);
 return <section className="my-3 rounded-md border border-[#e1e9e5] bg-[#f4f9f7] p-3 text-sm">
  <div className="flex items-center justify-between gap-2">
   <div className="flex items-center gap-2"><Gift size={17}/><strong>{PALLAS_GIFT.name} · 5 {ru?"мл":"ml"}</strong></div>
   {eligible&&<strong>0,00 €</strong>}
  </div>
  <p className="mt-1 text-xs leading-5 text-[#354c3e]">{eligible
   ?cart?(ru?"Подарок при сумме товаров от 100 € после скидок и баллов. Проверим при оформлении.":"Geschenk ab 100 € Warenwert nach Gutscheinen und Punkten; Prüfung beim Abschluss.")
   :(ru?"Подарок добавится автоматически при отправке заявки, если остались места.":"Das Geschenk wird beim Absenden automatisch hinzugefügt, solange noch Plätze frei sind.")
   :(ru?"Подарок от 100 € за товары после скидок и баллов, без доставки.":"Geschenk ab 100 € Warenwert nach Gutscheinen und Punkten, ohne Versand.")}</p>
 </section>;
}
