import React, { FC } from "react";
import { cn } from "@/lib/utils";
import { Product } from "@prisma/client";
import {
  brands,
  classifications,
  concentrations,
  genders,
  notes,
  perfumeAromas,
} from "@/prisma/constants";
import { Title } from ".";

type Props = {
  className?: string;
  charactiristics: {
    name: string;
    value: string;
  }[];
};

export const ProductCharacteristics: FC<Props> = ({
  className,
  charactiristics,
}) => {
  return (
    <div className={cn("", className)}>
      <Title text="Characteristics:" size="sm" className="font-bold" />

      <div className="flex justify-between  my-4">
        <ul className=" columns-2 gap-x-5">
          {charactiristics.map((characteristic) => (
            <li key={characteristic.name} className="break-inside-avoid">
              <span className="font-bold mr-2">{characteristic.name}: </span>
              {characteristic.value}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
