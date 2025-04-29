import { createProduct } from "@/src/app/actions";
import { CreateProductForm, Title } from "@/src/shared/components";

export default async function Create({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className=" px-2 md:px-10 mb-10">
      <Title className="mb-5" text="Create new Product" />

      <CreateProductForm submitFunction={createProduct} categoryId={Number(id)} />
    </div>
  );
}
