"use client";
import {useEffect,useState} from "react";
import Image from "next/image";
import {Gift} from "lucide-react";
import {PALLAS_GIFT,qualifyingGiftAmount,type PallasOfferState} from "@/src/shared/lib/pallas-gift-rules";

// Same public bottle photo as catalog product #295. The gift itself is a decant.
const pallasBottlePhoto="https://thgjecpmxhqwfoknvjiu.supabase.co/storage/v1/object/public/images/0-ARGOSPALLASATHENEPERFUMEBOTTLEFRONTVIEW100ML_720x-510x510.webp--2025-07-25T21:10:52.729Z";

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
 if(state!=="eligible"||goodsCents<=0)return null;
 const eligible=qualifyingGiftAmount(goodsCents,couponCents,pointsCents);
 return <section className="my-3 rounded-md border border-[#e1e9e5] bg-[#f4f9f7] p-3 text-sm">
  <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5 sm:gap-3">
   <div className="relative h-12 w-12 shrink-0 rounded-md border border-[#e1e9e5] bg-white p-0.5 sm:h-14 sm:w-14">
    <Image src={pallasBottlePhoto} alt={ru?"Флакон Argos Pallas Athene":"Flakon von Argos Pallas Athene"} width={56} height={56} className="h-full w-full rounded object-contain"/>
    <span aria-hidden="true" className="absolute -right-1 -bottom-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#2d5947] text-white ring-2 ring-[#f4f9f7]"><Gift size={12} strokeWidth={2}/></span>
   </div>
   <div className="min-w-0">
    <strong className="block break-words leading-5">{PALLAS_GIFT.name}</strong>
    <span className="block text-xs leading-5 text-[#354c3e]">{eligible?(ru?"Подарок: ":"Geschenk: "):""}{ru?"отливант":"Abfüllung"} · {PALLAS_GIFT.ml} {ru?"мл":"ml"}</span>
   </div>
   {eligible&&<strong className="whitespace-nowrap tabular-nums">0,00 €</strong>}
  </div>
  <p className="mt-1 text-xs leading-5 text-[#354c3e]">{eligible
   ?cart?(ru?"Подарок при сумме товаров от 100 € после скидок и баллов. Проверим при оформлении.":"Geschenk ab 100 € Warenwert nach Gutscheinen und Punkten; Prüfung beim Abschluss.")
   :(ru?"Подарок добавится автоматически при отправке заявки, если остались места.":"Das Geschenk wird beim Absenden automatisch hinzugefügt, solange noch Plätze frei sind.")
   :(ru?"Подарок от 100 € за товары после скидок и баллов, без доставки.":"Geschenk ab 100 € Warenwert nach Gutscheinen und Punkten, ohne Versand.")}</p>
 </section>;
}
