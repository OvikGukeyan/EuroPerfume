"use client";

import { cn } from "@/src/shared/lib/utils";
import React, { FC, useEffect, useRef, useState } from "react";
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
import { ProductTranslation } from "@prisma/client";
import {
  calcAverageRating,
  calcPrice,
  createCharacteristicsArray,
} from "@/src/shared/lib";
import { Rating } from "./rating";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useCartStore } from "../../store";
import toast from "react-hot-toast";
import { ProductDTO } from "../../services/dto/product.dto";
import { se } from "date-fns/locale";
import { set } from "date-fns";

export type MediaItem = { type: "image" | "video"; url: string; id?: number };

export interface ProductWithTranslations extends ProductDTO {
  translations: ProductTranslation[];
}
interface Props {
  product: ProductWithTranslations;
  className?: string;
}
export const ChooseProductForm: FC<Props> = ({ product, className }) => {
  const reviewsRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("characteristics");
  const [activeVariationId, setActiveVariationId] = useState<number>(
    product.variations[0]?.id
  );
  const activeVariation = product.variations.find(
    (variation) => variation.id === activeVariationId
  );
  const currentVolumesArray =
    product.price < 8 ? volumes.slice(1) : (volumes as unknown as Volume[]);

  const [volume, setVolume] = useState<Volume>(currentVolumesArray[0]);

  const finalPrice =
    product.categoryId === 1 && product.productGroup.id < 4
      ? calcPrice(volume, product.price)
      : product.price;
  const finalDiscountPrice =
    product.discountPrice &&
    product.categoryId === 1 &&
    product.productGroup?.id &&
    product.productGroup.id < 4
      ? calcPrice(volume, product.discountPrice)
      : product.discountPrice;
  const { averageRating, count } = calcAverageRating(product.reviews);

  const locale = useLocale() as "ru" | "de";

  const [addCartItem, loading] = useCartStore((state) => [
    state.addCartItem,
    state.loading,
  ]);

  useEffect(() => {
    const viewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
    const updated = [
      product.id,
      ...viewed.filter((id: number) => id !== product.id),
    ].slice(0, 10);
    localStorage.setItem("recentlyViewed", JSON.stringify(updated));
  }, [product.id]);

  const onSubmit = async () => {
    try {
      await addCartItem({
        productId: product.id,
        volume:
          product.categoryId === 1 &&
          product.productGroupId &&
          product.productGroupId < 4
            ? volume
            : 1,
        variationId: activeVariation?.id,
      });
      toast.success(product.name + " added to cart");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const charactiristics = createCharacteristicsArray(product, locale);
  const t = useTranslations("Product");
  const media: MediaItem[] = [
    ...product.imageUrl.map((url) => ({ type: "image" as const, url })),
    ...(product.videoUrl
      ? [{ type: "video" as const, url: product.videoUrl }]
      : []),
  ];
  const variationsMedia: MediaItem[] = [
    ...product.variations.map((variation) => ({
      type: "image" as const,
      url: variation.imageUrl,
      id: variation.id,
    })),
    ...(product.videoUrl
      ? [{ type: "video" as const, url: product.videoUrl }]
      : []),
  ];

  const handleRatingClick = () => {
    setTimeout(() => {
      const reviewsEl = document.getElementById("reviews");
      const isVisible = reviewsEl && reviewsEl.offsetParent !== null;
      if (!isVisible) {
        setActiveTab("comments");
      }
      const targetOffset = isVisible
        ? reviewsEl.offsetTop
        : reviewsRef.current?.offsetTop || 0;

      window.scrollTo({
        top: targetOffset,
        behavior: "smooth",
      });
    }, 200);
  };
  return (
    <div
      className={cn(
        "flex flex-col lg:flex-row flex-1 max-w-[100vw]",
        className
      )}
    >
      <div className="flex  items-center justify-center flex-1 relative w-full lg:w-2/5 bg-[#f2f2f2] p-2 min-h-[400px]">
        {media.length > 1 || variationsMedia.length > 1 ? (
          <ProductCarousel
            slides={media.length > 1 ? media : variationsMedia}
            setActiveVariationId={setActiveVariationId}
            activeVariationId={activeVariationId}
          />
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
          {product.variations.length > 1 && (
            <ChooseVariation
              setActiveVariationId={setActiveVariationId}
              activeVariationId={activeVariationId}
              className="mt-4"
              items={product.variations}
            />
          )}
          <div
            style={{ scrollbarWidth: "none" }}
            className={cn("overflow-scroll  overflow-x-hidden")}
          >
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              defaultValue="characteristics"
              className="w-full"
              ref={reviewsRef}
            >
              <TabsList className="grid w-full grid-cols-3 md:grid-cols-2 h-16">
                <TabsTrigger className="h-10" value="characteristics">
                  {t("characteristics")}
                </TabsTrigger>
                <TabsTrigger className="h-10" value="description">
                  {t("description")}
                </TabsTrigger>

                <TabsTrigger className="h-10 md:hidden" value="comments">
                  {t("comments")}
                </TabsTrigger>
              </TabsList>
              <TabsContent className="w-full" value="characteristics">
                <ProductCharacteristics
                  charactiristics={charactiristics.filter(
                    (c) => c.name !== "Description"
                  )}
                />
              </TabsContent>
              <TabsContent className="w-full min-h-[200px]" value="description">
                <Text size="md" className="my-4">
                  {
                    product.translations.find(
                      (t) =>
                        t.language.toLocaleLowerCase() ===
                        locale.toLocaleLowerCase()
                    )?.description
                  }
                </Text>
              </TabsContent>

              <TabsContent className="w-full md:hidden" value="comments">
                <ReviewsComponent product={product} />
              </TabsContent>
            </Tabs>
          </div>

          <Separator />
          <div onClick={handleRatingClick}>
            <Rating
              className="my-5"
              value={averageRating}
              withNumber
              reviewsCount={count}
            />
          </div>

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
          onClick={onSubmit}
          className="h-[55px] px-10 text-base rounded-[18px] w-full mt-6 "
        >
          <span className="mr-1">{t("addToCartFor")}</span>

          {product.discountPrice ? (
            <>
              <span className="line-through text-base mr-2">
                {finalPrice} €
              </span>
              <b className="text-red-500">{finalDiscountPrice} €</b>
            </>
          ) : (
            <b>{finalPrice} €</b>
          )}
        </Button>
      </div>
    </div>
  );
};
