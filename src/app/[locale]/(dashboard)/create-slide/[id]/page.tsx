import { CreateSlideForm } from "@/src/shared/components";

export default async function CreateSlide({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <CreateSlideForm id={id} />;
}
