"use client";

import { cn } from "@/src/shared/lib/utils";
import { MessageCircle } from "lucide-react";
import dynamic from "next/dynamic";
import { FC, useMemo } from "react";

interface Props {
  className?: string;
  value: number;
  withNumber?: boolean;
  reviewsCount?: number;
}

const ReactStarsDynamic = dynamic(() => import("react-stars"), {
  ssr: false,
});

export const Rating: FC<Props> = ({
  className,
  value,
  withNumber,
  reviewsCount,
}) => {
  const ReactStarsMemo = useMemo(() => ReactStarsDynamic, []);

  return (
    <div  className={cn("flex gap-2", className)}>
      <ReactStarsMemo
        count={5}
        value={value}
        size={18}
        color2={"#111111"}
        color1={"#d8d8d8"}
        onChange={() => {}}
      />
      {withNumber && value > 0 && <span>{value}</span>}
      {reviewsCount && reviewsCount > 0 && (
        <div className="flex items-center gap-1">
          ( {reviewsCount} <MessageCircle size={18} /> )
        </div>
      )}
    </div>
  );
};