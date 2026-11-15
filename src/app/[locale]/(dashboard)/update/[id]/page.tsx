import { FullBottleEditor } from "@/src/shared/components/shared/full-bottle-editor";
import { publicBottle } from "@/src/shared/lib/full-bottle";
import { redirect } from "next/navigation";
import { updateProduct } from "@/src/app/actions";
import { CreateProductForm, Title } from "@/src/shared/components";

import { prisma } from "@/prisma/prisma-client";

export default async function Update({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id,locale } = await params;
  const product = await prisma.product.findFirst({
    where: {
      id: Number(id),
    },
    include: {
      fullBottles: {orderBy:{id:"asc"}},
      productGroup: true,
      translations: true,
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
    },
  });

  if (!product) {
    return;
    <h1>Product not found</h1>;
  }

  if(product.bottleParentId) redirect("/"+locale+"/update/"+product.bottleParentId+"#full-bottles");
  const {fullBottles,...base}=product;
  const safeProduct = {
    ...base,
    price: product.price.toNumber(),
    discountPrice: product.discountPrice?.toNumber() || null,
  };

  return (
    <div className=" px-10 mb-10">
      <Title className="mb-5" text="Update product" />

      {product.productGroup.onTap && <FullBottleEditor parentId={product.id} bottles={fullBottles.map(b=>({...publicBottle(b),stock:b.stockPieces,version:b.updatedAt.toISOString()})).sort((a,b)=>a.ml-b.ml)}/>}
      <CreateProductForm
        product={safeProduct}
        submitFunction={updateProduct}
        categoryId={product.categoryId}
      />
    </div>
  );
}
