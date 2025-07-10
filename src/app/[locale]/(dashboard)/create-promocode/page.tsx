import { CreatePromocodeForm, Title } from "@/src/shared/components";

export default function CreatePromocode() {
  return (
    <div className="px-2 md:px-10 mb-10">
      <Title className="mb-5" text="Создание промокода" />
      <CreatePromocodeForm />
    </div>
  );
}
