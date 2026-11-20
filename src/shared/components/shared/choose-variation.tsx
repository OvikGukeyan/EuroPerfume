"use client";
import React, { FC, useRef } from "react";
import { cn } from "@/src/lib/utils";
import { ProductVariation } from "@prisma/client";
import { Button } from "../ui";
import { ChevronLeft, ChevronRight } from "lucide-react";


type Props = {
  className?: string;
  items: ProductVariation[];
  setActiveVariationId: (variationId: number) => void;
  activeVariationId: number;
};

export const ChooseVariation: FC<Props> = ({
  className,
  items,
  setActiveVariationId,
  activeVariationId,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  // Keep samples ahead of full-size options without changing variant identities.
  const sortedItems = [...items].sort((a, b) => {
    const isTwoMl = (name: string) => /^2\s*ml(?:\b|\s|$)/i.test(name.trim());
    return Number(isTwoMl(b.name)) - Number(isTwoMl(a.name));
  });

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200; // px - сколько прокрутить
      const scrollValue = direction === "left" ? -scrollAmount : scrollAmount;

      scrollContainerRef.current.scrollBy({
        left: scrollValue,
        behavior: "smooth",
      });
    }
  };

  const onChooseVariation = (e: React.MouseEvent, variationId: number) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveVariationId(variationId);
  };

  return (
    <div
      className={cn(
        "w-full relative flex items-center px-0 md:px-5",
        className
      )}
    >
     {items.length > 1 && <button
        className="absolute left-0 hidden md:block"
        onClick={() => scroll("left")}
      >
        <ChevronLeft size={15} />
      </button>}
      <div
        ref={scrollContainerRef}
        style={{ scrollbarWidth: "none" }}
        className="flex gap-3 w-full overflow-x-scroll overflow-y-hidden "
      >
        {sortedItems.map((item) => (
          <Button
            onPointerDown={(e) => onChooseVariation(e, item.id)}
            disabled={activeVariationId === item.id}
            variant={"outline"}
            className=" h-8 rounded-none  disabled:bg-slate-300"
            key={item.id}
          >
            {item.name}
          </Button>
        ))}
      </div>
      { items.length > 1 &&<button
        className="absolute right-0 hidden md:block"
        onClick={() => scroll("right")}
      >
        <ChevronRight size={15} />
      </button>}
    </div>
  );
};
