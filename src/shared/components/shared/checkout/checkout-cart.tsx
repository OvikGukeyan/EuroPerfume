"use client";
import React, { FC } from "react";
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
  onClickCountButton:(id:number,quantity:number,type:"plus"|"minus",productGroup:number)=>void;
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
    quantity={item.quantity} disabled={item.disabled} variation={item.variationName}
    onClickCountButton={type=>onClickCountButton(item.id,item.quantity,type,item.productGroup?.id||2)}
    onClickRemove={()=>removeCartItem(item.id)}
  />;
  return <WhiteBlock className={className} title={t("stepTitle")}>
    <div className="flex flex-col">
      {!loading&&<AromaBoxSummary items={items}/>}
      {!loading&&promotions.map(p=><PromotionCartGroup key={p.id} promotion={p} items={items} onRemove={removeCartItem} renderItem={renderItem}/>)}
      {loading?[...Array(4)].map((_,i)=><CheckoutItemSkeleton key={i}/>):regularItems.map(item=>renderItem(item))}
    </div>
    {!totalAmount&&!loading&&<p className="p-10 text-center text-gray-400">{t("emptyText")}</p>}
    <FreeShippingProgress totalAmount={totalAmount}/>
  </WhiteBlock>;
};
