"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Title } from ".";
import { Button } from "../ui";
import { Heart } from "lucide-react";
import { HeartBlack } from "@/src/shared/icons";
import {
  PerfumeConcentration,
  ProductGroup,
  ProductVariation,
} from "@prisma/client";
import { useFavorites } from "@/src/shared/hooks";
import { concentrations } from "@/../../prisma/constants";
import { useTranslations } from "use-intl";
import { cn } from "../../lib/utils";

interface Props {
  id: number;
  productGroup: ProductGroup;
  name: string;
  imageUrl: string;
  available?: boolean;
  variations: ProductVariation[];
  concentration?: PerfumeConcentration;
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
}) => {
  const [isFavorite, toggleIsFavorite] = useState(false);

  const t = useTranslations("Product");

  const onToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    toggleIsFavorite(!isFavorite);

    addFavoritesItem(id);
  };

  const { items, addFavoritesItem } = useFavorites();

  useEffect(() => {
    if (items.some((item) => item.productId === id)) {
      toggleIsFavorite(true);
    } else {
      toggleIsFavorite(false);
    }
  }, [items, id]);

  const concentratioName = concentrations.find(
    (item) => item.value === concentration
  )?.name;

  return (
    <div className={cn("bg-white", className)}>
      <Link href={`/product/${id}`}>
        <div className="w-full max-w-[400px] aspect-[4/5] relative">
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
        </div>

        <div className="h-28">
          <Title text={name} size="xs" className="md:text-lg mt-2 font-bold" />
          <p className="text-sm">{concentratioName || productGroup?.labelRu}</p>
        </div>
      </Link>
    </div>
  );
};
