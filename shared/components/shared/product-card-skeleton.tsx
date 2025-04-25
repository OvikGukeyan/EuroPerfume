import React, { FC } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "..";

type Props = {
  className?: string;
};

export const ProductCardSkeleton: FC<Props> = ({ className }) => {
  return (
    <div className={cn("flex flex-col space-y-3 max-w-[400px]", className)}>
      <Skeleton className=" w-full  aspect-[4/5] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-20 w-full" />

        <div className="flex justify-between h-11">
        <Skeleton className="h-full w-[100px]" />
        <Skeleton className="h-full w-[100px]" />

        </div>
      </div>
    </div>
  );
};
