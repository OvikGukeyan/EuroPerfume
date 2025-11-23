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
        "w-full grid grid-cols-3 gap-2 md:grid-cols-4 lg:grid-cols-5 ",
        className
      )}
    >
      {volumes.map((item, index) => (
        <Button
          onPointerDown={() =>  {setVolume(item)}}
          disabled={volume === item}
          className=" h-8 rounded-none  disabled:bg-slate-300"
          key={item}
          variant={"outline"}
        >
          {item}ml
        </Button>
      ))}
    </div>
  );
};
