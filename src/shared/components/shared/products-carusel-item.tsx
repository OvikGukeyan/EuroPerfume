"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Title } from ".";
import { Button } from "../ui";
import { Heart } from "lucide-react";
import { HeartBlack } from "@/src/shared/icons";
import {
  PerfumeConcentration,
  ProductGroup,
  ProductVariation,
  Review,
} from "@prisma/client";
import { concentrations } from "@/../../prisma/constants";
import { useLocale } from "use-intl";
import { cn } from "../../lib/utils";
import { Rating } from "./rating";
import { calcAverageRating } from "../../lib";

interface Props {
  id: number;
  productGroup: ProductGroup;
  name: string;
  imageUrl: string;
  available?: boolean;
  variations: ProductVariation[];
  concentration?: PerfumeConcentration;
  discountPrice?: number;
  isBestseller?: boolean;
  isFavorite: boolean;
  toggleIsFavorite: (id: number) => void;
  reviews?: Review[];
  className?: string;
}

export const ProductCaruselItem: React.FC<Props> = ({
  imageUrl,
  className,
  name,
  id,
  productGroup,
  variations,
  concentration,
  discountPrice,
  isBestseller,
  isFavorite,
  toggleIsFavorite,
  reviews,
}) => {
  const onToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    toggleIsFavorite(id);
  };

  const { averageRating, count } = calcAverageRating(reviews as Review[]);

  const concentratioName = concentrations.find(
    (item) => item.value === concentration
  )?.name;

  const locale = useLocale();
  const labelLocale = locale === "ru" ? "labelRu" : "labelDe";

  return (
    <div
      className={cn(
        " w-full md:hover:scale-105 transition-all duration-300 active:scale-95 active:border-2 bg-gray-50",
        className
      )}
    >
      <Link href={`/product/${id}`}>
        <div className="w-full max-w-[400px] aspect-[4/5] relative bg-white">
          <Image
            src={imageUrl || variations?.[0]?.imageUrl || ""}
            alt={name}
            fill
            className="object-contain "
          />
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
          <Title text={name} size="xs" className="md:text-lg mt-2 font-bold" />
          <p className="text-sm">
            {concentratioName || productGroup?.[labelLocale]}
          </p>
        </div>
      </Link>
    </div>
  );
};
