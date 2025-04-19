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
      productNotes: {
        include: {
          note: true,
        },
      },
      brand: true
    }
  });

  

  if (!product) {
    return 
    <h1>Product not found</h1>;
  }

  const safeProduct = {
    ...product,
    price: product.price.toNumber(),
  };
  
  return (
    <div className=" px-10 mb-10">
      <Title className="mb-5" text="Update product" />

      {product.categoryId === 1 && <CreatePerfumeForm product={safeProduct} submitFunction={updateProduct}/>}
      {product.categoryId === 2 && <CreateMakeupForm product={safeProduct} submitFunction={updateProduct}/>}

    </div>
  );
}
