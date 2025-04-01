import { CreateMakeupForm, CreatePerfumeForm, Title } from "@/shared/components";

import { prisma } from "@/prisma/prisma-client";
import { updateProduct } from "@/app/actions";

export default async function Update({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findFirst({
    where: {
      id: Number(id),
    },
    include: {
      translations: {
        where: {
          language: "DE",
        },
      },
    }
  });

  

  if (!product) {
    return 
    <h1>Product not found</h1>;
  }
  
  return (
    <div className=" px-10 mb-10">
      <Title className="mb-5" text="Update product" />

      {product.categoryId === 1 && <CreatePerfumeForm product={product} submitFunction={updateProduct}/>}
      {product.categoryId === 2 && <CreateMakeupForm product={product} submitFunction={updateProduct}/>}

    </div>
  );
}
