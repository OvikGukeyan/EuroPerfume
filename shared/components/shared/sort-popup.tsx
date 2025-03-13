"use client";
import { cn } from "@/shared/lib/utils";
import { ArrowUpDown } from "lucide-react";
import React, { FC } from "react";
import { Select } from "..";
import { SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { useFiltersStore } from "@/shared/store/filters";

interface Props {
  className?: string;
}
export const SortPopup: FC<Props> = ({ className }) => {
  const [setOrderBy, orderBy] = useFiltersStore((state) => [
    state.setOrderBy,
    state.orderBy,
  ]);

  return (
    <div className={cn("", className)}>
      <Select onValueChange={(value) => setOrderBy(value)}>
        <SelectTrigger className="inline-flex items-center gap-1 bg-gray-50 px-5 h-[52px] rounded-2xl cursor-pointer">
          <ArrowUpDown size={16} />
          <b>Sort:</b>
          <b className="text-primary"> 
            {`${Object.keys(orderBy)[0]} ${orderBy[Object.keys(orderBy)[0]]}`}
           
          </b>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={"nameAsc"}>Name: a - z</SelectItem>
          <SelectItem value={"nameDesc"}>Name: z - a</SelectItem>
          <SelectItem value={"priceAsc"}>Price: low to high</SelectItem>
          <SelectItem value={"priceDesc"}>Price: high to low</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
