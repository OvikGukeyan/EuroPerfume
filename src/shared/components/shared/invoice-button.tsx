"use client";
import { createInvoice } from "@/src/app/actions";
import { useTransition, useState, FC } from "react";
import { cn } from "../../lib/utils";
import { Button } from "../ui";
import { File } from "lucide-react";
import { Title } from "..";


interface Props  {
  className?: string;
  invoiceUrl?: string;
  id: number
}

export const InvoiceButton: FC<Props> = ({
  className,
  invoiceUrl,
  id
}) => {
  const [pending, start] = useTransition();
  const [result, setResult] = useState<any>(null);


  return (
    <div className={cn("", className)}>
      {result?.ok || invoiceUrl ? (
        <>
          <Title text="Отправление создано" size="sm" className="font-bold" />
          
          <a href={result?.invoiceUrl || invoiceUrl || ""} download target="_blank">
            <Button className="flex gap-2" variant="outline">
              <span>Скачать счет</span>
              <File />
            </Button>
          </a>
        </>
      ) : (
        <div className="flex flex-col gap-3 w-[300px]">
          <Button
            disabled={pending}
            onClick={() =>
              start(async () => setResult(await createInvoice(id)))
            }
          >
            {pending ? "Creating…" : "Create invoice"}
          </Button>
        </div>
      )}
      {result && (
        <pre className="mt-4 p-3 bg-gray-100 text-xs overflow-auto">
          {JSON.stringify(result.body, null, 2)}
        </pre>
      )}
    </div>
  );
};
