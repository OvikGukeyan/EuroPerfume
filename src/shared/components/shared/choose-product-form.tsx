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
  ReviewsComponent,
} from ".";
import { Volume, volumes } from "@/src/shared/constants/perfume";
import { ProductVariation } from "@prisma/client";
import {
  calcAverageRating,
  calcPrice,
  createCharacteristicsArray,
} from "@/src/shared/lib";
import { Rating } from "./rating";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import Image from "next/image";
import { useRouter } from "@/src/i18n/navigation";
import { ProductWithTranslations } from "./product-form";
import { useLocale, useTranslations } from "next-intl";

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
  const locale = useLocale() as "ru" | "de";

  useEffect(() => {
    scrollToReviews();
  }, []);
  const scrollToReviews = () => {
    const reviewsSection = document.getElementById("reviews");
    if (reviewsSection) {
      reviewsSection.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/product/${product.id}#reviews`);
    }
  };

  const charactiristics = createCharacteristicsArray(product, locale);
  const t = useTranslations("Product");
  return (
    <div
      className={cn(
        "flex flex-col lg:flex-row flex-1 max-w-[100vw]",
        className
      )}
    >
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

      <div className="w-full flex flex-col justify-between lg:w-3/5  bg-[#f2f2f2] p-1 md:p-7">
        <div>
          <Title
            text={product.name}
            size="md"
            className="font-extrabold mb-2"
          />

          <Separator />

          <div
            style={{ scrollbarWidth: "none" }}
            className={cn("overflow-scroll  overflow-x-hidden")}
          >
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3 md:grid-cols-2 h-16">
                <TabsTrigger className="h-10" value="description">
                  {t("description")}
                </TabsTrigger>
                <TabsTrigger className="h-10" value="characteristics">
                  {t("characteristics")}
                </TabsTrigger>
         
                <TabsTrigger className="h-10 md:hidden" value="comments">
                  {t("comments")}
                </TabsTrigger>
              </TabsList>
              <TabsContent className="w-full min-h-[200px]" value="description">
                <Text size="md" className="my-4">
                  {charactiristics.find((c) => c.name === "Description")?.value}
                </Text>
              </TabsContent>
              <TabsContent className="w-full" value="characteristics">
                <ProductCharacteristics
                  charactiristics={charactiristics.filter(
                    (c) => c.name !== "Description"
                  )}
                />
              </TabsContent>
              <TabsContent className="w-full md:hidden" value="comments">
                <ReviewsComponent product={product} />
              </TabsContent>
            </Tabs>
          </div>

          <Separator />

          <a href={`/product/${product.id}`}>
            <Rating
              className="my-5"
              value={averageRating}
              withNumber
              reviewsCount={count}
            />
          </a>

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
          {t("addToCartFor")} {finalPrice} €
        </Button>
      </div>
    </div>
  );
};
