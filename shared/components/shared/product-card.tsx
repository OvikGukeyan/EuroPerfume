"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Title, VolumeSelection } from ".";
import { Button } from "../ui";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import { useCartStore } from "@/shared/store";

interface Props {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  className?: string;
}

export const ProductCard: React.FC<Props> = ({
  imageUrl,
  className,
  name,
  price,
  id,
}) => {
  const [volume, setVolume] = useState(1);

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

      {/* <p className="text-sm text-gray-400">
                    {ingredients.map(i => i.name).join(', ')}
                </p> */}
      <VolumeSelection volume={volume} setVolume={setVolume} />

      <div className="flex justify-between items-center mt-4">
        <span className="text-[20px]">
          from <b>{price} €</b>
        </span>

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
