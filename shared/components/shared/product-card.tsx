"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { ChooseVariation, Title, VolumeSelection } from ".";
import { Button } from "../ui";
import { Heart, HeartOff, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { useCartStore, useFavoritesStore } from "@/shared/store";
import { Volume, volumes } from "@/shared/constants/perfume";
import { calcPrice } from "@/shared/lib";
import { HeartBlack } from "@/shared/icons";
import { unknown } from "zod";
import { ProductVariation } from "@prisma/client";

interface Props {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  available?: boolean;
  categoryId?: number;
  variations: ProductVariation[];
  className?: string;
}

export const ProductCard: React.FC<Props> = ({
  imageUrl,
  className,
  name,
  price,
  id,
  categoryId,
  variations
}) => {
  const currentVolumesArray =
    price < 8 ? volumes.slice(1) : (volumes as unknown as Volume[]);

  const [volume, setVolume] = useState<Volume>(currentVolumesArray[0]);
  const [isFavorite, toggleIsFavorite] = useState(false);
  const [activeVariation, setActiveVariation] = useState<ProductVariation>(variations[0]);

  const onToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    toggleIsFavorite(!isFavorite);

    addFavoritesItem(id);
  };
  const [addFavoritesItem, items] = useFavoritesStore((state) => [
    state.addFavoritesItem,
    state.items,
    state.favoritesLoading,
  ]);
  const [addCartItem, loading] = useCartStore((state) => [
    state.addCartItem,
    state.loading,
  ]);

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
  const finalPrice = categoryId === 1 ?  calcPrice(volume, price) : price;
  return (
    <div className={className}>
      <Link href={`/product/${id}`}>
        <div className="flex justify-center bg-secondary rounded-lg w-full h-[300px] relative">
          <Image
            layout="fill"
            objectFit="cover"
            // className="object-cover"
            src={imageUrl || activeVariation?.imageUrl  }
            alt={name}
          />

          <Button
            className="absolute top-3 right-1 md:right-5 hover:bg-transparent p-2"
            onClick={(e) => onToggleFavorite(e)}
            variant="ghost"
          >
            {items.some((item) => item.productId === id) ? (
              <HeartBlack />
            ) : (
              <Heart className="" />
            )}
          </Button>
        </div>
      </Link>
      <div className="h-16">
        <Title text={name} size="xs" className="md:text-lg my-3 font-bold" />
      </div>

      {categoryId === 1 && (
        <VolumeSelection
          className="mb-4"
          volumes={currentVolumesArray}
          volume={volume}
          setVolume={setVolume}
        />
      )}

      {variations.length > 1 && (
        <ChooseVariation setActiveVariation={setActiveVariation} activeVariation={activeVariation} className="mb-4" items={variations}/>
      )}

      <div className="flex justify-between items-center ">
        <p className="text-[20px] ">
          <span className="hidden md:inline">price</span> <b>{finalPrice} €</b>
        </p>

        <Button
          loading={loading}
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
