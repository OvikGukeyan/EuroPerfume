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
import { Rating } from "./rating";
import { calcAverageRating, calcPrice } from "@/shared/lib";
import { Review } from "@prisma/client";

interface Props {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  reviews: Review[];
  available?: boolean;
  className?: string;
}

export const ProductCard: React.FC<Props> = ({
  imageUrl,
  className,
  name,
  reviews,
  price,
  id,
}) => {
  const [volume, setVolume] = useState<Volume>(1);
  const [isFavorite, toggleIsFavorite] = useState(false);
  const { averageRating, count } = calcAverageRating(reviews);

  const onToggleFavorite = () => {
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
        <div className="flex justify-center bg-secondary rounded-lg h-[260px]">
          <Image
            width={300}
            height={280}
            className="object-cover"
            src={imageUrl}
            alt={name}
          />
        </div>
      </Link>

      <Title text={name} size="sm" className="mb-1 mt-3 font-bold" />

      <VolumeSelection volume={volume} setVolume={setVolume} />

        <Rating
          className="mt-5"
          value={averageRating}
          withNumber
          reviewsCount={count}
        />

      <div className="flex justify-between items-center mt-4">
        <span className="text-[20px]">
          price <b>{finalPrice} €</b>
        </span>
        <Button
          onClick={onToggleFavorite}
          variant={
            items.some((item) => item.productId === id) ? "secondary" : "ghost"
          }
          loading={favoritesLoading}
        >
          {items.some((item) => item.productId === id) ? (
            <HeartOff />
          ) : (
            <Heart />
          )}
        </Button>
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
