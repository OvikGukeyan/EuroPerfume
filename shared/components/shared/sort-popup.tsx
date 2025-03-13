"use client";
import { cn } from "@/shared/lib/utils";
import { ArrowUpDown } from "lucide-react";
import React, { FC } from "react";
import { Select } from "..";
import { SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { useFiltersStore } from "@/shared/store/filters";
import { set } from "react-hook-form";

interface Props {
  className?: string;
}
export const SortPopup: FC<Props> = ({ className }) => {
  const [setOrderBy, orderBy] = useFiltersStore((state) => [
    state.setOrderBy,
    state.orderBy,
  ]);
  const [currentValue, setCurrentValue] = React.useState("nameAsc");
  const sortItems = [
    {
      name: "Name: a - z",
      value: "nameAsc",
    },
    {
      name: "Name: z - a",
      value: "nameDesc",
    },
    {
      name: "Price: low to high",
      value: "priceAsc",
    },
    {
      name: "Price: high to low",
      value: "priceDesc",
    },
  ];
  const onChange = (value: string) => {
    setOrderBy(value)
    setCurrentValue(value)
  };
  return (
    <div className={cn("", className)}>
      <Select onValueChange={(value) => onChange(value)}>
        <SelectTrigger className="inline-flex items-center gap-1 bg-gray-50 px-5 h-[52px] rounded-2xl cursor-pointer">
          <ArrowUpDown size={16} />
          <b>Sort:</b>
          <b className="text-primary">
            {sortItems.find((item) => item.value === currentValue)?.name}
          </b>
        </SelectTrigger>
        <SelectContent>
          {sortItems.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
