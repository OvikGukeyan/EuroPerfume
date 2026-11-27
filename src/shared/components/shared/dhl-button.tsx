"use client";
import { dhlCreateOrder } from "@/src/app/actions";
import { useId, useTransition, useState, FC } from "react";
import { cn } from "../../lib/utils";
import { Button, Checkbox, Input } from "../ui";
import { File } from "lucide-react";
import { ShippingMethods } from "@prisma/client";
import { Label } from "../ui/label";

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
  ru: boolean;
  labelUrl?: string;
  trackingCode?: string;
}

export const DhlButton: FC<Props> = ({
  className,
  ru,
  labelUrl,
  trackingCode,
  ...props
}) => {
  const [pending, start] = useTransition();
  const [result, setResult] = useState<any>(null);
  const [weight, setWeight] = useState(0);
  const [small, setSmall] = useState(false);

  const fieldId = useId();
  const savedLabel = result?.labelUrl || labelUrl;

  return (
    <section className={cn("flex min-w-0 flex-col gap-3 rounded-lg border bg-white p-4", className)}>
      <h2 className="text-sm font-semibold">{ru ? "Отправление DHL" : "DHL-Sendung"}</h2>
      {result?.ok || labelUrl ? (
        <>
          <p className="text-sm">{ru ? "Отправление создано" : "Sendung erstellt"}</p>
          {trackingCode && (
            <p className="break-all text-xs text-neutral-600">
              {ru ? "Трек-номер" : "Sendungsnummer"}: <span className="font-medium">{trackingCode}</span>
            </p>
          )}
          {savedLabel && (
            <Button asChild className="mt-auto h-10 w-full gap-2" variant="outline">
              <a href={savedLabel} download target="_blank" rel="noopener noreferrer">
                <File size={16} aria-hidden="true" />
                {ru ? "Скачать этикетку" : "Versandetikett herunterladen"}
              </a>
            </Button>
          )}
        </>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <Checkbox
              id={`${fieldId}-small`}
              checked={small}
              onCheckedChange={(checked) => setSmall(checked === true)}
              disabled={props.country !== "DEU"}
            />
            <Label htmlFor={`${fieldId}-small`}>Kleinpaket</Label>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor={`${fieldId}-weight`}>{ru ? "Вес, кг" : "Gewicht, kg"}</Label>
            <Input
              id={`${fieldId}-weight`}
              inputMode="decimal"
              className="h-10 w-full"
              onChange={(e) => setWeight(Number(e.target.value))}
            />
          </div>
          <Button
            type="button"
            className="mt-auto h-10 w-full"
            disabled={pending}
            onClick={() =>
              start(async () => setResult(await dhlCreateOrder(props, weight, small)))
            }
          >
            {pending
              ? (ru ? "Создаю…" : "Wird erstellt…")
              : (ru ? "Создать отправление DHL" : "DHL-Sendung erstellen")}
          </Button>
        </>
      )}
    </section>
  );
};
