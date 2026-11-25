"use client";
import { cn } from "@/src/shared/lib/utils";
import { ArrowUpDown } from "lucide-react";
import React, { FC } from "react";
import { Select } from "..";
import { SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { useFiltersStore } from "@/src/shared/store/filters";
import { useLocale } from "next-intl";

interface Props {
  className?: string;
}
export const SortPopup: FC<Props> = ({ className }) => {
  const [setOrderBy, orderBy, brands,productGroup] = useFiltersStore((state) => [
    state.setOrderBy,
    state.orderBy,
    state.brands,
    state.productGroup,
  ]);
  const hasBrand=brands.size>0;
  const currentValue=orderBy.price?(orderBy.price==="desc"?"priceDesc":"priceAsc"):orderBy.name?(orderBy.name==="desc"?"nameDesc":"nameAsc"):hasBrand?"brandDefault":"nameAsc";
  const sortItems = [
    ...(hasBrand?[{name:{de:productGroup===31?"Neu hinzugefügt":"Abfüllungen zuerst",ru:productGroup===31?"Последние добавленные":"Сначала отливанты"},value:"brandDefault"}]:[]),
    {
      name: {
        de: "Name: a - z",
        ru: "Имя: a - я",
      },
      value: "nameAsc",
    },
    {
      name: {
        de: "Name: z - a",
        ru: "Имя: я - a",
      },
      value: "nameDesc",
    },
    {
      name: {
        de: "Preis: aufsteigend",
        ru: "Цена: низкая - высокая",
      },
      value: "priceAsc",
    },
    {
      name: {
        de: "Preis: absteigend",
        ru: "Цена: высокая - низкая",
      },
      value: "priceDesc",
    },
  ];

  const locale = useLocale() as "ru" | "de";
  const onChange = (value: string) => {

    setOrderBy(value)
  };
  return (
    <div className={cn("", className)}>
      <Select value={currentValue} onValueChange={(value) => onChange(value)}>
        <SelectTrigger className="inline-flex items-center gap-1 bg-gray-50 px-3 h-[48px] rounded-md cursor-pointer">
          <ArrowUpDown size={16} />
          <b className="text-primary">
            {sortItems.find((item) => item.value === currentValue)?.name[locale]}
          </b>
        </SelectTrigger>
        <SelectContent>
          {sortItems.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.name[locale]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
