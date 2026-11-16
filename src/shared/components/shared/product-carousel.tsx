"use client";
import React, { useState, useEffect, useCallback } from "react";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/src/lib/utils";
import type { MediaItem } from "./choose-product-form";
import { PlayCircle } from "lucide-react";

type PropType = {
  slides: MediaItem[];
  options?: EmblaOptionsType;
  setActiveVariationId?: React.Dispatch<React.SetStateAction<number>>;
  activeVariationId?: number;
  className?: string;
  alt?: string;
};

export const ProductCarousel: React.FC<PropType> = ({
  className, options, setActiveVariationId, slides, activeVariationId, alt = "",
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [viewportRef, api] = useEmblaCarousel({ ...options, containScroll: "trimSnaps" });
  const onSelect = useCallback(() => {
    if (!api) return;
    const index = api.selectedScrollSnap();
    setSelectedIndex(index);
    const variationId = slides[index]?.id;
    if (variationId !== undefined) setActiveVariationId?.(variationId);
  }, [api, slides, setActiveVariationId]);

  useEffect(() => {
    if (!api) return;
    onSelect();
    api.on("select", onSelect).on("reInit", onSelect);
    return () => { api.off("select", onSelect).off("reInit", onSelect); };
  }, [api, onSelect]);

  useEffect(() => {
    if (!api || activeVariationId === undefined) return;
    const index = slides.findIndex(slide => slide.id === activeVariationId);
    if (index >= 0) api.scrollTo(index);
  }, [api, activeVariationId, slides]);

  if (!slides.length) return null;
  return <div className={cn("product-gallery-carousel", className)}
    style={{ display: "grid", gridTemplateRows: slides.length > 1 ? "minmax(0, 1fr) auto" : "minmax(0, 1fr)", width: "100%", height: "100%", minWidth: 0, minHeight: 0, background: "#f4f4f2" }}>
    <div ref={viewportRef} style={{ overflow: "hidden", minHeight: 0, minWidth: 0 }}>
      <div style={{ display: "flex", height: "100%", touchAction: "pan-y pinch-zoom" }}>
        {slides.map((slide, index) => <div key={slide.url + index} className="product-media-slide"
          style={{ position: "relative", flex: "0 0 100%", minWidth: 0, height: "100%", overflow: "hidden", background: "#f4f4f2" }}>
          {slide.type === "video" ? <video src={slide.url} preload="none" controls playsInline
            style={{ display: "block", width: "100%", height: "100%", objectFit: "contain", padding: 24, boxSizing: "border-box" }} /> :
            <img src={slide.url} alt={alt} decoding="async"
              style={{ display: "block", width: "100%", height: "100%", maxHeight: "100%", objectFit: "contain", padding: 24, boxSizing: "border-box", mixBlendMode: "multiply" }} />}
        </div>)}
      </div>
    </div>
    {slides.length > 1 && <div aria-label="Media" style={{ display: "flex", gap: 8, overflowX: "auto", padding: "8px 12px 12px", minWidth: 0 }}>
      {slides.map((slide, index) => <button key={slide.url + index} type="button"
        aria-label={slide.type === "video" ? "Video" : alt + " · " + (index + 1)}
        aria-pressed={index === selectedIndex} onClick={() => api?.scrollTo(index)}
        style={{ flex: "0 0 44px", width: 44, height: 44, overflow: "hidden", border: index === selectedIndex ? "1px solid #333" : "1px solid #d4d4d4", borderRadius: 4, padding: 3 }}>
        {slide.type === "video" ? <PlayCircle size={28} /> : <img src={slide.url} alt="" style={{ display: "block", width: "100%", height: "100%", objectFit: "contain", mixBlendMode: "multiply" }} />}
      </button>)}
    </div>}
  </div>;
};
