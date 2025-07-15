"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Title } from ".";
import { Button, Input, Popover, Switch } from "../ui";
import { ChevronRight, GalleryVerticalEnd, Settings2, Trash2, X } from "lucide-react";
import { ProductVariation } from "@prisma/client";
import { useRouter } from "@/src/i18n/navigation";
import { PopoverContent, PopoverTrigger } from "../ui/popover";
import { changeProductPrice, deleteProductVariation } from "@/src/app/actions";
import { useFormStatus } from "react-dom";

interface Props {
  id: number;
  name: string;
  price: number;
  imageUrl: string[];
  available?: boolean;
  deleteProduct: (id: number) => void;
  loading?: boolean;
  switchAvailability: (id: number, available: boolean) => void;
  variations?: ProductVariation[];
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
  variations,
  switchAvailability,
  deleteProduct,
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
            src={imageUrl[0] || variations?.[0]?.imageUrl || ""}
            alt={name}
          />
        </div>
      </Link>

      <div className="h-[80px]">
        <Title text={name} size="xs" className="mb-1 mt-3 font-bold" />
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <GalleryVerticalEnd size={20} />
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <ul>
            {variations?.map((item) => (
              <li className="flex justify-between" key={item.id}>{item.name}
              <span onClick={() => deleteProductVariation(item.id)}><X size={20} /></span>
              </li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>
      <div className="flex items-center gap-2 md:gap-5 mt-4">
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
        <form action={changeProductPrice} className="flex gap-2">
          <input type="text" placeholder="0.00" name="price" className="w-10 px-2 border" />
          <input type="text" placeholder="0.00" name="discountPrice" className="w-10 px-2 border border-red-500" />
          <Input type="hidden" name="id" value={id} />
          <button type="submit"><ChevronRight size={20} /></button>
        </form>
      </div>
    </div>
  );
};
