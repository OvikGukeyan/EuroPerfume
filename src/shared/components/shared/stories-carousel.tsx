"use client";

import React, { FC, useMemo, useState } from "react";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Product } from "@prisma/client";
import Stories from "react-insta-stories";
import { cn } from "../../lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Props {
  items: Product[];
  className?: string;
}
export const StoriesCarousel: FC<Props> = ({ items, className }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const autoplayPlugin = useMemo(() => Autoplay({ delay: 8000 }), []);
  const router = useRouter();
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
      profileImage: item.imageUrl?.[0] || './assets/logo-mobile.png',
    },
  }));
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
                autoPlay
                preload="auto"
                src={item.videoUrl || ""}
                loop
                muted
                playsInline
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
                <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
                  <Image
                    src={item.imageUrl?.[0] || './assets/logo-mobile.png'}
                    alt={item.name}
                    width={60}
                    height={60}
                    className="w-[50px] h-[50px]"
                  />
                </div>
                <p className="text-sm md:text-xl font-bold">{item.name}</p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          <div className="relative">
            <Stories
              onAllStoriesEnd={() => setIsModalOpen(false)}
              stories={storyItems}
              defaultInterval={5000}
              currentIndex={startIndex}
            />
          </div>
        </div>
      )}
    </div>
  );
};
