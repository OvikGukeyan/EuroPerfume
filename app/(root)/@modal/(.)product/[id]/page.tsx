import { ChooseProductModal } from "@/shared/components/shared";
import { prisma } from "@/prisma/prisma-client";
import { notFound } from "next/navigation";
import React from "react";
import { Product, ProductVariation, Review } from "@prisma/client";

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
    },
  });

  if (!product) {
    return notFound();
  }

  return <ChooseProductModal product={product as Product & { reviews: Review[], variations: ProductVariation[] }} />
}
