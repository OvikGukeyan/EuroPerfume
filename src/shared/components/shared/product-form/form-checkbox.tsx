"use client";
import { CreateProductFormValues } from "@/src/shared/constants/create-product-schema";
import React, { FC, useState } from "react";
import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Checkbox } from "../..";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { ChevronDown } from "lucide-react";

interface Props {
  control: Control<CreateProductFormValues>;
  items: { labelRu: string; labelDe: string; id: string }[];
  name: keyof CreateProductFormValues;
  title: string;
}

export const FormCheckbox: FC<Props> = ({ control, name, items, title }) => {
  const [searchValue, setSearchValue] = useState("");
  const onChangeSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const list = items.filter((item) =>
    item.labelRu.toLowerCase().includes(searchValue.toLowerCase())
  );
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => {
        const currentValues =
          Array.isArray(field.value) &&
          field.value.every((value) => typeof value === "string")
            ? field.value
            : [];
        return (
          <FormItem className="mb-5 flex gap-2 items-center">
            <Popover>
              <PopoverTrigger className="border py-2 px-3 w-full rounded-sm flex justify-between items-center">
                <FormLabel className="text-base">{title}</FormLabel>
                <ChevronDown size={15} />
              </PopoverTrigger>
              <PopoverContent className="h-[300px] overflow-y-scroll scrollbar">
                <div className="mb-5">
                  <input
                    value={searchValue}
                    onChange={(e) => onChangeSearchInput(e)}
                    className="bg-gray-50 border-none pl-2 focus:outline-none"
                  />
                </div>
                {list.map((item) => (
                  <div
                    key={item.labelRu + name}
                    className="flex flex-row items-start space-x-3 space-y-0"
                  >
                    <FormControl>
                      <Checkbox
                        checked={currentValues.includes(
                          item.id
                        )}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            field.onChange([...currentValues, item.id]);
                          } else {
                            field.onChange(
                              currentValues.filter(
                                (value) => value !== item.id
                              )
                            );
                          }
                        }}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">
                      {item.labelRu}
                    </FormLabel>
                  </div>
                ))}
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
