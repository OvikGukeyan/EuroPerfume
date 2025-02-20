"use client";
import React, { FC } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui";
import { Volume, volumes } from "@/shared/constants/perfume";

type Props = {
  className?: string;
  setVolume: React.Dispatch<React.SetStateAction<Volume>>;
  volume: number;
};

export const VolumeSelection: FC<Props> = ({ className, volume, setVolume }) => {
  return (
    <div className={cn("w-full flex justify-between  items-center gap-1 flex-wrap", className)}>
      {volumes.map((item, index) => (
        <Button
          onClick={() => setVolume(item)}
          disabled={volume === item}
          className="w-10 h-10 rounded-md disabled:bg-slate-300"
          key={item}
          variant={"outline"}
        >
          {item}ml
        </Button>
      ))}
    </div>
  );
};
