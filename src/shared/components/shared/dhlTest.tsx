"use client";
import { dhlTestCreateOrder } from "@/src/app/actions";
import { useTransition, useState } from "react";

export function DhlTestButton() {
  const [pending, start] = useTransition();
  const [result, setResult] = useState<any>(null);

  return (
    <div>
      <button
        disabled={pending}
        onClick={() => start(async () => setResult(await dhlTestCreateOrder()))}
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
