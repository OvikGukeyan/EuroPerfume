'use client';
import React, { FC } from "react";
import { cn } from "@/lib/utils";
import { Title } from ".";
import { Button } from "..";
import { Trash2 } from "lucide-react";
import { Slide } from "@prisma/client";
import { deleteSlide } from "@/app/actions";

type Props = {
  className?: string;
  slide: Slide;
};

export const DeshboardSlide: FC<Props> = ({ className, slide }) => {
  return (
    <div className={cn("flex flex-col items-center gap-y-3", className)}>
      <Title text={slide.name} size="lg" className="font-bold" />
      <img src={slide.desctopImg} alt={slide.name} />

      <Button  onClick={() => deleteSlide(slide.id)}>
        <Trash2 size={20} />
      </Button>
    </div>
  );
};
