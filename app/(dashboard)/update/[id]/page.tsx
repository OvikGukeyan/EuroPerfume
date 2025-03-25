import { CreateMakeupForm, CreatePerfumeForm, Title } from "@/shared/components";

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

      {id === '1' && <CreatePerfumeForm />}
      {id === '2' && <CreateMakeupForm />}

    </div>
  );
}
