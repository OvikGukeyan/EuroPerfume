"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Title, VolumeSelection } from ".";
import { Button, Switch } from "../ui";
import { Plus, Settings2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useCartStore } from "@/shared/store";
import { Volume } from "@/shared/constants/perfume";
import { getMe } from "@/shared/services/auth";
import { deleteProduct } from "@/app/actions";
import { useRouter } from "next/navigation";

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
  const [volume, setVolume] = useState<Volume>(1);

  const [addCartItem, loading] = useCartStore((state) => [
    state.addCartItem,
    state.loading,
  ]);

  const router = useRouter();

  const user = {
    role: "ADMIN",
  };
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
        <div className="flex justify-center bg-secondary rounded-lg h-[260px] ">
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
      {user && user.role === "ADMIN" && (
        <div className="flex items-center gap-5 mt-4">
          <Button onClick={() => deleteProduct(id)}>
            <Trash2 size={20} />
          </Button>
          <Button onClick={() => router.push(`/update/${id}`)}>
            <Settings2 size={20} />
          </Button>
          <Switch />
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <span className="text-[20px]">
          price <b>{price * volume} €</b>
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
