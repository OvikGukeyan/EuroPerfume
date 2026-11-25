"use client";
import React, { FC } from "react";
import { formatMoney } from "@/src/shared/lib/money";
import { deliveryCountryForCheckout } from "@/src/shared/lib/tax";
import { TaxPriceNotice } from "../tax-price-notice";
import { useWatch } from "react-hook-form";
import { ArrowRight, BadgeCheck, TicketPercent, ShieldCheck } from "lucide-react";
import { WhiteBlock } from "..";
import { Button, FormInput, Skeleton } from "../..";
import { useLocale, useTranslations } from "next-intl";
import { FormControl, FormField, FormItem } from "../../ui/form";
import { Control } from "react-hook-form";
import { CheckoutFormValues } from "@/src/shared/constants";
import { SHOP_SETTINGS } from "@/src/config/shop";

interface Props {
 className?:string;loading?:boolean;itemLoading?:boolean;totalAmount:number;
 minimumOrderMet:boolean;deliveryPrice:number;totalAmountWithDelivery:number;
 control:Control<CheckoutFormValues>;onPromocodeSubmit:()=>void;
 discount?:number;discountAmount?:number;hasCouponExclusions?:boolean;promoError:string|null;
 walletBalance:number;redemptionEnabled:boolean;redeemPoints:number;applyPoints:boolean;onApplyPointsChange:(checked:boolean)=>void;
}
export const CheckoutSidebar:FC<Props>=({className,loading,itemLoading,totalAmount,minimumOrderMet,deliveryPrice,totalAmountWithDelivery,control,onPromocodeSubmit,discount,discountAmount,hasCouponExclusions,promoError,walletBalance,redemptionEnabled,redeemPoints,applyPoints,onApplyPointsChange})=>{
 const deliveryCountry=useWatch({control,name:"deliveryCountry"});
 const billingCountry=useWatch({control,name:"country"});
 const shippingMethod=useWatch({control,name:"shippingMethod"});
 const country=deliveryCountryForCheckout({shippingMethod,deliveryCountry,country:billingCountry||"DEU"});
 const ru=useLocale()==="ru";
 const t=useTranslations("Checkout.sidebar");
 return <WhiteBlock className={`overflow-hidden rounded-md border-[#e5e5e5] shadow-none ${className||""}`} contentClassName="p-0">
  <div className="border-b border-[#e9e9e9] bg-[#f7f8f8] px-5 py-5 md:px-6">
   <h2 className="text-[17px] font-semibold tracking-tight text-[#252525]">{ru?"Ваш заказ":"Deine Bestellung"}</h2>
   <p className="mt-1 text-xs text-[#757575]">{ru?"Все суммы окончательно проверяются при отправке заявки":"Alle Beträge werden bei der Anfrage geprüft"}</p>
  </div>
  <div className="space-y-4 px-5 py-5 md:px-6">
   <div className="flex items-center justify-between gap-3 text-[13px] text-[#555]">
    <span>{t("orderPrice")}</span><span className="font-medium tabular-nums">{loading?<Skeleton className="h-5 w-20"/>:`${formatMoney(totalAmount)} €`}</span>
   </div>
   <div className="flex items-center justify-between gap-3 text-[13px] text-[#555]">
    <span>{t("delivery")}</span>
    <span className={deliveryPrice===0?"font-semibold text-[#28724f]":"font-medium tabular-nums"}>{loading?<Skeleton className="h-5 w-20"/>:deliveryPrice===0?(ru?"Бесплатно":"Kostenlos"):`${formatMoney(deliveryPrice)} €`}</span>
   </div>
   {!!discount&&discount>0&&!!discountAmount&&discountAmount>0&&<div className="flex items-center justify-between gap-3 text-[13px] text-[#26694a]">
    <span className="flex items-center gap-1.5"><TicketPercent size={15}/>{t("discount")} ({discount}%)</span><strong className="tabular-nums">−{formatMoney(discountAmount)} €</strong>
   </div>}
   {redemptionEnabled&&walletBalance>0&&<label className="flex cursor-pointer items-start gap-3 rounded-md border border-[#e8e0d8] bg-[#faf8f6] px-4 py-3 text-sm">
    <input type="checkbox" checked={applyPoints} onChange={e=>onApplyPointsChange(e.target.checked)} className="mt-1 h-4 w-4 accent-[#725b53]"/>
    <span><strong className="block font-medium">{ru?"Использовать бонусы EURO PERFUME CLUB":"EURO PERFUME CLUB Punkte nutzen"}</strong>
      <span className="block text-xs text-neutral-600">{walletBalance} {ru?"баллов доступно":"Punkte verfügbar"} · {ru?"до 20% подходящих товаров":"bis zu 20% geeigneter Waren"}</span>
    </span>
   </label>}
   {redeemPoints>0&&<div className="flex justify-between gap-2 text-sm text-[#26694a]"><span>{ru?"Резерв баллов до выставления счёта":"Punkte bis zur Rechnung reserviert"}</span><strong>−{formatMoney(redeemPoints/100)} €</strong></div>}
   <div className="border-t border-[#e5e5e5] pt-4">
    <div className="flex items-baseline justify-between gap-3">
     <strong className="text-[16px]">{ru?"Итого":"Gesamt"}</strong>
     {loading?<Skeleton className="h-8 w-32"/>:<strong className="text-[25px] font-semibold tracking-tight tabular-nums">{formatMoney(totalAmountWithDelivery)} €</strong>}
    </div>
    <div className="mt-2"><TaxPriceNotice gross={totalAmountWithDelivery} country={country}/></div>
   </div>
   <p id="checkout-minimum-order" className={loading||minimumOrderMet?"text-sm text-neutral-600":"text-sm text-red-700"}>
    {t("minOrder",{amount:SHOP_SETTINGS.MIN_ORDER_EUR})}
   </p>
   <Button loading={loading||itemLoading} type="submit" disabled={loading||itemLoading||!minimumOrderMet} aria-describedby="checkout-minimum-order"
    className="mt-1 flex min-h-[54px] w-full items-center justify-center rounded-sm bg-[#242a34] text-sm font-semibold tracking-wide text-white hover:bg-[#39404b]">
    {t("submitButton")} <ArrowRight className="ml-2 h-4 w-4"/>
   </Button>
   <div className="flex gap-2 rounded-md border border-[#e1e9e5] bg-[#f5f9f7] p-3 text-xs leading-5 text-[#3d6353]">
    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0"/>
    <span>{ru?"Это заявка на заказ. Онлайн-оплата не требуется — мы свяжемся с вами выбранным способом.":"Dies ist eine Bestellanfrage ohne Online-Zahlung. Wir kontaktieren dich auf dem gewählten Weg."}</span>
   </div>
   <details className="group rounded-md border border-[#e5e5e5] bg-white" open={Boolean(discountAmount&&discountAmount>0)}>
    <summary className="flex min-h-12 cursor-pointer items-center justify-between gap-3 px-3 text-xs font-medium uppercase tracking-wide text-[#4d4d4d]">
     <span className="flex items-center gap-2"><TicketPercent size={16}/>{ru?"Промокод или купон":"Rabattcode oder Gutschein"}</span>
     {discountAmount&&discountAmount>0?<BadgeCheck size={17} className="text-[#28724f]"/>:<span className="text-[#777]">＋</span>}
    </summary>
    <div className="px-3 pb-3">
     <div className="flex items-start gap-2">
      <FormField name="promocode" control={control} render={({field})=><FormItem className="min-w-0 flex-1"><FormControl><FormInput {...field} type="text" placeholder={t("promocode")}/></FormControl></FormItem>}/>
      <Button type="button" variant="outline" onClick={onPromocodeSubmit} disabled={!totalAmount} className="h-12 shrink-0 rounded-sm border-neutral-300 px-4 text-sm">{t("apply")}</Button>
     </div>
     {hasCouponExclusions&&<p className="mt-2 text-xs leading-5 text-neutral-600">{ru?"Промокод не распространяется на акционные товары. Скидка применена только к товарам, участвующим в предложении.":"Der Gutscheincode gilt nicht für Aktionsartikel. Der Rabatt wurde nur auf berechtigte Artikel angewendet."}</p>}
     {promoError&&<p role="alert" className="mt-2 text-xs text-red-600">{promoError}</p>}
    </div>
   </details>
  </div>
 </WhiteBlock>;
};
