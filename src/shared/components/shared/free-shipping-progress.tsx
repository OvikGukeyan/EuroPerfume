import React, { FC } from "react";
import { cn } from "@/src/lib/utils";
import { Progress } from "..";
import { useTranslations } from "next-intl";
import { SHOP_SETTINGS } from "@/src/config/shop";

type Props = {
  className?: string;
  totalAmount: number;
};

export const FreeShippingProgress: FC<Props> = ({ className, totalAmount }) => {
  const isFreeShipping = totalAmount >= SHOP_SETTINGS.FREE_DELIVERY_AMOUNT;
  const currentProgress = (totalAmount * 100) / SHOP_SETTINGS.FREE_DELIVERY_AMOUNT;
  const remainingAmount = (SHOP_SETTINGS.FREE_DELIVERY_AMOUNT - totalAmount).toFixed(2);
  const t = useTranslations("Cart");
  return (
    <div
      className={cn("w-full py-4 px-2 flex flex-col gap-2 items-center text-center text-xs", className)}
    >
      <div>
        {isFreeShipping && (
          <span className="text-neutral-800">{t("freeShipping")}</span>
        )}
        {!isFreeShipping && (
          <span className="text-neutral-600">
            {t("freeShippingRemaining", {
              amount: remainingAmount,
            })}
          </span>
        )}
      </div>
      {!isFreeShipping && (
        <Progress value={currentProgress} className="w-full h-1" />
      )}
    </div>
  );
};
