"use client";
import { useEffect, useState } from "react";
import type { TaxPolicy } from "../lib/tax";

// The server clock controls the change, including tabs open across midnight.
export function useTaxPolicy() {
  const [policy, setPolicy] = useState<TaxPolicy | null>(null);
  useEffect(() => {
    let active = true;
    let boundary: ReturnType<typeof setTimeout> | undefined;
    const controller = new AbortController();
    async function refresh() {
      try {
        const response = await fetch("/api/tax-policy", { cache: "no-store", signal: controller.signal });
        if (!response.ok) return;
        const value = await response.json();
        if (!active || !["exempt", "vat"].includes(value.mode)) return;
        setPolicy({ mode: value.mode, rateBasisPoints: value.rateBasisPoints });
        clearTimeout(boundary);
        if (value.remainingMs > 0 && value.remainingMs < 60000) boundary = setTimeout(refresh, value.remainingMs + 100);
      } catch { /* Retain the last server result when offline. */ }
    }
    void refresh();
    const interval = setInterval(refresh, 60000);
    const visible = () => { if (document.visibilityState === "visible") void refresh(); };
    document.addEventListener("visibilitychange", visible);
    return () => { active = false; controller.abort(); clearInterval(interval); clearTimeout(boundary); document.removeEventListener("visibilitychange", visible); };
  }, []);
  return policy;
}
