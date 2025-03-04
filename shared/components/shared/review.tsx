"use client";

import React, { FC } from "react";
import { cn } from "@/lib/utils";
import { Title } from ".";
import ReactStars from "react-stars";
import { Separator } from "../ui";

type Props = {
  className?: string;
};

export const Review: FC<Props> = ({ className }) => {
  return (
    <div className={cn("", className)}>
      <div className="flex items-center justify-between mb-5">
        <Title text="Vitaliy Sayan" size="xs" className="font-bold" />
        <ReactStars
          count={5}
          value={3.5}
          size={18}
          color2={"#111111"}
          color1={"#d8d8d8"}
        //   onChange={(newRating: any) => newRating}
        />
      </div>
      <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ex consequuntur non, iusto unde ducimus impedit vel reprehenderit iure minus nostrum veniam obcaecati quis, quaerat pariatur asperiores dolor. Natus, veritatis itaque.</p>
      <Separator className="my-5" />
    </div>
  );
};
