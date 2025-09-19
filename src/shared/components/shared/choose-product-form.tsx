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

  const [volume, setVolume] = useState<Volume>(volumes[0]);

  const finalPrice = product.productGroup.onTap
    ? calcPrice(volume, product.price)
    : product.price;
  const finalDiscountPrice =
    product.discountPrice && product.productGroup.onTap
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
        volume: product.productGroup.onTap ? volume : 1,
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

  const description =
    product.translations.find(
      (t) => t.language.toLocaleLowerCase() === locale.toLocaleLowerCase()
    )?.description || "";

  const activeIngredients =
    product.translations.find(
      (t) => t.language.toLocaleLowerCase() === locale.toLocaleLowerCase()
    )?.activeIngredients || "";

  return (
    <div
      className={cn(
        "flex flex-col lg:flex-row flex-1 max-w-[100vw] bg-[#f2f2f2] ",
        className
      )}
    >
      <div className="flex  items-center justify-center flex-1 relative w-full  lg:w-2/5 bg-[#f2f2f2] p-2  min-h-[500px] self-start">
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
            text={product.brand.name}
            size="md"
            className="font-extrabold mb-2"
          />
          <Title
            text={product.name}
            size="sm"
            className="font-extrabold mb-2"
          />

          <Separator />
          {product.variations.length > 0 && (
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
              <TabsList
                className={cn(
                  "grid w-full gap-4 h-24 mb-7",
                  activeIngredients.length ? "grid-cols-2 md:grid-cols-3": "md:grid-cols-2 grid-cols-3",
                )}
              >
                <TabsTrigger className="h-10" value="characteristics">
                  {t("characteristics")}
                </TabsTrigger>
                <TabsTrigger className="h-10" value="description">
                  {t("description")}
                </TabsTrigger>
                {activeIngredients && (
                  <TabsTrigger className="h-10" value="activeIngredients">
                    {t("activeIngredients")}
                  </TabsTrigger>
                )}
                <TabsTrigger className="h-10 md:hidden" value="comments">
                  {t("comments")}
                </TabsTrigger>
              </TabsList>
              <TabsContent className="w-full" value="characteristics">
                <ProductCharacteristics charactiristics={charactiristics} />
              </TabsContent>
              <TabsContent className="w-full min-h-[200px]" value="description">
                <Text size="md" className="my-4">
                  {description.split(/\n\s*\n/).map((paragraph, idx) => (
                    <p key={idx} className="mb-4 leading-relaxed text-gray-800">
                      {paragraph.trim()}
                    </p>
                  ))}
                </Text>
              </TabsContent>
              <TabsContent
                className="w-full min-h-[200px]"
                value="activeIngredients"
              >
                <Text size="md" className="my-4">
                  {activeIngredients.split(/\n\s*\n/).map((paragraph, idx) => (
                    <p key={idx} className="mb-4 leading-relaxed text-gray-800">
                      {paragraph.trim()}
                    </p>
                  ))}
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

          {product.productGroup.onTap && (
            <VolumeSelection
              volume={volume}
              setVolume={setVolume}
              volumes={[...volumes]}
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
