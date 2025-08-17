"use client";
import React, { FC } from "react";
import { Title } from ".";
import { Button } from "..";
import { Trash2 } from "lucide-react";
import { Slide, SlideImage } from "@prisma/client";
import Image from "next/image";
import { deleteSlide } from "@/src/app/actions";
import { cn } from "@/src/lib/utils";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

type Props = {
  className?: string;
  slide: Slide & {images: SlideImage[]};
};

export const DeshboardSlide: FC<Props> = ({ className, slide }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: slide.id.toString(),
    });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const onClickDelete = async () => {
    deleteSlide(slide.id);
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "flex items-center justify-between gap-4 bg-white shadow p-4 rounded cursor-move",
        className
      )}
    >
      <Image width={300} height={300} src={slide.images[0].desctopImg} alt={slide.name} />

      <Title text={slide.name} size="lg" className="font-bold" />

      <Button
        onClick={onClickDelete}
        onPointerDown={(e) => e.stopPropagation()} 
      >
        <Trash2 size={20} />
      </Button>
    </div>
  );
};
