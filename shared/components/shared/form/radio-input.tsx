"use client";
import React, { FC } from "react";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { DeliveryTypesType } from "@/prisma/constants";
import { Label } from "../../ui/label";
import { Controller, useFormContext } from "react-hook-form";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  items: DeliveryTypesType;
}

export const RadioInput: FC<Props> = ({ className, items }) => {
  const { control } = useFormContext();

  return (
    <>
      <Controller
        control={control}
        name="deliveryType"
        render={({ field, fieldState: { error } }) => (
          <RadioGroup
            className={cn("flex flex-col md:flex-row gap-3 ", className)}
            defaultValue={field.value}
            onValueChange={field.onChange}
          >
            {items.map((item) => (
              <div className="flex items-center gap-2" key={item.value}>
                <RadioGroupItem value={item.value} id={item.value}>
                  {item.name}
                </RadioGroupItem>
                <Label htmlFor={item.value}>{item.name}</Label>
              </div>
            ))}
          </RadioGroup>
        )}
      />
    </>
  );
};
