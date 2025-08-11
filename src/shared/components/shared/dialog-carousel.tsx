import React, { FC } from "react";
import { Dialog } from "..";
import { DialogContent, DialogTrigger } from "../ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import Image from "next/image";
type Props = {
  className?: string;
  images: string[];
};

export const DialogCarousel: FC<Props> = ({ className, images }) => {
  return (
    <Dialog>
        {images.map((image, index) => (
          <DialogTrigger key={index} asChild>
            <div className="w-[60px] h-[60px] overflow-hidden">
              <Image src={image} alt="product" width={60} height={60} />
            </div>
          </DialogTrigger>
        ))}
     
      <DialogContent className="max-w-[500px]">
        <Carousel className="w-full ">
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="w-full aspect-[4/5] relative flex justify-center items-center">
                  <Image src={image} alt="product" fill />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent >
          <CarouselPrevious className="left-0 md:-left-20 md:text-white"/>
          <CarouselNext className="right-0 md:-right-20 md:text-white"/>
        </Carousel>
      </DialogContent>
    </Dialog>
  );
};
