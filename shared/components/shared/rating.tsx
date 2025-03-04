"use client";
import { cn } from "@/lib/utils";
import { MessageCircle } from "lucide-react";
import { Span } from "next/dist/trace";
import dynamic from "next/dynamic";
import { FC } from "react";

interface Props {
  className?: string;
  value: number;
  withNumber?: boolean;
  reviewsCount?: number;
}
export const Rating: FC<Props> = ({
  className,
  value,
  withNumber,
  reviewsCount,
}) => {

  const ReactStars = dynamic(() => import("react-stars"), {
    ssr: false,
  })
  return (
    <div className={cn("flex gap-2", className)}>
      <ReactStars
        count={5}
        value={value}
        size={18}
        color2={"#111111"}
        color1={"#d8d8d8"}
        onChange={(newRating: any) => newRating}
      />
      {withNumber && value > 0 && <span>{value}</span>}

      {reviewsCount && reviewsCount > 0 ? (
        <div className="flex items-center gap-1">
          ( {reviewsCount} <MessageCircle size={18} /> )
        </div>
      ) : null}
    </div>
  );
};
