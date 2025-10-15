"use client";
import { dhlTestCreateOrder } from "@/src/app/actions";
import { useTransition, useState, FC } from "react";
import { cn } from "../../lib/utils";

export type DhlCredantials = {
  orderId: number | undefined
  deliveryFullNmae: string
  addressStreet: string
  addressHouse: string
  postalCode: string
  city: string
  country: string
  email: string
}
interface Props extends DhlCredantials {
  className?: string
}

export const DhlTestButton: FC<Props> = ({className, ...props}) => {
  const [pending, start] = useTransition();
  const [result, setResult] = useState<any>(null);

  return (
    <div className={cn("", className)}>
      <button
        disabled={pending}
        onClick={() => start(async () => setResult(await dhlTestCreateOrder(props)))}
        className="px-4 py-2 rounded bg-black text-white"
      >
        {pending ? "Testing…" : "Test DHL order"}
      </button>

      {result && (
        <pre className="mt-4 p-3 bg-gray-100 text-xs overflow-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
