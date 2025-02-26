import { cn } from "@/lib/utils";
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
  items: { name: string; value: string }[];
  name: keyof CreateProductFormValues;
}
export const FormSelect: FC<Props> = ({ control, items, name }) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem className="mb-5">
          <FormLabel>{`Select a ${name}`}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value as string }>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={`Select a ${name}`} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {items.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
};
