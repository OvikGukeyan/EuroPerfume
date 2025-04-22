import { createProduct } from "@/app/actions";
import { CreateProductForm, Title } from "@/shared/components/shared";

export default async function Create({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className=" px-10 mb-10">
      <Title className="mb-5" text="Create new Product" />

      <CreateProductForm submitFunction={createProduct} categoryId={Number(id)} />
    </div>
  );
}
