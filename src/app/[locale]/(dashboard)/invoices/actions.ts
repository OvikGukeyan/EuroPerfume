"use server";

import { issueManualInvoice, lookupManualInvoiceProducts } from "@/src/shared/server-lib/manual-invoice";

export async function searchInvoiceCatalog(query: string) {
  return lookupManualInvoiceProducts(query);
}

export async function createManualRechnung(input: unknown) {
  try {
    return { ok: true as const, ...await issueManualInvoice(input) };
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    const publicErrors = ["ORDER_DATE", "PRODUCT_VARIATION", "ZERO_SUBTOTAL", "REQUEST_ALREADY_EXISTS", "INVALID_TOTAL"];
    if (publicErrors.includes(message)) return { ok: false as const, error: message };
    if (/OSS/.test(message)) return { ok: false as const, error: "TAX_REVIEW" };
    if (/Дата поставки|Leistungsdatum/.test(message)) return { ok: false as const, error: "SUPPLY_DATE" };
    if (error instanceof Error && error.name === "ZodError") return { ok: false as const, error: "INVALID_INPUT" };
    console.error("[manual-invoice] issuance refused", error instanceof Error ? error.name : "Unknown");
    return { ok: false as const, error: "FAILED" };
  }
}
