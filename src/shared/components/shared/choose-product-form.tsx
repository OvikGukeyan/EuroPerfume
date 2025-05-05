"use client";

import { cn } from "@/src/shared/lib/utils";
import React, { FC, useEffect, useState } from "react";
import { Button, Separator } from "../ui";
import {
  Title,
  Text,
  VolumeSelection,
  ProductCharacteristics,
  ChooseVariation,
  ProductCarousel,
} from ".";
import { Volume, volumes } from "@/src/shared/constants/perfume";
import { ProductVariation } from "@prisma/client";
import {
  calcAverageRating,
  calcPrice,
  createCharacteristicsArray,
  useModalContext,
} from "@/src/shared/lib";
import { Rating } from "./rating";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ProductDTO } from "@/src/shared/services/dto/product.dto";
import Image from "next/image";
import { useRouter } from "@/src/i18n/navigation";
import { ProductWithTranslations } from "./product-form";
import { useLocale } from "next-intl";

interface Props {
  product: ProductWithTranslations;
  loading: boolean;
  onSubmit?: (productId: number, volume: Volume) => Promise<void>;
  activeVariation: ProductVariation;
  setActiveVariation: (variation: ProductVariation) => void;
  className?: string;
}
export const ChooseProductForm: FC<Props> = ({
  product,
  loading,
  onSubmit,
  activeVariation,
  setActiveVariation,
  className,
}) => {
  const currentVolumesArray =
    product.price < 8 ? volumes.slice(1) : (volumes as unknown as Volume[]);
  const [volume, setVolume] = useState<Volume>(currentVolumesArray[0]);
  const finalPrice =
    product.categoryId === 1 && product.productGroupId < 4
      ? calcPrice(volume, product.price)
      : product.price;
  const { averageRating, count } = calcAverageRating(product.reviews);
  const router = useRouter();
  const { isModal } = useModalContext();
  const locale = useLocale() as "ru" | "de";

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

  const charactiristics = createCharacteristicsArray(product, locale);
  return (
    <div className={cn("flex flex-col lg:flex-row flex-1", className)}>
      <div className="flex  items-center justify-center flex-1 relative w-full lg:w-2/5 bg-[#f2f2f2] p-2 min-h-[400px]">
      
        {product.imageUrl.length > 1 ? (
          <ProductCarousel slides={product.imageUrl} />
        ) : (
          <Image
            layout="fill"
            objectFit="contain"
            src={activeVariation?.imageUrl || product.imageUrl[0]}
            alt={""}
          />
        )}
      </div>

      <div className="w-full flex flex-col justify-between lg:w-3/5  bg-[#f2f2f2] p-7">
        <div>
          <Title
            text={product.name}
            size="md"
            className="font-extrabold mb-2"
          />

          <Separator />

          <div
            style={{ scrollbarWidth: "none" }}
            className={cn(
              "overflow-scroll  overflow-x-hidden",
              isModal && "lg:max-h-[400px]"
            )}
          >
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-16">
                <TabsTrigger className="h-10" value="description">
                  Description
                </TabsTrigger>
                <TabsTrigger className="h-10" value="characteristics">
                  Characteristics
                </TabsTrigger>
              </TabsList>
              <TabsContent value="description">
                <Text size="md" className="my-4">
                  {charactiristics.find((c) => c.name === "Description")?.value}
                </Text>
              </TabsContent>
              <TabsContent value="characteristics">
                <ProductCharacteristics charactiristics={charactiristics} />
              </TabsContent>
            </Tabs>
          </div>

          <Separator />

          {!isModal ? (
            <div onClick={scrollToReviews} className="cursor-pointer">
              <Rating
                className="my-5"
                value={averageRating}
                withNumber
                reviewsCount={count}
              />
            </div>
          ) : (
            <a href={`/product/${product.id}`}>
              <Rating
                className="my-5"
                value={averageRating}
                withNumber
                reviewsCount={count}
              />
            </a>
          )}

          {product.variations.length > 1 && (
            <ChooseVariation
              setActiveVariation={setActiveVariation}
              activeVariation={activeVariation}
              className="mb-4"
              items={product.variations}
            />
          )}

          {product.categoryId === 1 && product.productGroupId < 4 && (
            <VolumeSelection
              volume={volume}
              setVolume={setVolume}
              volumes={currentVolumesArray}
              className="my-4"
            />
          )}

          <Separator />
        </div>

        <Button
          loading={loading}
          onClick={() => onSubmit?.(product.id, volume)}
          className="h-[55px] px-10 text-base rounded-[18px] w-full mt-6 "
        >
          Add too cart for {finalPrice} €
        </Button>
      </div>
    </div>
  );
};
