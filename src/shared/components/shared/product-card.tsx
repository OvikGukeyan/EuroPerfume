"use client";

import Image from "next/image";
import React, { useState } from "react";
import { ChooseVariation, Title, VolumeSelection } from ".";
import { Button } from "../ui";
import { Heart, Plus, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import { useCartStore } from "@/src/shared/store";
import { Volume, volumes } from "@/src/shared/constants/perfume";
import { calcAverageRating, calcPrice } from "@/src/shared/lib";
import { HeartBlack } from "@/src/shared/icons";
import {
  Brand,
  PerfumeConcentration,
  ProductGroup,
  ProductVariation,
  Review,
} from "@prisma/client";
import { concentrations } from "@/../../prisma/constants";
import { useLocale, useTranslations } from "use-intl";
import { cn } from "../../lib/utils";
import { Rating } from "./rating";
import { Link } from "@/src/i18n/navigation";

interface Props {
  id: number;
  productGroup: ProductGroup;
  name: string;
  price: number;
  imageUrl: string;
  available?: boolean;
  categoryId?: number;
  variations: ProductVariation[];
  concentration?: PerfumeConcentration;
  discountPrice?: number;
  isBestseller?: boolean;
  isFavorite: boolean;
  toggleIsFavorite: (id: number) => void;
  reviews?: Review[];
  brand: Brand;
  className?: string;
}

export const ProductCard: React.FC<Props> = ({
  imageUrl,
  className,
  name,
  price,
  discountPrice,
  id,
  productGroup,
  variations,
  concentration,
  isBestseller,
  isFavorite,
  toggleIsFavorite,
  reviews,
  brand,
}) => {
  const [volume, setVolume] = useState<Volume>(volumes[0]);
  const [activeVariationId, setActiveVariationId] = useState<number>(
    variations[0]?.id
  );
  const activeVariation = variations.find(
    (variation) => variation.id === activeVariationId
  );
  const t = useTranslations("Product");

  const { averageRating, count } = calcAverageRating(reviews as Review[]);
  const onToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    toggleIsFavorite(id);
  };

  const [addCartItem, loading] = useCartStore((state) => [
    state.addCartItem,
    state.loading,
  ]);

  const onSubmit = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await addCartItem({
        productId: id,
        volume: productGroup.onTap ? volume : 1,
        variationId: activeVariation ? activeVariation.id : undefined,
      });
      toast.success(name + " added to cart");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };
  const finalPrice = productGroup.onTap ? calcPrice(volume, price) : price;
  const finalDiscountPrice =
    discountPrice && productGroup.onTap
      ? calcPrice(volume, discountPrice)
      : discountPrice;
  const concentratioName = concentrations.find(
    (item) => item.value === concentration
  )?.name;
  const locale = useLocale();
  const labelLocale = locale === "ru" ? "labelRu" : "labelDe";

  const image = imageUrl || activeVariation?.imageUrl || "";

  return (
    <div
      className={cn(
        "md:hover:scale-105 transition-all duration-300 md:active:scale-95 md:active:border-2",
        className
      )}
    >
      <Link href={`/product/${id}`}>
        <div className="w-full max-w-[400px] aspect-[4/5] relative bg-white">
          <Image src={image} alt={name} fill className="object-contain " />
          <Button
            className="absolute top-3 right-1 md:right-5 hover:bg-transparent p-2"
            onClick={(e) => onToggleFavorite(e)}
            variant="ghost"
          >
            {isFavorite ? <HeartBlack /> : <Heart />}
          </Button>
          <div>
            {discountPrice && (
              <p className="absolute top-0 left-3 md:left-5 text-sm text-white bg-red-500 px-2">
                SALE
              </p>
            )}
          </div>
          <div>
            {isBestseller && (
              <p className="absolute bottom-0 right-3 md:right-5 text-sm text-white bg-green-500 px-2">
                BESTSELLER
              </p>
            )}
          </div>
        </div>
      </Link>

      {reviews && (
        <Link href={`/product-reviews/${id}`}>
          <Rating
            className="my-5 justify-center"
            value={averageRating}
            withNumber
            reviewsCount={count}
          />
        </Link>
      )}
      <Link href={`/product/${id}`}>
        <div className="h-28">
          <Title text={brand.name} size="xs" className="md:text-lg mt-2 font-bold" />
          <Title text={name} size="xs" className="md:text-md mt-1 font-bold" />
          <p className="text-sm">
            {concentratioName || productGroup?.[labelLocale]}
          </p>
        </div>
      </Link>

      {productGroup.onTap && (
        <VolumeSelection
          className="mb-4"
          volumes={[...volumes]}
          volume={volume}
          setVolume={setVolume}
        />
      )}

      {variations.length > 1 && (
        <ChooseVariation
          setActiveVariationId={setActiveVariationId}
          activeVariationId={activeVariationId}
          className="mb-4"
          items={variations}
        />
      )}

      <div className="flex justify-between items-center ">
        <div className="flex flex-col">
          <p className="text-[20px] ">
            <span className="hidden md:inline">{t("price")}</span>{" "}
            {discountPrice ? (
              <>
                <span className="line-through text-base mr-2">
                  {finalPrice} €
                </span>
                <b className="text-red-500">{finalDiscountPrice} €</b>
              </>
            ) : (
              <b>{finalPrice} €</b>
            )}
          </p>
        </div>

        <Button
          onClick={(e) => onSubmit(e)}
          variant="outline"
          className="text-base font-bold"
        >
          <Plus size={20} className="mr-1" />
          <ShoppingCart size={20} />
        </Button>
      </div>
    </div>
  );
};
