import {
  Container,
  ProductForm,
  Review,
  ReviewForm,
  ReviewsList,
  Title,
} from "@/shared/components/shared";
import { prisma } from "@/prisma/prisma-client";
import { notFound } from "next/navigation";
import React from "react";
import { Rating } from "@/shared/components/shared/rating";

export default async function Product({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const productId = Number((await params).id);
  const product = await prisma.product.findFirst({
    where: { id: productId },
  });

  if (!product) {
    return notFound();
  }

  return (
    <Container className="flex flex-col my-10">
      <div className="h-[calc(100vh-248px)]">
        <ProductForm product={product} />
      </div>
      <Title text="Reviews" size="lg" className="font-extrabold my-10" />

      <ReviewsList className="mb-10" />
      <ReviewForm productId={product.id} />
    </Container>
  );
}
