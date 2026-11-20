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
 const was=total+(gift?.price||0);
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
  <div className="mt-4 flex flex-col items-stretch justify-between gap-3 md:mt-7 md:flex-row md:items-center">
   <div className="flex items-center justify-between gap-3 md:flex-col md:items-start">
    <span className="text-[11px] text-[#bdbdc1]">{ru?"Стоимость набора":"Setpreis"}</span>
    <strong className="text-xl tabular-nums md:text-2xl">{formatMoney(total)} €</strong>
    {was>total&&<del className="text-[11px] text-[#aaa]">{formatMoney(was)} €</del>}
   </div>
   <button type="button" disabled={busy||promotion.preview} onClick={add} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-[13px] font-semibold text-black transition hover:bg-[#eee] disabled:opacity-50 md:w-auto md:px-9 md:text-base">
    <ShoppingCart size={17}/>{busy?(ru?"Добавляем…":"Wird hinzugefügt…"):(ru?"Добавить в корзину":"In den Warenkorb")}
   </button>
  </div>
  </div>
  <div className="storefront-desktop-hero desktop-promotion hidden md:grid">
    <div className="desktop-promotion-copy">
      <span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-semibold text-black">{ru?"ПОДАРОК":"GRATIS"}</span>
      <h2>{ru?promotion.titleRu:promotion.titleDe}</h2>
      <p>{ru?"Два аромата по 5 мл и третий в подарок":"Zwei Düfte à 5 ml und eine Gratisprobe"}</p>
      <div className="desktop-promotion-total"><strong>{formatMoney(total)} €</strong>{was>total&&<del>{formatMoney(was)} €</del>}</div>
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
