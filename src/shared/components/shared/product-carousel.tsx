"use client";
import React, { useState, useEffect, useCallback } from "react";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { cn } from "@/src/lib/utils";

type PropType = {
  slides: string[];
  options?: EmblaOptionsType;
  className?: string;
};

export const ProductCarousel: React.FC<PropType> = ({
  className,
  options,
  slides,
}) => {
  // const SLIDE_COUNT = 10;
  // const slides = Array.from(Array(SLIDE_COUNT).keys());
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(options || {});
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi) return;
      emblaMainApi.scrollTo(index);
    },
    [emblaMainApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return;
    const index = emblaMainApi.selectedScrollSnap();
    setSelectedIndex(index);
    emblaThumbsApi.scrollTo(index);
  }, [emblaMainApi, emblaThumbsApi]);

  useEffect(() => {
    if (!emblaMainApi) return;
    onSelect();
    emblaMainApi.on("select", onSelect).on("reInit", onSelect);
  }, [emblaMainApi, onSelect]);

  return (
    <div className={cn("flex flex-col gap-4 w-full min-h-400", className)}>
      <div
        className="relative w-full max-w-md overflow-hidden"
        ref={emblaMainRef}
      >
        <div className="flex transition-transform duration-0 w-full">
          {slides.map((imageUrl, index) => (
            <div
              key={index}
              className="flex items-center justify-center  flex-shrink-0 aspect-square w-full  bg-white "
            >
              <img src={imageUrl} alt={""} />
            </div>
          ))}
        </div>
      </div>

      <div className="relative w-full max-w-sm overflow-hidden">
        <div
          style={{ scrollbarWidth: "none" }}
          className="overflow-x-auto"
          ref={emblaThumbsRef}
        >
          <div className="flex gap-2">
            {slides.map((imageUrl, index) => (
              <div key={index} className="flex-shrink-0">
                <button
                  onClick={() => onThumbClick(index)}
                  type="button"
                  className={`flex items-center justify-center w-16 h-16 border  ${
                    index === selectedIndex
                      ? "border-gray-500"
                      : "border-gray-300"
                  }`}
                >
                  <Image width={64} height={64} src={imageUrl} alt={""} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
