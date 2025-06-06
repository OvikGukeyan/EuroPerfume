"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ContactForms, DeliveryTypes, ShippingMethods } from "@prisma/client";
import { checkoutFormSchema, CheckoutFormValues } from "@/src/shared/constants";
import { useCart } from "@/src/shared/hooks";
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
import { useTranslations } from "next-intl";
import { useRouter } from "@/src/i18n/navigation";

export default function Checkout() {
  const [submitting, setSubmitting] = useState(false);
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
      deliveryAddress: "",
      city: "",
      deliveryCity: "",
      zip: "",
      deliveryZip: "",
      contactForm: ContactForms.WA,
      comment: "",
      deliveryType: DeliveryTypes.PBH,
      postNumber: "",
      postOffice: "",
      packstationNumber: "",
      shippingMethod: ShippingMethods.BILLING_ADDRESS,
    },
  });

  const delivery = form.watch("deliveryType");
  const { totalAmountWithDelivery, deliveryPrice } =
    calcTotlalAmountWithDelivery(totalAmount, delivery);

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

  const onSubmit = async (data: CheckoutFormValues) => {
    try {
      setSubmitting(true);
      const order = await createOrder(data);
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

  const onClickCountButton = (
    id: number,
    quantity: number,
    type: "plus" | "minus"
  ) => {
    const newQuantity = type === "plus" ? quantity + 1 : quantity - 1;
    updateItemQuantity(id, newQuantity);
  };

  const t = useTranslations("Checkout");

  return (
    <div className="mt-10">
      <Title text={t("title")} size="xl" className="font-extrabold mb-8" />
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="flex flex-col gap-10 flex-1 mb-20">
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

            <div className="w-full lg:w-[450px] mx-auto">
              <CheckoutSidebar
                itemLoading={itemLoading}
                loading={loading || submitting}
                totalAmount={totalAmount}
                deliveryPrice={deliveryPrice}
                totalAmountWithDelivery={totalAmountWithDelivery}
              />
            </div>
          </div>
        </form>
      </FormProvider>
      <Recommendations className="my-20 py-20 px-2 md:px-10 rounded-3xl bg-white" searchParams={{ productGroupId: 2}} />
    </div>
  );
}
