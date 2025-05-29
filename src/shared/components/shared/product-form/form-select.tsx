import React, { FC } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Select } from "../..";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Control } from "react-hook-form";
import { CreateProductFormValues } from "@/src/shared/constants/create-product-schema";

interface Props {
  control: Control<CreateProductFormValues>;
  items: { name: string; value: string }[];
  name: keyof CreateProductFormValues;
}
export const FormSelect: FC<Props> = ({ control, items, name }) => {
  const [searchValue, setSearchValue] = React.useState("");
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
                <input
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full bg-gray-50 h-8 border pl-2 focus:outline-none my-2 rounded-md"
                />
                {items
                  .filter((item) =>
                    item.name.toLowerCase().includes(searchValue.toLowerCase())
                  )
                  .map((item) => {
                    return (
                      <SelectItem key={item.value} value={item.value}>
                        {item.name}
                      </SelectItem>
                    );
                  })}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
