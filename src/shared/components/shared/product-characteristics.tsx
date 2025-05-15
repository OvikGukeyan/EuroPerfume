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
        <ul className=" md:columns-2 ">
          {charactiristics.map((characteristic, index) => (
            <li
              key={characteristic.name}
              className={`break-inside-avoid flex justify-between  px-2 py-1   ${
                index % 2 === 0 ? "bg-white" : "bg-gray-100"
              }`}
            >
              <span className="font-bold mr-2 w-1/2">
                {characteristic.name}:{" "}
              </span>
              <div className=" w-1/2 text-left">{characteristic.value}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
