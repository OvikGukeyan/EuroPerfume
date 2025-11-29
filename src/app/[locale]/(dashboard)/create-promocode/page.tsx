import { prisma } from "@/prisma/prisma-client";
import {
  CreatePromocodeForm,
  PromoTable,
  Title,
} from "@/src/shared/components";

export default async function CreatePromocode() {
  const promocodes = await prisma.promoCode.findMany();
  return (
    <div className="flex flex-col md:flex-row gap-10 px-2 md:px-10 mb-10">
      <div>
        <Title className="mb-5" text="Создание промокода" />
        <CreatePromocodeForm />
      </div>

      <PromoTable items={promocodes} />
    </div>
  );
}
