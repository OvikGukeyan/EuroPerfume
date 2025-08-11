"use client";

import React, { FC } from "react";
import { cn } from "@/src/lib/utils";
import { DialogCarousel, Title } from ".";
import { Separator } from "../ui";
import { Rating } from "./rating";
import Link from "next/link";
import Image from "next/image";

type Props = {
  className?: string;
  images?: string[];
  text: string;
  userName: string;
  rating: number;
  createdAt: Date;
  productId?: number;
  productName?: string;
  productImage?: string;
};

export const ReviewComponent: FC<Props> = ({
  className,
  text,
  userName,
  rating,
  images,
  productId,
  productName,
  productImage,
  createdAt,
}) => {
  return (
    <div className={cn("", className)}>
      {productId && productName && productImage && (
        <Link href={`/product/${productId}`}>
          <div className="flex gap-10 mb-2">
            <Image
              src={productImage}
              alt={productName}
              width={100}
              height={50}
            />
            <Title
              text={productName}
              size="xs"
              className="font-extrabold my-10"
            />
          </div>
        </Link>
      )}
      <div className="flex items-center justify-between mb-5">
        <Title text={userName} size="xs" className="font-bold mb-5" />
        <Rating value={rating} withNumber />
      </div>
      <p> {text}</p>
      {images && images.length > 0 && (
        <div className="flex gap-2 my-5">
          <DialogCarousel images={images || []} />
        </div>
      )}

      <p className="text-sm text-neutral-500 tracking-widest mt-4">
        {createdAt.toLocaleDateString()}
      </p>
      <Separator className="mb-5" />
    </div>
  );
};
