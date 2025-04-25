"use client";

import Image from "next/image";
import Link from "next/link";
import React, { use, useEffect, useState } from "react";
import { ChooseVariation, Title, VolumeSelection } from ".";
import { Button } from "../ui";
import { Heart, HeartOff, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { useCartStore, useFavoritesStore } from "@/shared/store";
import { Volume, volumes } from "@/shared/constants/perfume";
import { calcPrice } from "@/shared/lib";
import { HeartBlack } from "@/shared/icons";
import { unknown } from "zod";
import { PerfumeConcentration, ProductVariation } from "@prisma/client";
import { it } from "node:test";
import { useFavorites } from "@/shared/hooks";
import { concentrations } from "@/prisma/constants";

interface Props {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  available?: boolean;
  categoryId?: number;
  variations: ProductVariation[];
  concentration?: PerfumeConcentration;
  productGroupId?: number;
  className?: string;
}

export const ProductCard: React.FC<Props> = ({
  imageUrl,
  className,
  name,
  price,
  id,
  categoryId,
  variations,
  productGroupId,
  concentration,
}) => {
  const currentVolumesArray =
    price < 8 ? volumes.slice(1) : (volumes as unknown as Volume[]);

  const [volume, setVolume] = useState<Volume>(currentVolumesArray[0]);
  const [isFavorite, toggleIsFavorite] = useState(false);
  const [activeVariation, setActiveVariation] = useState<ProductVariation>(
    variations[0]
  );

  const onToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    toggleIsFavorite(!isFavorite);

    addFavoritesItem(id);
  };

  const { items, addFavoritesItem } = useFavorites();

  const [addCartItem, loading] = useCartStore((state) => [
    state.addCartItem,
    state.loading,
  ]);

  useEffect(() => {
    if (items.some((item) => item.productId === id)) {
      toggleIsFavorite(true);
    } else {
      toggleIsFavorite(false);
    }
  }, [items, id]);

  const onSubmit = async () => {
    try {
      await addCartItem({
        productId: id,
        volume: categoryId === 1 ? volume : 1,
        variationId: activeVariation ? activeVariation.id : undefined,
      });
      toast.success(name + " added to cart");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };
  const finalPrice = categoryId === 1 ? calcPrice(volume, price) : price;
  const concentratioName = concentrations.find(
    (item) => item.value === concentration
  );
  return (
    <div className={className}>
      <Link href={`/product/${id}`}>
        <div className="w-full max-w-[400px] aspect-[4/5] relative">
          <Image
            src={imageUrl || activeVariation?.imageUrl}
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
      </Link>
      <div className="h-28">
        <Title text={name} size="xs" className="md:text-lg mt-2 font-bold" />
        {concentration && <p className="text-sm">{concentratioName?.name}</p>}
      </div>

      {(categoryId === 1 && (productGroupId && productGroupId  < 4)) && (
        <VolumeSelection
          className="mb-4"
          volumes={currentVolumesArray}
          volume={volume}
          setVolume={setVolume}
        />
      )}

      {variations.length > 1 && (
        <ChooseVariation
          setActiveVariation={setActiveVariation}
          activeVariation={activeVariation}
          className="mb-4"
          items={variations}
        />
      )}

      <div className="flex justify-between items-center ">
        <div className="flex flex-col">
        <p className="text-[20px] ">
          <span className="hidden md:inline">price</span> <b>{finalPrice} €</b>
        </p>
        { categoryId === 1 && (productGroupId && productGroupId  < 4) &&
          <p className="text-[15px] text-slate-500 ">
          <span className="hidden md:inline"></span> <b>{price} € pro g</b>
        </p>
        }
        
        </div>
        

        <Button
          // loading={loading}
          onClick={onSubmit}
          variant="outline"
          className="text-base font-bold"
        >
          <Plus size={20} className="mr-1" />
          Add
        </Button>
      </div>
    </div>
  );
};
