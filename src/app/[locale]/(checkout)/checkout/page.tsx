"use client";

import { BLACK_FRIDAY, blackFridayActive, isBlackFridayCode } from "@/src/shared/lib/black-friday";
import { couponQuote, giftPromotionProductIds } from "@/src/shared/lib/coupon-eligibility";
import { useDayOfferClock } from "@/src/shared/hooks/use-day-offer";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ContactForms, ShippingMethods } from "@prisma/client";
import { checkoutFormSchema, CheckoutFormValues } from "@/src/shared/constants";
import { useCart } from "@/src/shared/hooks";
import { deliveryCountryForCheckout } from "@/src/shared/lib/tax";
import { calcTotlalAmountWithDelivery } from "@/src/shared/lib";
import { Api } from "@/src/shared/services/api-client";
import { createOrder } from "@/src/app/actions";
import {
  CheckoutCart,
  CheckoutDeliveryForm,
  CheckoutPersonalForm,
  CheckoutSidebar,
  Recommendations,
} from "@/src/shared/components";
import { useCartStore } from "@/src/shared/store/cart";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, Link } from "@/src/i18n/navigation";
import { ArrowLeft, MessageCircle, ShoppingBag, Truck } from "lucide-react";

export default function Checkout() {
  const locale=useLocale();
  const [savedAddresses,setSavedAddresses]=useState<import("@/src/shared/lib/customer-account").AccountAddress[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);
  const {
    totalAmount,
    items,
    promotions,
    updateItemQuantity,
    removeCartItem,
    loading,
    itemLoading,
  } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      email: "",
      firstName: "",
      deliveryFirstName: "",
      lastName: "",
      deliveryLastName: "",
      phone: "",
      address: "",
      houseNumber: "",
      deliveryAddress: "",
      country: "DEU",
      deliveryCountry: "",
      city: "",
      deliveryCity: "",
      zip: "",
      deliveryZip: "",
      contactForm: ContactForms.WA,
      comment: "",
      postNumber: "",
      postOffice: "",
      packstationNumber: "",
      shippingMethod: ShippingMethods.BILLING_ADDRESS,
      promocode: "",
      discount: 0,
    },
  });


  const [appliedCode, setAppliedCode] = useState("");
  const enteredCode = (form.watch("promocode") || "").trim();
  const promoNow = useDayOfferClock({dayOfferStartsAt:BLACK_FRIDAY.startsAt,dayOfferEndsAt:BLACK_FRIDAY.endsAt});
  const blackFriday = isBlackFridayCode(appliedCode);
  const configuredDiscount = form.watch("discount") || 0;
  const discount = appliedCode === enteredCode && (!blackFriday || blackFridayActive(promoNow)) ? configuredDiscount : 0;
  const blockedGiftIds = giftPromotionProductIds(promotions);
  const coupon = couponQuote(items.map(item=>({
    productId:item.productId,grossCents:Math.round(item.price*100),
    excluded:Boolean(item.discounted||item.dayOffer||blockedGiftIds.has(item.productId))
  })),discount);
  const deliveryCountry = deliveryCountryForCheckout({shippingMethod:form.watch("shippingMethod"),deliveryCountry:form.watch("deliveryCountry"),country:form.watch("country")});
  const totals=calcTotlalAmountWithDelivery(totalAmount,deliveryCountry,0);
  const totalAmountWithDelivery=(Math.round(totals.totalAmountWithDelivery*100)-coupon.discountCents)/100;
  const deliveryPrice=totals.deliveryPrice;
  useEffect(() => {
    // A removed product or expired offer can make an applied coupon worth zero.
    if (appliedCode && discount>0 && coupon.discountCents===0) {
      setAppliedCode("");
      form.setValue("discount",0);
      setPromoError(locale==="ru"
        ? "В корзине нет товаров, на которые распространяется этот промокод."
        : "Im Warenkorb befinden sich keine Artikel, für die dieser Gutscheincode gilt.");
    }
  },[appliedCode,discount,coupon.discountCents,form,locale]);


  useEffect(() => {
    async function fetchUserInfo() {
      const response=await fetch("/api/account",{cache:"no-store"});
      if(!response.ok)return;
      const data=await response.json();
      setSavedAddresses(data.addresses||[]);
      const [firstName, ...rest] = data.fullName.split(" ");
      const lastName=rest.join(" ");

      form.setValue("firstName", firstName);
      form.setValue("lastName", lastName);
      form.setValue("email", data.email);
    }

    if (session) {
      fetchUserInfo().catch(()=>{});
    }
  }, [session]);


  const onSubmit = async (data: CheckoutFormValues) => {
    try {
      setSubmitting(true);
      const result=await createOrder({ ...data, promocode: coupon.discountCents>0 ? appliedCode : "", quotedTotal: totalAmountWithDelivery });
      if(result?.code==="PROMOCODE_INELIGIBLE" || result?.code==="PROMOCODE_INVALID") {
        setAppliedCode("");form.setValue("discount",0);
        await useCartStore.getState().fetchCartItems();
        toast.error(locale==="ru"?"В корзине нет товаров, на которые распространяется этот промокод.":"Im Warenkorb befinden sich keine Artikel, für die dieser Gutscheincode gilt.");
        return;
      }
      if(result?.code==="PRICES_CHANGED") {
        form.setValue("discount",0); form.setValue("promocode","");
        await useCartStore.getState().fetchCartItems();
        toast.error(locale==="ru"?"Цена или срок акции изменились. Проверьте сумму и отправьте заявку ещё раз.":"Preis oder Aktionszeitraum geändert. Bitte Betrag prüfen und Anfrage erneut senden.");
        return;
      }
      if(result?.code==="CAMPAIGN_INVALID") {
        await useCartStore.getState().fetchCartItems();
        toast.error(locale==="ru" ? "Для подарка нужны Cedar Chic 5 мл и Bois Impérial 5 мл в одном заказе." : "Für das Geschenk müssen Cedar Chic 5 ml und Bois Impérial 5 ml im Warenkorb sein.");
        return;
      }
      if(result?.code==="BOTTLE_STOCK"){
        await useCartStore.getState().fetchCartItems();
        toast.error(locale==="ru"?"Этот объём закончился или его осталось меньше. Проверьте количество в корзине.":"Dieser Flakon ist nicht mehr in der gewünschten Menge verfügbar. Bitte prüfen Sie Ihren Warenkorb.");
        return;
      }
      toast.success("Order created successfully! ", {
        icon: "✅",
      });

      router.push(`/`);
    } catch (error) {
      setSubmitting(false);
      console.log(error);
      toast.error("Failed to create order", {
        icon: "🚨",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const onPromocodeSubmit = async () => {
    try {
      setSubmitting(true);
      const data=await Api.promocode.validatePromocode(enteredCode);
      if(!data.valid || !data.discountCents) throw new Error("NO_ELIGIBLE_ITEMS");
      setAppliedCode(data.code || enteredCode);
      form.setValue("promocode",data.code || enteredCode);
      form.setValue("discount",data.discount);
      setPromoError(null);
      form.clearErrors("promocode");
      if(data.excludedCents>0) {
        toast(locale==="ru"
          ?"Промокод не распространяется на акционные товары. Скидка применена только к товарам, участвующим в предложении."
          :"Der Gutscheincode gilt nicht für Aktionsartikel. Der Rabatt wurde nur auf berechtigte Artikel angewendet.");
      }
    } catch(error) {
      setAppliedCode("");
      form.setValue("discount",0);
      const status=(error as {response?:{status?:number}})?.response?.status;
      const noEligible=status===422 || (error instanceof Error && error.message==="NO_ELIGIBLE_ITEMS");
      const message=noEligible
        ? (locale==="ru"?"В корзине нет товаров, на которые распространяется этот промокод.":"Im Warenkorb befinden sich keine Artikel, für die dieser Gutscheincode gilt.")
        : isBlackFridayCode(enteredCode)
          ? (locale==="ru"?"BLACK15 действует только 27 ноября 2026 по берлинскому времени.":"BLACK15 gilt nur am 27. November 2026 (Berliner Zeit).")
          : (locale==="ru"?"Промокод недействителен.":"Ungültiger Gutscheincode.");
      setPromoError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const onClickCountButton = (
    id: number,
    quantity: number,
    type: "plus" | "minus",
    productGroup: number
  ) => {
    const isDraft = productGroup < 4;
    if (isDraft && quantity < 3 && type === "minus") {
      return;
    }

    const newQuantity = type === "plus" ? quantity + 1 : quantity - 1;
    updateItemQuantity(id, newQuantity);
  };

  const t = useTranslations("Checkout");
  const { setValue } = useForm<any>({ mode: "onChange" });
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6 md:px-8 md:py-10">
      <header className="mb-8 border-b border-[#e8e8e8] pb-7">
        <Link href="/items" className="mb-5 inline-flex items-center gap-2 text-xs text-[#666] underline-offset-4 hover:underline"><ArrowLeft size={14}/>{locale==="ru"?"Продолжить покупки":"Weiter einkaufen"}</Link>
        <p className="mb-2 text-[10px] uppercase tracking-[.22em] text-[#89746b]">EURO PERFUME</p>
        <h1 className="text-[27px] font-medium tracking-tight text-[#222] md:text-[34px]">{t("title")}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[#676767]">{locale==="ru"?"Проверьте товары, укажите адрес и оставьте удобный способ связи. Мы лично подтвердим заказ — онлайн-оплата не требуется.":"Prüfe deine Artikel, gib die Lieferadresse und deinen bevorzugten Kontaktweg an. Wir bestätigen deine Anfrage persönlich, ohne Online-Zahlung."}</p>
        <div className="mt-6 grid grid-cols-3 gap-2 border-t border-[#ededed] pt-5" aria-label={locale==="ru"?"Этапы оформления заявки":"Ablauf der Bestellanfrage"}>
          {[
            {icon:ShoppingBag,ru:"Товары",de:"Warenkorb"},
            {icon:Truck,ru:"Адрес и доставка",de:"Adresse & Versand"},
            {icon:MessageCircle,ru:"Связь и подтверждение",de:"Kontakt & Bestätigung"}
          ].map((step,i)=><div key={step.de} className="flex items-center gap-2 text-[#666]">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#dadada] bg-[#fafafa]"><step.icon size={15}/></span>
            <span className="text-[10px] leading-tight sm:text-xs">{locale==="ru"?step.ru:step.de}</span>
          </div>)}
        </div>
      </header>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-[minmax(0,1fr)_360px] xl:gap-10">
            <div className="flex min-w-0 flex-col gap-6">
              <CheckoutCart
                loading={loading}
                items={items}
                promotions={promotions}
                totalAmount={totalAmount}
                removeCartItem={removeCartItem}
                onClickCountButton={onClickCountButton}
              />

              {savedAddresses.length>0&&<label className="block rounded-lg border border-gray-200 bg-white p-5 mb-5 text-sm">{locale==="ru"?"Сохранённый адрес":"Gespeicherte Adresse"}<select defaultValue="" className="mt-3 w-full min-h-12 border rounded-md p-3 bg-white" onChange={e=>{const a=savedAddresses.find(a=>a.id===e.target.value);if(!a)return;const [firstName,...last]=a.fullName.split(" ");form.setValue("firstName",firstName);form.setValue("lastName",last.join(" "));form.setValue("address",a.street);form.setValue("houseNumber",a.houseNumber);form.setValue("city",a.city);form.setValue("zip",a.postalCode);form.setValue("country",a.country);form.setValue("phone",a.phone);form.setValue("shippingMethod",ShippingMethods.BILLING_ADDRESS);}}><option value="">{locale==="ru"?"Выбрать адрес":"Adresse auswählen"}</option>{savedAddresses.map(a=><option key={a.id} value={a.id}>{a.fullName} · {a.street} {a.houseNumber} · {a.city}</option>)}</select></label>}
              <CheckoutPersonalForm totalAmount={totalAmount} />

              <CheckoutDeliveryForm totalAmount={totalAmount} />
            </div>

            <div className="w-full lg:sticky lg:top-5">
              <CheckoutSidebar
                itemLoading={itemLoading}
                loading={loading || submitting}
                totalAmount={totalAmount}
                deliveryPrice={deliveryPrice}
                totalAmountWithDelivery={totalAmountWithDelivery}
                control={form.control}
                onPromocodeSubmit={onPromocodeSubmit}
                discount={coupon.discountCents>0?discount:0}
                discountAmount={coupon.discountCents/100}
                hasCouponExclusions={coupon.hasExclusions && coupon.discountCents>0}
                promoError={promoError}
              />
            </div>
          </div>
        </form>
      </FormProvider>
      <Recommendations
        className="mb-3 mt-9 border-t border-[#e9e9e9] px-1 pb-1 pt-4 md:mb-6 md:mt-12 md:px-3 md:pt-6"
        searchParams={{ productGroupId: 2 }}
      />
    </div>
  );
}
