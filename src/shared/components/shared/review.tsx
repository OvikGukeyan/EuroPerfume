"use client";

import React, { FC } from "react";
import { cn } from "@/src/lib/utils";
import { Title } from ".";
import { Separator } from "../ui";
import { Rating } from "./rating";
import Link from "next/link";
import Image from "next/image";

type Props = {
  className?: string;
  text: string;
  userName: string;
  rating: number;
  createdAt: Date;
  productId?: number;
  productName?: string;
  imageUrl?: string;
};

export const ReviewComponent: FC<Props> = ({
  className,
  text,
  userName,
  rating,
  productId,
  productName,
  imageUrl,
  createdAt,
}) => {
  return (
    <div className={cn("", className)}>
      {(productId && productName && imageUrl) && (
        <Link href={`/product/${productId}`}>
          <div className="flex gap-10 mb-2">
            <Image src={imageUrl} alt={productName} width={100} height={50} />
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
      <p className="text-sm text-neutral-500 tracking-widest mt-4">
        {createdAt.toLocaleDateString()}
      </p>
      <Separator className="mb-5" />
    </div>
  );
};
