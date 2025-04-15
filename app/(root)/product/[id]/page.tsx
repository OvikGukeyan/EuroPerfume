import {
  Container,
  ProductForm,
  ReviewForm,
  ReviewsList,
  Title,
} from "@/shared/components/shared";
import { prisma } from "@/prisma/prisma-client";
import { notFound } from "next/navigation";
import React from "react";

export default async function Product({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const productId = Number((await params).id);
  const product = await prisma.product.findFirst({
    where: { id: productId },
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
      }
    },
  });

  if (!product) {
    return notFound();
  }

  return (
    <Container className="flex flex-col my-10">
        <ProductForm  product={product}  />
      {product.reviews.length > 0 ? (
        <>
          <Title text="Reviews" size="lg" className="font-extrabold my-10" />
          <ReviewsList reviews={product.reviews} className="mb-10" />
        </>
      ) : (
        <Title
          text="No reviews yet"
          size="lg"
          className="font-extrabold my-10"
        />
      )}

      <ReviewForm productId={product.id} />
    </Container>
  );
}
