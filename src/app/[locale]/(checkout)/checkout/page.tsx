"use client";

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
  Title,
} from "@/src/shared/components";
import { useCartStore } from "@/src/shared/store/cart";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/src/i18n/navigation";
import { useSearchParams } from "next/navigation";

export default function Checkout() {
  const locale=useLocale();
  const [submitting, setSubmitting] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);
  const {
    totalAmount,
    items,
    updateItemQuantity,
    removeCartItem,
    loading,
    itemLoading,
  } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
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


  useEffect(() => {
    if (searchParams.get("campaign") === "WOOD_TRIO_GIFT_2026") {
      const note = "[AKTION WOOD_TRIO_GIFT_2026: Encre Noire 2 ml gratis beilegen]";
      const old = form.getValues("comment") || "";
      if (!old.includes("WOOD_TRIO_GIFT_2026")) form.setValue("comment", [old, note].filter(Boolean).join("\\n"));
    }
  }, [searchParams, form]);

  const discount = form.watch("discount");
  const deliveryCountry = deliveryCountryForCheckout({ shippingMethod: form.watch("shippingMethod"), deliveryCountry: form.watch("deliveryCountry"), country: form.watch("country") });
  const { totalAmountWithDelivery, deliveryPrice } =
    calcTotlalAmountWithDelivery(totalAmount, deliveryCountry, discount);

  useEffect(() => {
    async function fetchUserInfo() {
      const data = await Api.auth.getMe();
      const [firstName, lastName] = data.fullName.split(" ");

      form.setValue("firstName", firstName);
      form.setValue("lastName", lastName);
      form.setValue("email", data.email);
    }

    if (session) {
      fetchUserInfo();
    }
  }, [session]);

  useEffect(() => { if (items.some(i=>i.dayOffer)) { form.setValue("discount",0); form.setValue("promocode",""); } }, [items, form]);
  const onSubmit = async (data: CheckoutFormValues) => {
    try {
      setSubmitting(true);
      const result=await createOrder({ ...data, quotedTotal: totalAmountWithDelivery });
      if(result?.code==="PRICES_CHANGED") {
        form.setValue("discount",0); form.setValue("promocode","");
        await useCartStore.getState().fetchCartItems();
        toast.error(locale==="ru"?"Цена или срок акции изменились. Проверьте сумму и отправьте заявку ещё раз.":"Preis oder Aktionszeitraum geändert. Bitte Betrag prüfen und Anfrage erneut senden.");
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
    if (items.some(i => i.dayOffer)) { toast.error(locale==="ru"?"Товар дня не суммируется с промокодом.":"Tagesangebote sind nicht mit Gutscheinen kombinierbar."); return; }
    try {
      setSubmitting(true);
      const promoCode = form.watch("promocode") || "";
      const data = await Api.promocode.validatePromocode(promoCode);
      form.setValue("discount", data.discount);
      form.setError("promocode", { message: "" });
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong", { icon: "❌" });
      form.setError("promocode", { message: "Ungültiger Gutscheincode" });
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
    <div className="mx-auto max-w-6xl px-1 py-6 md:py-10">
      <Title text={t("title")} size="md" className="font-semibold mb-6" />
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <div className="flex min-w-0 flex-col gap-5 flex-1 mb-2">
              <CheckoutCart
                loading={loading}
                items={items}
                totalAmount={totalAmount}
                removeCartItem={removeCartItem}
                onClickCountButton={onClickCountButton}
              />

              <CheckoutPersonalForm totalAmount={totalAmount} />

              <CheckoutDeliveryForm totalAmount={totalAmount} />
            </div>

            <div className="w-full lg:w-[370px] mx-auto">
              <CheckoutSidebar
                itemLoading={itemLoading}
                loading={loading || submitting}
                totalAmount={totalAmount}
                deliveryPrice={deliveryPrice}
                totalAmountWithDelivery={totalAmountWithDelivery}
                control={form.control}
                onPromocodeSubmit={onPromocodeSubmit}
                discount={discount}
                promoError={promoError}
              />
            </div>
          </div>
        </form>
      </FormProvider>
      <Recommendations
        className="my-12 py-6 px-2 md:px-6 border-t border-neutral-200"
        searchParams={{ productGroupId: 2 }}
      />
    </div>
  );
}
