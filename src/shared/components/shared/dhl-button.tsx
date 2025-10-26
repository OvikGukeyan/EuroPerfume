"use client";
import { dhlCreateOrder } from "@/src/app/actions";
import { useTransition, useState, FC } from "react";
import { cn } from "../../lib/utils";
import { Api } from "../../services/api-client";
import { Button } from "../ui";
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

  const handleCreate = async () => {
    try {
      await Api.dhl.createShipment(props);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={cn("", className)}>
      {(result?.ok || labelUrl ) ? (
        <>
          <Title text="Отправление создано" size="sm" className="font-bold" />
          <p className="font-bold mb-2">
            Трек номер: <span>{trackingCode}</span>
          </p>
          <a href={result?.labelUrl || labelUrl || ""}  download target="_blank">
            <Button className="flex gap-2" variant="outline">
              <span>Скачать метку</span>
              <File />
            </Button>
          </a>
        </>
      ) : (
        <Button
          disabled={pending}
          onClick={() =>
            start(async () => setResult(await dhlCreateOrder(props)))
          }
          // className="px-4 py-2 rounded bg-black text-white"
        >
          {pending ? "Creating…" : "Create DHL order"}
        </Button>
      )}
      {result && (
        <pre className="mt-4 p-3 bg-gray-100 text-xs overflow-auto">
          {JSON.stringify(result.body, null, 2)}
        </pre>
      )}

      {/* {result && (
        <pre className="mt-4 p-3 bg-gray-100 text-xs overflow-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      )} */}
    </div>
  );
};
