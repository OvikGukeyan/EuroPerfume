import React, { FC } from "react";
import { FormControl, FormField, FormItem, FormLabel } from "../../ui/form";
import { Select } from "../..";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Control } from "react-hook-form";
import { CreateProductFormValues } from "@/shared/constants/create-product-schema";

interface Props {
  control: Control<CreateProductFormValues>;
  items:
    | { name: string; value: string }[]
    | { label: { ru: string; de: string }; value: string }[]
    | { name: string; id: number }[];

  name: keyof CreateProductFormValues;
}
export const FormSelect: FC<Props> = ({ control, items, name }) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <FormItem className="mb-5">
            <FormLabel>{`Select a ${name}`}</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value ? field.value.toString() : ""}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={`Select a ${name}`} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {items.map((item) => {
                  if ("name" in item) {
                    if ("id" in item) {
                      return (
                        <SelectItem key={item.id} value={item.id.toString()}>
                          {item.name}
                        </SelectItem>
                      );
                    }
                    return (
                      <SelectItem key={item.value} value={item.value}>
                        {item.name}
                      </SelectItem>
                    );
                  } else {
                    return (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label.ru}
                      </SelectItem>
                    );
                  }
                })}
              </SelectContent>
            </Select>
          </FormItem>
        );
      }}
    />
  );
};
