"use client";

import React, { FC } from "react";
import { cn } from "@/src/lib/utils";
import { Title } from ".";
import { Separator } from "../ui";
import { Rating } from "./rating";

type Props = {
  className?: string;
  text: string;
  userName: string;
  rating: number;
  createdAt: Date
};

export const ReviewComponent: FC<Props> = ({ className, text, userName, rating, createdAt }) => {
  return (
    <div className={cn("", className)}>
      <div className="flex items-center justify-between mb-5">
        <Title text={userName} size="xs" className="font-bold mb-5" />
        <Rating value={rating} withNumber/>
      </div>
      <p> {text}</p>
      <p className="text-sm text-neutral-500 tracking-widest mt-4">{createdAt.toLocaleDateString()}</p>

      <Separator className="mb-5" />
    </div>
  );
};
