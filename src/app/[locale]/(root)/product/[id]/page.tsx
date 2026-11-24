import { prisma } from "@/prisma/prisma-client";
import { publicBottle, fragranceName } from "@/src/shared/lib/full-bottle";
import { notFound, redirect } from "next/navigation";
import React from "react";
import {
  BreadcrumbComponent,
  ChooseProductForm,
  Container,
  RecentlyViewed,
  ReviewsComponent,
} from "@/src/shared/components";
import { ProductRecommendations } from "@/src/shared/components/shared/product-recommendations";

export default async function Product({
  params,searchParams,
}: {
  params: Promise<{ id: string; locale:string }>;
  searchParams: Promise<{bottle?:string}>;
}) {
  const productId = Number((await params).id);
  const product = await prisma.product.findFirst({
    where: { id: productId },
    include: {
      fullBottles: {select:{id:true,volume:true,price:true,discountPrice:true,imageUrl:true,stockPieces:true,allowBackorder:true,available:true,dayOfferStartsAt:true,dayOfferEndsAt:true}},
      reviews: {
        include: {
          user: true,
          reply: true,
        },
      },
      productGroup: true,
      variations: {
        where: {
          available: true,
        },
      },
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

  if(product.bottleParentId) redirect("/"+(await params).locale+"/product/"+product.bottleParentId+"?bottle="+product.id);
  const {fullBottles,...base}=product;
  const bottles=[...(product.productGroupId===31 ? [product] : []), ...fullBottles].map(publicBottle).sort((a,b)=>a.ml-b.ml);
  const relatedReviews=await prisma.review.findMany({where:{productId:{in:[product.id,...fullBottles.map(b=>b.id)]}},include:{user:true,reply:true}});
  const requested=Number((await searchParams).bottle);
  const safeProduct = {
    ...base,
    name: fragranceName(base.name),
    reviews:relatedReviews,
    price: product.price.toNumber(),
    discountPrice: product.discountPrice?.toNumber() || null,
  };

  return (
    <Container className="flex flex-col mb-10 p-0 md:p-4">
      <BreadcrumbComponent
        className="mx-4 mb-4 md:mx-0"
        productBrand={product.brand}
        productName={safeProduct.name}
        productCategory={product.category}
        productGroup={product.productGroup}
      />
      <ChooseProductForm key={product.id+":"+requested} product={safeProduct} bottles={bottles} initialBottleId={requested} />
      <ProductRecommendations searchParams={safeProduct} />
      <ReviewsComponent className="my-8" product={safeProduct} />
      <RecentlyViewed excludeId={product.id} />
    </Container>
  );
}
