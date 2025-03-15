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

interface Props {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  available?: boolean;
  className?: string;
}

export const ProductCard: React.FC<Props> = ({
  imageUrl,
  className,
  name,
  price,
  id,
}) => {
  const [volume, setVolume] = useState<Volume>(1);
  const [isFavorite, toggleIsFavorite] = useState(false);

  const onToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    toggleIsFavorite(!isFavorite);

    addFavoritesItem(id);
  };
  const [addFavoritesItem, items, favoritesLoading] = useFavoritesStore(
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
            loading={favoritesLoading}
          >
            {items.some((item) => item.productId === id) ? (
              <HeartOff />
            ) : (
              <Heart />
            )}
          </Button>
        </div>
      </Link>

      <Title text={name} size="sm" className=" my-5 font-bold" />

      <VolumeSelection volume={volume} setVolume={setVolume} />

      <div className="flex justify-between items-center mt-4">
        <p className="text-[20px] ">
          <span className="hidden md:inline">price</span>  <b>{finalPrice} €</b>
        </p>

        <Button
          loading={loading}
          onClick={onSubmit}
          variant="secondary"
          className="text-base font-bold"
        >
          <Plus size={20} className="mr-1" />
          Add
        </Button>
      </div>
    </div>
  );
};
