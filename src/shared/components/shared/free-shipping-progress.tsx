import React, { FC } from "react";
import { cn } from "@/src/lib/utils";
import { Progress } from "..";

type Props = {
  className?: string;
  totalAmount: number;
};

export const FreeShippingProgress: FC<Props> = ({ className, totalAmount }) => {
  const freeShippingAmount = 100;
  const isFreeShipping = totalAmount >= freeShippingAmount;
  const currentProgress = (totalAmount * 100) / freeShippingAmount;
  return (
    <div className={cn("w-full p-7 flex flex-col gap-2 items-center", className)}>
        <div>
            {isFreeShipping && <span className="text-green-500">Free shipping</span>}
            {!isFreeShipping && <span className="text-red-500">You are {freeShippingAmount - totalAmount} € away from free shipping</span>}
        </div>
        { !isFreeShipping &&
            <Progress value={currentProgress} className="w-[80%]" />
        }
      
    </div>
  );
};
