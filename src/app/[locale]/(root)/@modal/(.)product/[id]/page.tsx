import { ChooseProductModal } from "@/shared/components/shared";
import { prisma } from "prisma/prisma-client";
import { notFound } from "next/navigation";
import React from "react";
import { ProductDTO } from "@/shared/services/dto/product.dto";

export default async function ProductModalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findFirst({
    where: { id: Number(id) },
    include: {
      reviews: {
        include: {
          user: true,
        },
      },
      variations: true,
      productNotes: {
        include: {
          note: true,
        },
      },
      brand: true
    },
  });

  if (!product) {
    return notFound();
  }

  const safeProduct = {
    ...product,
    price:
      typeof product.price === "object" && "toNumber" in product.price
        ? product.price.toNumber()
        : product.price,
  };
  return <ChooseProductModal product={safeProduct as ProductDTO} />;
}
