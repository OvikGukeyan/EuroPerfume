import { prisma } from "@/prisma/prisma-client";
import { notFound } from "next/navigation";
import React from "react";
import {
  BreadcrumbComponent,
  ChooseProductForm,
  Container,
  RecentlyViewed,
  ReviewsComponent,
} from "@/src/shared/components";
import { Recommendations } from "@/src/shared/components/shared/recommendations";

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
      productGroup: true,
      variations: true,
      aromas: true,
      classification: true,
      effect: true,
      purpose: true,
      skinType: true,
      packagingFormat: true,
      finish: true,
      applicationMethod: true,
      texture: true,
      formula: true,
      productNotes: {
        include: {
          note: true,
        },
      },
      brand: true,
      translations: true,
      category: true,
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
    <Container className="flex flex-col mb-10 p-0 md:p-4">
      <BreadcrumbComponent
        className="mb-10 mt-5 ml-5 md:ml-0 md:mt-0"
        productName={product.name}
        productCategory={product.category}
      />
      <ChooseProductForm product={safeProduct} />
      <ReviewsComponent className="hidden md:block" product={safeProduct} />
      <Recommendations searchParams={safeProduct} className="my-20" />
      <RecentlyViewed />
    </Container>
  );
}
