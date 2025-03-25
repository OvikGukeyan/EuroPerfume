import { CreateMakeupForm, CreatePerfumeForm, Title } from "@/shared/components/shared";

export default async function Create({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const { id } = await params;

  return (
    <div className=" px-10 mb-10">
      <Title className="mb-5" text="Create new Product" />

      {id === '1' && <CreatePerfumeForm />}
      {id === '2' && <CreateMakeupForm />}

    </div>
  );
}
