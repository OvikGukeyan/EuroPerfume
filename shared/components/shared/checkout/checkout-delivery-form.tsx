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
import { cn } from "@/shared/lib/utils";
import { Controller, useFormContext } from "react-hook-form";
import { deliveryTypes } from "@/prisma/constants";

interface Props {
  totalAmount: number;
  className?: string;
}
export const CheckoutDeliveryForm: FC<Props> = ({ className, totalAmount }) => {
  const { control } = useFormContext();
  return (
    <WhiteBlock
      className={cn(
        className,
        !totalAmount ? "opacity-50 pointer-events-none" : ""
      )}
      title="3. Delivery information"
      contentClassName="p-8"
    >
      <div className="flex flex-col gap-5">
        <Title text="Delivery Type" size="sm" className="font-bold" />

        <div className="flex justify-between">
          <RadioInput items={deliveryTypes} />

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
          placeholder="Description"
          rows={5}
        />
      </div>
    </WhiteBlock>
  );
};
