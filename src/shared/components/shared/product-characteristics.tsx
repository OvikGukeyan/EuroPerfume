import React, { FC } from "react";
import { cn } from "@/src/lib/utils";
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
    <div className={cn("w-full", className)}>
      <Title text="Characteristics:" size="sm" className="font-bold" />

      <div className="my-4">
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
