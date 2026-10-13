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
  const [supplyDate, setSupplyDate] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);


  return (
    <div className={cn("", className)}>
      {result?.ok || invoiceUrl ? (
        <>
          <Title text="Счет создан" size="sm" className="font-bold" />
          
          <a href={result?.invoiceUrl || invoiceUrl || ""} download target="_blank">
            <Button className="flex gap-2" variant="outline">
              <span>Скачать счет</span>
              <File />
            </Button>
          </a>
        </>
      ) : (
        <div className="flex flex-col gap-3 w-[300px]">
          <label htmlFor={`invoice-supply-date-${id}`} className="text-sm">Дата фактической поставки / Leistungsdatum</label>
          <input id={`invoice-supply-date-${id}`} type="date" required value={supplyDate} onChange={e => setSupplyDate(e.target.value)} className="rounded border p-2" />
          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
          <Button
            disabled={pending || !supplyDate}
            onClick={() =>
              start(async () => { setError(""); try { const response = await createInvoice(id, supplyDate); if (response.ok) setResult(response); else setError(response.message ?? "Не удалось создать счёт"); } catch (e) { setError(e instanceof Error ? e.message : "Не удалось создать счёт"); } })
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
