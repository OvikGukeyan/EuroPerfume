"use client";

import React, { FC } from "react";
import {
  AdressInput,
  ErrorText,
  FormTextarea,
  MyPopover,
  RadioInput,
  Title,
  WhiteBlock,
} from "..";
import { cn } from "@/src/shared/lib/utils";
import { Controller, useFormContext } from "react-hook-form";
import { deliveryTypes } from "@/../../prisma/constants";
import { useTranslations } from "next-intl";

interface Props {
  totalAmount: number;
  className?: string;
}
export const CheckoutDeliveryForm: FC<Props> = ({ className, totalAmount }) => {
  const { control } = useFormContext();
  const t = useTranslations("Checkout.delivery");
  return (
    <WhiteBlock
      className={cn(
        className,
        !totalAmount ? "opacity-50 pointer-events-none" : ""
      )}
      title={t("stepTitle")}
      contentClassName="p-8"
    >
      <div className="flex flex-col gap-5">
        <Title text={t("deliveryType")} size="xs" />

        <div className="flex justify-between">
          <RadioInput name="deliveryType" items={deliveryTypes} />

          <MyPopover />
        </div>

        <Controller
          control={control}
          name="address"
          render={({ field, fieldState: { error } }) => (
            <>
              <AdressInput onChange={field.onChange} />
              {error?.message && <ErrorText text={error.message} />}
            </>
          )}
        />

        <FormTextarea
          name="comment"
          className="text-base"
          placeholder={t('commentPlaceholder')}
          rows={5}
        />
      </div>
    </WhiteBlock>
  );
};
