"use client";
import React, { useState, useEffect, useCallback } from "react";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { cn } from "@/src/lib/utils";
import { MediaItem } from "./choose-product-form";
import { PlayCircle } from "lucide-react";

type PropType = {
  slides: MediaItem[];
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
    <div
      className={cn(
        "flex flex-col items-center gap-4 w-full min-h-400",
        className
      )}
    >
      <div
        className="relative w-full max-w-md overflow-hidden"
        ref={emblaMainRef}
      >
        <div className="flex transition-transform duration-0 w-full">
          {slides.map((slide, index) => (
            <div
              key={index}
              className="flex items-center justify-center  flex-shrink-0 aspect-square w-full  bg-white "
            >
              {slide.type === "video" ? (
                <video
                  key={index}
                  src={slide.url}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-auto"
                />
              ) : (
                <img src={slide.url} alt={"image"} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="relative w-full max-w-sm overflow-hidden">
        <div
          style={{ scrollbarWidth: "none" }}
          className="overflow-x-auto overflow-y-hidden"
          ref={emblaThumbsRef}
        >
          <div className="flex gap-2 overflow-y-hidden">
            {slides.map((slide, index) => (
              <div key={index} className="flex-shrink-0">
                <button
                  onClick={() => onThumbClick(index)}
                  type="button"
                  className={`flex items-center justify-center w-16 h-16 border overflow-hidden  ${
                    index === selectedIndex
                      ? "border-gray-500"
                      : "border-gray-300"
                  }`}
                >
                  {slide.type === "video" ? (
                   <PlayCircle size={32} />
                  ) : (
                    <Image width={64} height={64} src={slide.url} alt={""} />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
