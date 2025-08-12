"use client";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Slide, SlideImage } from "@prisma/client";
import React, { FC, useState } from "react";
import { DeshboardSlide } from ".";
import { reorderSlides } from "../../services/slides";

type Props = {
  slides: (Slide & { images: SlideImage[] })[];
  className?: string;
};
export const DragAndDrop: FC<Props> = ({ slides, className }) => {
  const [items, setItems] = useState(slides.map((s) => s.id.toString()));

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = async (event: any) => {
    try {
      const { active, over } = event;
      if (active.id !== over.id) {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        const newOrder = arrayMove(items, oldIndex, newIndex);
        setItems(newOrder);

        const sortedSlides = newOrder.map(
          (id) => slides.find((s) => s.id.toString() === id)!
        );
        await reorderSlides(sortedSlides);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-4">
          {items.map((id) => {
            const slide = slides.find((s) => s.id.toString() === id)!;
            return <DeshboardSlide key={slide.id} slide={slide} />;
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
};
