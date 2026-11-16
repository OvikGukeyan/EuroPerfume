"use client";
import { formatMoney } from "@/src/shared/lib/money";
import { deliveryCountryForCheckout } from "@/src/shared/lib/tax";
import { TaxPriceNotice } from "../tax-price-notice";
import { useWatch } from "react-hook-form";
import React, { FC } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Package,
  TicketPercent,
  Truck,
} from "lucide-react";
import { OrderDetails, WhiteBlock } from "..";
import { Button, FormInput, Skeleton } from "../..";
import { useLocale, useTranslations } from "next-intl";
import { FormControl, FormField, FormItem } from "../../ui/form";
import { Control } from "react-hook-form";
import { CheckoutFormValues } from "@/src/shared/constants";
import { SHOP_SETTINGS } from "@/src/config/shop";

interface Props {
  className?: string;
  loading?: boolean;
  itemLoading?: boolean;
  totalAmount: number;
  deliveryPrice: number;
  totalAmountWithDelivery: number;
  control: Control<CheckoutFormValues>;
  onPromocodeSubmit: () => void;
  discount?: number;
  excludeDiscounted?: boolean;
  promoError: string | null;
}

export const CheckoutSidebar: FC<Props> = ({
  className,
  loading,
  totalAmount,
  itemLoading,
  deliveryPrice,
  totalAmountWithDelivery,
  control,
  onPromocodeSubmit,
  discount,
  excludeDiscounted,
  promoError,
}) => {
  const deliveryCountry = useWatch({ control, name: "deliveryCountry" });
  const billingCountry = useWatch({ control, name: "country" });
  const shippingMethod = useWatch({ control, name: "shippingMethod" });
  const country = deliveryCountryForCheckout({ shippingMethod, deliveryCountry, country: billingCountry || "DEU" });
  const isMinOrderAmount = totalAmount >= SHOP_SETTINGS.MIN_ORDER_EUR;

  const ru = useLocale() === "ru";
  const t = useTranslations("Checkout.sidebar");

  return (
    <WhiteBlock className="sticky top-4" contentClassName="p-5 md:p-6">
      <div className="flex flex-col gap-1">
        <span className="text-xl">{t("totalPriceLabel")}</span>
        {loading ? (
          <Skeleton className="h-11 w-40" />
        ) : (
          <span className="h-11 text-[30px] font-semibold">
            {formatMoney(totalAmountWithDelivery)} €
          </span>
        )}
      </div>

      <TaxPriceNotice gross={totalAmountWithDelivery} country={country} />

      <OrderDetails
        title={
          <div className="flex items-center">
            <Package size={18} className="mr-2 text-gray-400" />
            {t("orderPrice")}
          </div>
        }
        value={loading ? <Skeleton className="h-6 w-16" /> : formatMoney(totalAmount) + " €"}
      />

      <OrderDetails
        title={
          <div className="flex items-center">
            <Truck size={18} className="mr-2 text-gray-400" />
            {t("delivery")}
          </div>
        }
        value={
          loading ? <Skeleton className="h-6 w-16" /> : formatMoney(deliveryPrice) + " €"
        }
      />

      {discount && discount > 0 ? (
        <OrderDetails
          title={
            <div className="flex items-center">
              <TicketPercent size={18} className="mr-2 text-gray-400" />
              {t("discount")}
            </div>
          }
          value={loading ? <Skeleton className="h-6 w-16" /> : discount + " %"}
        />
      ) : null}

      {excludeDiscounted && <p className="mb-3 text-xs text-neutral-600">{ru ? "−15% только на товары без скидки. Действует 27.11.2026 по времени Германии." : "−15% nur auf nicht reduzierte Artikel. Gültig am 27.11.2026 (deutsche Zeit)."}</p>}
      {promoError && <p role="alert" className="mb-3 text-sm text-red-600">{promoError}</p>}
      <div className="flex items-start gap-2">
        <FormField
          name="promocode"
          control={control as Control<CheckoutFormValues>}
          render={({ field }) => (
            <FormItem className="mb-5 min-w-0 flex-1">
              <FormControl>
                <FormInput
                  {...field}
                  placeholder={t("promocode")}
                  type="text"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button
          onClick={onPromocodeSubmit}
          disabled={!totalAmount}
          className=" h-12 rounded-lg  text-base font-bold"
          variant="outline"
          type="button"
        >
          {discount && discount > 0 ? (
            <BadgeCheck width={30} height={30} />
          ) : (
            <p>{t("apply")}</p>
          )}
        </Button>
      </div>
      {!isMinOrderAmount && (
        <div >
          <p className="text-sm text-red-500">
            {t("minOrder", { amount: SHOP_SETTINGS.MIN_ORDER_EUR })}
          </p>
        </div>
      )}
      <Button
        loading={loading || itemLoading}
        type="submit"
        disabled={!totalAmount || !isMinOrderAmount}
        className="w-full h-14 rounded-lg mt-6 text-base font-semibold bg-neutral-900 hover:bg-neutral-800"
      >
        {t("submitButton")}
        <ArrowRight className="w-5 ml-2" />
      </Button>
    </WhiteBlock>
  );
};
