"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Title, VolumeSelection } from ".";
import { Button } from "../ui";
import { Heart, HeartOff, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { useCartStore, useFavoritesStore } from "@/shared/store";
import { Volume } from "@/shared/constants/perfume";
import { calcPrice } from "@/shared/lib";
import { HeartBlack } from "@/shared/icons";

interface Props {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  available?: boolean;
  categoryId?: number;
  className?: string;
}

export const ProductCard: React.FC<Props> = ({
  imageUrl,
  className,
  name,
  price,
  id,
  categoryId
}) => {
  const [volume, setVolume] = useState<Volume>(1);
  const [isFavorite, toggleIsFavorite] = useState(false);

  const onToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    toggleIsFavorite(!isFavorite);

    addFavoritesItem(id);
  };
  const [addFavoritesItem, items] = useFavoritesStore(
    (state) => [state.addFavoritesItem, state.items, state.favoritesLoading]
  );
  const [addCartItem, loading] = useCartStore((state) => [
    state.addCartItem,
    state.loading,
  ]);

  const onSubmit = async () => {
    try {
      await addCartItem({
        productId: id,
        volume,
      });
      toast.success(name + " added to cart");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };
  const finalPrice = calcPrice(volume, price);
  return (
    <div className={className}>
      <Link href={`/product/${id}`}>
        <div className="flex justify-center bg-secondary rounded-lg w-full h-[300px] relative">
          <Image
            layout="fill"
            objectFit="cover"
            // className="object-cover"
            src={imageUrl}
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
              <Heart className=""/>
            )}
          </Button>
        </div>
      </Link>
      <div className="h-16">
        <Title text={name} size="xs" className="md:text-lg my-3 font-bold" />
      </div>

      {categoryId === 1 && <VolumeSelection className="mb-4" volume={volume} setVolume={setVolume} />}

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
