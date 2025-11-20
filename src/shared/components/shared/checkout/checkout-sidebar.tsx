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
import { useTranslations } from "next-intl";
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
}) => {
  const isMinOrderAmount = totalAmount >= SHOP_SETTINGS.MIN_ORDER_EUR;

  const t = useTranslations("Checkout.sidebar");

  return (
    <WhiteBlock className="p-2 md:p-6 sticky top-4">
      <div className="flex flex-col gap-1">
        <span className="text-xl">{t("totalPriceLabel")}</span>
        {loading ? (
          <Skeleton className="h-11 w-40" />
        ) : (
          <span className="h-11 text-[34px] font-extrabold">
            {totalAmountWithDelivery} €
          </span>
        )}
      </div>

      <OrderDetails
        title={
          <div className="flex items-center">
            <Package size={18} className="mr-2 text-gray-400" />
            {t("orderPrice")}
          </div>
        }
        value={loading ? <Skeleton className="h-6 w-16" /> : totalAmount + " €"}
      />

      <OrderDetails
        title={
          <div className="flex items-center">
            <Truck size={18} className="mr-2 text-gray-400" />
            {t("delivery")}
          </div>
        }
        value={
          loading ? <Skeleton className="h-6 w-16" /> : deliveryPrice + " €"
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

      <div className="flex justify-between ">
        <FormField
          name="promocode"
          control={control as Control<CheckoutFormValues>}
          render={({ field }) => (
            <FormItem className="mb-5">
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
          className=" h-12 rounded-2xl  text-base font-bold"
          variant="outline"
          type="button"
        >
          {discount && discount > 0 ? (
            <BadgeCheck width={30} height={30} />
          ) : (
            "Apply"
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
        className="w-full h-14 rounded-2xl mt-6 text-base font-bold bg-green-500"
      >
        {t("submitButton")}
        <ArrowRight className="w-5 ml-2" />
      </Button>
    </WhiteBlock>
  );
};
