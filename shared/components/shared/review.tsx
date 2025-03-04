"use client";

import React, { FC } from "react";
import { cn } from "@/lib/utils";
import { Title } from ".";
import ReactStars from "react-stars";
import { Separator } from "../ui";
import { Rating } from "./rating";

type Props = {
  className?: string;
  text: string;
  userName: string;
  rating: number;
};

export const ReviewComponent: FC<Props> = ({ className, text, userName, rating }) => {
  return (
    <div className={cn("", className)}>
      <div className="flex items-center justify-between mb-5">
        <Title text={userName} size="xs" className="font-bold mb-5" />
        <Rating value={rating} withNumber/>
      </div>
      <p> {text}</p>
      <Separator className="my-5" />
    </div>
  );
};
