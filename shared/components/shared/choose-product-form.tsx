"use client";

import { cn } from "@/shared/lib/utils";
import React, { FC, useEffect, useState } from "react";
import { Button, Separator } from "../ui";
import Image from "next/image";
import { Title, Text, VolumeSelection, ProductCharacteristics } from ".";
import { Volume, volumes } from "@/shared/constants/perfume";
import { Product, ProductVariation, Review } from "@prisma/client";
import {
  calcAverageRating,
  calcPrice,
  createCharacteristicsArray,
  useModalContext,
} from "@/shared/lib";
import { Rating } from "./rating";
import { useRouter } from "next/navigation";

interface Props {
  product: Product & {
    reviews: Review[];
    variations: ProductVariation[];
  };
  loading: boolean;
  onSubmit?: (productId: number, volume: Volume) => Promise<void>;
  className?: string;
}
export const ChooseProductForm: FC<Props> = ({
  product,
  loading,
  onSubmit,
  className,
}) => {
  const currentVolumesArray =
  product.price < 8 ? volumes.slice(1) : (volumes as unknown as Volume[]);
  const [volume, setVolume] = useState<Volume>(currentVolumesArray[0]);

  const finalPrice = calcPrice(volume, product.price);
  const { averageRating, count } = calcAverageRating(product.reviews);
  const router = useRouter();
  const { isModal } = useModalContext();

  useEffect(() => {
    if (!isModal) {
      scrollToReviews();
    }
  }, [isModal]);
  const scrollToReviews = () => {
    const reviewsSection = document.getElementById("reviews");
    if (reviewsSection) {
      reviewsSection.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/product/${product.id}#reviews`);
    }
  };
  const charactiristics = createCharacteristicsArray(product);
  return (
    <div className={cn("flex flex-col lg:flex-row flex-1", className)}>
      <div className="flex  items-center justify-center flex-1 relative w-full lg:w-2/5 bg-[#f2f2f2]">
        <Image
          width={350}
          height={350}
          src={product.imageUrl || product.variations[0].imageUrl}
          alt="product"
          className="z-10 duration-300 w-[350px] h-[350px] "
        />
      </div>

      <div className="w-full lg:w-3/5  bg-[#f2f2f2] p-7">
        <Title text={product.name} size="md" className="font-extrabold mb-2" />

        <Separator />

        <Text size="md" className="my-4">
          {product.description}
        </Text>

        <ProductCharacteristics charactiristics={charactiristics} />

        {!isModal ? (
          <div onClick={scrollToReviews} className="cursor-pointer">
            <Rating
              className="mb-5"
              value={averageRating}
              withNumber
              reviewsCount={count}
            />
          </div>
        ) : (
          <a href={`/product/${product.id}`}>
            <Rating
              className="mt-5"
              value={averageRating}
              withNumber
              reviewsCount={count}
            />
          </a>
        )}

        {product.categoryId === 1 && (
          <VolumeSelection
            volume={volume}
            setVolume={setVolume}
            volumes={currentVolumesArray}
            className="my-4"
          />
        )}

        <Separator />

        <Button
          loading={loading}
          onClick={() => onSubmit?.(product.id, volume)}
          className="h-[55px] px-10 text-base rounded-[18px] w-full mt-6"
        >
          Add too cart for {finalPrice} €
        </Button>
      </div>
    </div>
  );
};
