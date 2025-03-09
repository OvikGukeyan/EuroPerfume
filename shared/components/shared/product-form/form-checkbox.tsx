import { CreateProductFormValues } from "@/shared/constants/create-product-schema";
import React, { FC } from "react";
import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Checkbox } from "../..";
import { Notes, Types } from "@prisma/client";

interface Props {
  control: Control<CreateProductFormValues>;
  items: { name: string; value: string }[];
  name: keyof CreateProductFormValues;
}

export const FormCheckbox: FC<Props> = ({ control, name, items }) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => {
        const currentValues: (Notes | Types)[] = Array.isArray(field.value)
          ? field.value
          : [];
        return (
          <FormItem className="mb-5">
            <div className="mb-4">
              <FormLabel className="text-base">{`Select ${name}`}</FormLabel>
            </div>
            {items.map((item) => (
              <div
                key={item.name}
                className="flex flex-row items-start space-x-3 space-y-0"
              >
                <FormControl>
                  <Checkbox
                    checked={currentValues.includes(
                      item.value as Notes | Types
                    )}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        field.onChange([...currentValues, item.value]);
                      } else {
                        field.onChange(
                          currentValues.filter((value) => value !== item.value)
                        );
                      }
                    }}
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal">
                  {item.name}
                </FormLabel>
              </div>
            ))}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
