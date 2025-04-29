
import { prisma } from "@/prisma/prisma-client";
import { notFound } from "next/navigation";
import React from "react";
import { Container, ProductForm, ReviewForm, ReviewsList, Title } from "@/src/shared/components";

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
      },
      brand: true,
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

  return (
    <Container className="flex flex-col my-10 p-0 md:p-4">
      <ProductForm product={safeProduct} />
     <div className="px-4 md:px-0">
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
     </div>
    </Container>
  );
}
