"use client";

import React, { FC, useEffect, useMemo, useState } from "react";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Product } from "@prisma/client";
import Stories from "react-insta-stories";
import { cn } from "../../lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

interface Props {
  items: Product[];
  className?: string;
}
export const StoriesCarousel: FC<Props> = ({ items, className }) => {
  const [touchStartY, setTouchStartY] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const threshold = 100;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const autoplayPlugin = useMemo(() => Autoplay({ delay: 8000 }), []);
  const router = useRouter();

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const deltaY = e.touches[0].clientY - touchStartY;
    if (deltaY > 0) {
      setTranslateY(deltaY);
    }
  };

  const handleTouchEnd = () => {
    if (translateY > threshold) {
      setIsModalOpen(false);
      setTranslateY(0);
    } else {
      setTranslateY(0);
    }
  };

  const openStory = (index: number) => {
    setStartIndex(index);
    setIsModalOpen(true);
  };

  const storyItems = items.map((item) => ({
    url: item.videoUrl || "", // гарантированно string
    type: "video",
    header: {
      heading: item.name,
      subheading: "Новинка",
      profileImage: item.imageUrl?.[0] || "/assets/logo-mobile.png",
    },
    seeMore: () => null,
    seeMoreCollapsed: () => (
      <button
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/product/${item.id}`);
        }}
        onTouchStart={(e) => {
          e.stopPropagation();
          router.push(`/product/${item.id}`);
        }}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 z-50 bg-white/10 text-white text-sm font-semibold px-4 py-2 rounded-md backdrop-blur hover:bg-white/20 transition"
      >
        Product
      </button>
    ),
  }));

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);
  return (
    <div className={cn("w-full", className)}>
      <Carousel
        className="w-full px-5"
        plugins={[autoplayPlugin]}
        opts={{ align: "start" }}
      >
        <CarouselContent>
          {items.map((item, index) => (
            <CarouselItem
              key={index}
              className="w-full basis-1/2 md:basis-1/4 relative"
              onClick={() => openStory(index)}
            >
              <video
                muted
                playsInline
                autoPlay
                preload="auto"
                src={item.videoUrl || ""}
                loop
                onTouchStart={(e) => e.currentTarget.play()}
                onTouchEnd={(e) => {
                  e.currentTarget.pause();
                  e.currentTarget.currentTime = 0;
                }}
                onMouseEnter={(e) => e.currentTarget.play()}
                onMouseLeave={(e) => {
                  e.currentTarget.pause();
                  e.currentTarget.currentTime = 0;
                }}
                className="w-full h-full object-cover"
              />
              <div
                className="absolute top-0 left-2 text-white p-5 flex gap-2 items-center cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/product/${item.id}`);
                }}
              >
                <div className="w-[35px] h-[35px] md:w-[50px] md:h-[50px] rounded-full overflow-hidden shrink-0">
                  <Image
                    src={item.imageUrl?.[0] || "/assets/logo-mobile.png"}
                    alt={item.name}
                    width={50}
                    height={50}
                    className="w-[35px] h-[35px] md:w-[50px] md:h-[50px] object-cover"
                  />
                </div>
                <p className="text-xs md:text-xl font-bold">{item.name}</p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {isModalOpen && (
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 transition-transform duration-300 ease-out"
          style={{ transform: `translateY(${translateY}px)` }}
        >
          <div className="relative w-full h-full md:w-auto md:max-w-[450px] md:h-[90vh] bg-black">
            <button
              className="absolute -top-0 -right-10 z-30 "
              onClick={() => setIsModalOpen(false)}
            >
              <X color="white" />
            </button>
            <Stories
              onAllStoriesEnd={() => setIsModalOpen(false)}
              stories={storyItems}
              defaultInterval={5000}
              currentIndex={startIndex}
              width="100%"
              height="100%"
            />
          </div>
        </div>
      )}
    </div>
  );
};
