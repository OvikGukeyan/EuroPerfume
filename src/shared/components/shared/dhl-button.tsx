"use client";
import { dhlCreateOrder } from "@/src/app/actions";
import { useTransition, useState, FC } from "react";
import { cn } from "../../lib/utils";
import { Button, Input } from "../ui";
import { File } from "lucide-react";
import { Title } from "..";
import { ShippingMethods } from "@prisma/client";

export type DhlCredantials = {
  shippingMethod: ShippingMethods;
  postOffice: string;
  packstationNumber: string;
  postNumber: string;
  orderId: number | undefined;
  deliveryFullNmae: string;
  addressStreet: string;
  addressHouse: string;
  postalCode: string;
  city: string;
  country: string;
  email: string;
  totalPrice: number;
};
interface Props extends DhlCredantials {
  className?: string;
  labelUrl?: string;
  trackingCode?: string;
}

export const DhlButton: FC<Props> = ({
  className,
  labelUrl,
  trackingCode,
  ...props
}) => {
  const [pending, start] = useTransition();
  const [result, setResult] = useState<any>(null);
  const [weight, setWeight] = useState(0);

  // const handleCreate = async () => {
  //   try {
  //     await Api.dhl.createShipment(props);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  return (
    <div className={cn("", className)}>
      {result?.ok || labelUrl ? (
        <>
          <Title text="Отправление создано" size="sm" className="font-bold" />
          <p className="font-bold mb-2">
            Трек номер: <span>{trackingCode}</span>
          </p>
          <a href={result?.labelUrl || labelUrl || ""} download target="_blank">
            <Button className="flex gap-2" variant="outline">
              <span>Скачать метку</span>
              <File />
            </Button>
          </a>
        </>
      ) : (
        <div className="flex flex-col gap-3 w-[300px]">
          <Input placeholder="Вес в кг" onChange={(e) => setWeight(Number(e.target.value))} />
          <Button
            disabled={pending}
            onClick={() =>
              start(async () => setResult(await dhlCreateOrder(props, weight)))
            }
          >
            {pending ? "Creating…" : "Create DHL order"}
          </Button>
        </div>
      )}
      {/* {result && (
        <pre className="mt-4 p-3 bg-gray-100 text-xs overflow-auto">
          {JSON.stringify(result.body, null, 2)}
        </pre>
      )} */}
    </div>
  );
};
