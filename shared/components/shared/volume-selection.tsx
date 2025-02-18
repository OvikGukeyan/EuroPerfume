"use client";
import React, { FC } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui";

type Props = {
  className?: string;
};

export const VolumeSelection: FC<Props> = ({ className }) => {
  const [volume, setVolume] = React.useState(1);
  return (
    <div className={cn("w-full flex items-center gap-2", className)}>
      {[...Array(6)].map((_, index) => (
        <Button
          onClick={() => setVolume(index + 1)}
          disabled={volume === index + 1}
          className="w-10 h-10 rounded-md disabled:bg-slate-300"
          key={index}
          variant={"outline"}
        >
          {index + 1}ml
        </Button>
      ))}
    </div>
  );
};
