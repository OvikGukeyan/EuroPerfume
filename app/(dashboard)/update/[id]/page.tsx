import { CreateProductForm, Title } from "@/shared/components";

import { prisma } from "@/prisma/prisma-client";
import { CreateProductFormValues } from "@/shared/constants/create-product-schema";
import { updateProduct } from "@/app/actions";
import { redirect } from "next/navigation";

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

  const onSubmit = async (data: FormData & CreateProductFormValues) => {
    'use server';

    await updateProduct(data, Number(id));
    redirect('/products')
  };

  if (!product) {
    return 
    <h1>Product not found</h1>;
  }
  
  return (
    <div className=" px-10 mb-10">
      <Title className="mb-5" text="Update product" />

      <CreateProductForm submitFunction={onSubmit} product={product}/>
    </div>
  );
}
