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
import { useRouter } from "next/navigation";
import {toggleProductAvailability } from "@/app/actions";

interface Props {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  available?: boolean;
  deleteProduct: (id: number) => void;
  loading?: boolean;
  switchAvailability: (id: number, available: boolean) => void
  className?: string;
}

export const DashboardProduct: React.FC<Props> = ({
  imageUrl,
  className,
  name,
  price,
  id,
  available,
  loading,
  switchAvailability,
  deleteProduct
}) => {

  const router = useRouter();


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

      <div className="flex items-center gap-5 mt-4">
        <Button loading={loading} onClick={() => deleteProduct(id)}>
          <Trash2 size={20} />
        </Button>
        <Button onClick={() => router.push(`/update/${id}`)}>
          <Settings2 size={20} />
        </Button>
        <Switch
          checked={available}
          onCheckedChange={() => switchAvailability(id, !available)}
        />
      </div>

      <div className="flex justify-between items-center mt-4">
        <span className="text-[20px]">
          price <b>{price} €</b>
        </span>
      </div>
    </div>
  );
};
