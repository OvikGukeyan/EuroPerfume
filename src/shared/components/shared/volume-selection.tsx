"use client";
import React, { FC } from "react";
import { cn } from "@/src/lib/utils";
import { Button } from "../ui";
import { Volume } from "@/src/shared/constants/perfume";

type Props = {
  className?: string;
  setVolume: React.Dispatch<React.SetStateAction<Volume>>;
  volume: React.SetStateAction<Volume>;
  volumes: Volume[]
};

export const VolumeSelection: FC<Props> = ({
  className,
  volume,
  setVolume,
  volumes
}) => {

  
  return (
    <div
      className={cn(
        "w-full grid grid-cols-3 gap-2 xl:grid-cols-6 ",
        className
      )}
    >
      {volumes.map((item, index) => (
        <Button
          type="button" onClick={() => setVolume(item)}
          aria-pressed={volume === item}
          className={cn("min-h-10 rounded-lg px-1",volume===item && "bg-neutral-900 text-white hover:bg-neutral-800")}
          key={item}
          variant={"outline"}
        >
          {item} ml
        </Button>
      ))}
    </div>
  );
};
