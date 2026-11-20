"use client";
import React,{useState} from "react";
import { useLocale } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import { useCartStore } from "@/src/shared/store/cart";
import { trackPromotion } from "./promotion-tracker";
import type { HeroPromotion } from "@/src/shared/server-lib/get-hero-promotion";
import { formatMoney } from "@/src/shared/lib/money";
import toast from "react-hot-toast";
import { Gift, ShoppingCart } from "lucide-react";
export function PromotionHero({promotion}:{promotion:HeroPromotion}) {
 const ru=useLocale()==="ru";
 const [busy,setBusy]=useState(false);
 const refresh=useCartStore(s=>s.fetchCartItems);
 const products=promotion.products;
 const purchased=products.filter(p=>!p.isGift);
 const gift=products.find(p=>p.isGift);
 const total=purchased.reduce((s,p)=>s+p.price,0);
 const savings=Math.round(Math.max(0,gift?.price||0)*100)/100;
 const was=Math.round((total+savings)*100)/100;
 async function add(e:React.MouseEvent) {
  e.preventDefault();
  if(busy || promotion.preview) return;
  setBusy(true);
  try {
   void trackPromotion(promotion.slug,"click");
   const res=await fetch(`/api/promotions/${encodeURIComponent(promotion.slug)}/add`,{method:"POST"});
   if(!res.ok) throw new Error("Could not add");
   await refresh();
   toast.success(ru?"Акционный набор добавлен в корзину":"Aktionsset zum Warenkorb hinzugefügt");
   document.dispatchEvent(new CustomEvent("europerfume:open-cart"));
  }catch{toast.error(ru?"Не удалось добавить набор. Попробуйте ещё раз.":"Set konnte nicht hinzugefügt werden.");}
  finally{setBusy(false);}
 }
 return <section aria-label={ru?"Акция":"Aktion"} className="w-full rounded-[22px] bg-[#1d1d1f] p-4 text-white md:rounded-[32px] md:p-0">
  <div className="md:hidden">
  <div className="flex items-start gap-3 md:gap-6">
   <span className="shrink-0 rounded-full bg-[#f5f5f5] px-3 py-2 text-[11px] font-semibold text-[#222] md:px-5 md:text-sm">{ru?"ПОДАРОК":"GRATIS"}</span>
   <div className="min-w-0">
    <h2 className="text-[19px] font-medium leading-tight md:text-[36px]">{ru?promotion.titleRu:promotion.titleDe}</h2>
    <p className="mt-1 text-[11px] leading-snug text-[#b5b5b9] md:mt-2 md:text-base">{ru?"Два аромата по 5 мл и третий в подарок":"Zwei Düfte à 5 ml und eine Gratisprobe"}</p>
   </div>
  </div>
  <div className="mt-5 grid grid-cols-3 items-stretch gap-2 md:mt-7 md:gap-4">
   {products.map(p=><Link key={p.id} href={`/product/${p.id}`} onClick={()=>{if(!promotion.preview) void trackPromotion(promotion.slug,"click")}} aria-label={`${ru?"Подробнее об аромате":"Duftdetails ansehen"}: ${p.brand} ${p.name.trim()}`} className="group relative block min-w-0 rounded-[14px] border border-[#46464a] bg-[#2c2c2e] p-2 text-center transition-colors hover:border-[#a5a4a7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:rounded-[22px] md:p-4">
    {p.isGift&&<span className="absolute -top-2 right-0 z-10 rounded-full bg-[#ffbb22] px-2 py-1 text-[9px] font-semibold text-black md:px-4 md:text-xs">{ru?"Подарок":"Gratis"}</span>}
    <div className="mx-auto flex aspect-square w-[82%] items-center justify-center overflow-hidden rounded-xl bg-[#e9e9e9] p-2 md:w-[70%]">
     {p.image?<img src={p.image} alt={p.name} className="h-full w-full object-contain mix-blend-multiply"/>:<Gift className="text-[#656565]"/>}
    </div>
    <h3 className="mt-2 line-clamp-2 min-h-[30px] break-words text-[11px] font-semibold leading-[1.25] md:mt-3 md:min-h-[40px] md:text-lg">{p.name.trim()}</h3>
    <p className="mt-1 truncate text-[9px] text-[#bbbbbf] md:text-sm">{p.brand} · {p.isGift?promotion.giftMl:promotion.requiredMl} ml</p>
    <div className="mt-2 flex flex-wrap items-center justify-center gap-1 text-[11px] font-semibold md:text-base">
      {p.isGift&&<del className="text-[#999]">{formatMoney(p.price)} €</del>}
      <span className={p.isGift?"text-[#b4f2d3]":""}>{p.isGift?"0,00":formatMoney(p.price)} €</span>
    </div>
   </Link>)}
  </div>
  <div className="mt-4 border-t border-white/15 pt-3">
   <div className="flex items-end justify-between gap-3">
    <div className="min-w-0">
     <p className="text-[11px] leading-4 text-[#bcbcc0]">{ru?"Цена набора":"Setpreis"}</p>
     <strong className="mt-1 block text-[25px] font-semibold leading-none tabular-nums tracking-tight">{formatMoney(total)} €</strong>
    </div>
    {savings>0&&<div className="min-w-0 text-right">
     <p className="text-[10px] leading-4 text-[#bcbcc0]">{ru?"Если покупать отдельно":"Einzelkauf zusammen"}</p>
     <del className="text-[13px] tabular-nums text-[#aaa9ad]">{formatMoney(was)} €</del>
    </div>}
   </div>
   {savings>0&&<div className="mt-3 flex items-center justify-between gap-2 rounded-lg bg-[#e7f2eb] px-3 py-2.5 text-[#266b4c]">
    <span className="text-[12px] font-medium">{ru?"Вы экономите":"Du sparst"}</span>
    <strong className="text-[17px] font-semibold tabular-nums">−{formatMoney(savings)} €</strong>
   </div>}
   <button type="button" disabled={busy||promotion.preview} onClick={add} className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-[13px] font-semibold text-black transition hover:bg-[#eee] disabled:opacity-50">
    <ShoppingCart size={17}/>{busy?(ru?"Добавляем…":"Wird hinzugefügt…"):(ru?"Добавить в корзину":"In den Warenkorb")}
   </button>
  </div>
  </div>
  <div className="storefront-desktop-hero desktop-promotion hidden md:grid">
    <div className="desktop-promotion-copy">
      <span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-semibold text-black">{ru?"ПОДАРОК":"GRATIS"}</span>
      <h2>{ru?promotion.titleRu:promotion.titleDe}</h2>
      <p>{ru?"Два аромата по 5 мл и третий в подарок":"Zwei Düfte à 5 ml und eine Gratisprobe"}</p>
      <div className="desktop-promotion-total">
       <div className="flex flex-col gap-0.5">
        <span className="text-[10px] text-[#c0bfc3]">{ru?"Цена набора":"Setpreis"}</span>
        <strong>{formatMoney(total)} €</strong>
       </div>
       {savings>0&&<div className="ml-auto flex min-w-0 flex-col gap-0.5 text-right">
        <span className="text-[10px] text-[#c0bfc3]">{ru?"По отдельности":"Einzeln zusammen"}</span>
        <del>{formatMoney(was)} €</del>
       </div>}
      </div>
      {savings>0&&<div className="desktop-promotion-savings flex w-full items-center justify-between gap-2 rounded-md bg-[#e7f2eb] px-3 py-2 text-[#266b4c]">
       <span className="text-[11px] font-medium">{ru?"Вы экономите":"Du sparst"}</span>
       <strong className="text-[15px] font-semibold tabular-nums">−{formatMoney(savings)} €</strong>
      </div>}
      <button type="button" disabled={busy||promotion.preview} onClick={add} className="desktop-promotion-button disabled:opacity-50"><ShoppingCart size={16}/>{busy?(ru?"Добавляем…":"Wird hinzugefügt…"):(ru?"Добавить в корзину":"In den Warenkorb")}</button>
    </div>
    <div className="desktop-promotion-products">{products.map(p=><Link key={p.id} href={`/product/${p.id}`} onClick={()=>{if(!promotion.preview) void trackPromotion(promotion.slug,"click")}} aria-label={`${ru?"Подробнее об аромате":"Duftdetails ansehen"}: ${p.brand} ${p.name.trim()}`} className="desktop-promotion-product group transition-colors hover:border-[#a5a4a7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
      {p.isGift&&<span className="absolute right-2 top-2 rounded-full bg-[#ffbb22] px-2 py-1 text-[9px] font-semibold text-black">{ru?"Подарок":"Gratis"}</span>}
      <div className="desktop-promotion-image">{p.image?<img src={p.image} alt={p.name} loading="lazy"/>:<Gift/>}</div>
      <h3>{p.name.trim()}</h3><p className="meta">{p.brand} · {p.isGift?promotion.giftMl:promotion.requiredMl} ml</p>
      <p className="price">{p.isGift&&<del className="mr-2 text-[#999]">{formatMoney(p.price)} €</del>}<span className={p.isGift?"text-[#b4f2d3]":""}>{formatMoney(p.isGift?0:p.price)} €</span></p>
    </Link>)}</div>
  </div>
 </section>;
}
