import { updateProduct } from "@/src/app/actions";
import { CreateProductForm, Title } from "@/src/shared/components";

import { prisma } from "@/prisma/prisma-client";

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
      translations: true,
      aromas: true,
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

  const safeProduct = {
    ...product,
    price: product.price.toNumber(),
  };

  return (
    <div className=" px-10 mb-10">
      <Title className="mb-5" text="Update product" />

      <CreateProductForm
        product={safeProduct }
        submitFunction={updateProduct}
        categoryId={product.categoryId}
      />
    </div>
  );
}
