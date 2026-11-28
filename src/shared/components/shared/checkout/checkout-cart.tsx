"use client";
import React, { FC } from "react";
import { DecantPackOptions } from "../decant-pack-options";
import { PromotionCartGroup } from "../promotion-cart-group";
import { AromaBoxSummary } from "../aroma-box-summary";
import { CheckoutItem,CheckoutItemSkeleton,FreeShippingProgress,WhiteBlock } from "..";
import type { CartPromotionSummary } from "@/src/shared/services/dto/cart.dto";
import type { CartStateItem } from "@/src/shared/lib/get-cart-details";
import { useLocale } from "next-intl";
import { useTranslations } from "use-intl";
interface Props {
  items:CartStateItem[];promotions?:CartPromotionSummary[];totalAmount:number;
  removeCartItem:(id:number)=>void;
  onClickCountButton:(id:number,quantity:number,type:"plus"|"minus",packMl?:number|null)=>void;
  loading?:boolean;itemLoading?:boolean;className?:string;
}
export const CheckoutCart:FC<Props>=({className,items,promotions=[],totalAmount,removeCartItem,onClickCountButton,loading})=>{
  const ru=useLocale()==="ru";
  const t=useTranslations("Checkout.cart");
  const claimedIds=new Set(promotions.flatMap(p=>p.productIds));
  const regularItems=items.filter(item=>!claimedIds.has(item.productId));
  const renderItem=(item:CartStateItem)=><CheckoutItem
    key={item.id} id={item.id} imageUrl={item.imageUrl as string}
    name={item.name+(item.dayOffer?(ru?" · Товар дня −10%":" · Tagesangebot −10%"):"")}
    brand={item.brand} price={item.price} onTap={Boolean(item.productGroup?.onTap)}
    packMl={item.packMl} lockedCount={item.aromaBox || item.invalidPack} options={<DecantPackOptions item={item}/>}
    quantity={item.quantity} disabled={item.disabled} variation={item.variationName}
    onClickCountButton={type=>onClickCountButton(item.id,item.quantity,type,item.packMl)}
    onClickRemove={()=>removeCartItem(item.id)}
  />;
  return <WhiteBlock className={`rounded-md border-[#e5e5e5] shadow-none ${className||""}`} title={t("stepTitle")} contentClassName="px-4 pb-5 pt-4 md:px-6 md:pb-6">
    <div className="flex flex-col">
      <p className="mb-3 text-xs leading-5 text-[#777]">{ru?"Выбранные товары и подарки по акциям. Количество можно изменить перед отправкой заявки.":"Ausgewählte Artikel und Aktionsgeschenke. Mengen können vor der Anfrage geändert werden."}</p>
      {!loading&&<AromaBoxSummary items={items}/>}
      {!loading&&promotions.map(p=><PromotionCartGroup key={p.id} promotion={p} items={items} onRemove={removeCartItem} renderItem={renderItem}/>)}
      {loading?[...Array(4)].map((_,i)=><CheckoutItemSkeleton key={i}/>):regularItems.map(item=>renderItem(item))}
    </div>
    {!totalAmount&&!loading&&<p className="p-10 text-center text-gray-400">{t("emptyText")}</p>}
    <div className="mt-5 rounded-md border border-[#e3eae7] bg-[#f5f9f7] px-3 py-1"><FreeShippingProgress totalAmount={totalAmount}/></div>
  </WhiteBlock>;
};
