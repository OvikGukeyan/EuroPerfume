import { z } from "zod";

export const MAX_IMPORT_BYTES = 10 * 1024 * 1024;
const text = z.string().max(2000);
const inputRow = z.object({
  supplier: z.enum(["Nunu Trading", "perfumes-wholesale.eu"]),
  sku: z.string().trim().min(1).max(100), name: text.min(1), brand: text,
  cost: z.string().regex(/^\d{1,7}(\.\d{1,4})?$/),
  eans: z.array(z.string().max(30)).max(10), supplierStock: z.string().max(40).nullable(),
  volume: text, concentration: text.nullable().optional(), price2027: text.optional(),
  stockAsOf: text.nullable().optional(), candidateProductIds: z.array(z.number().int().positive()).max(100).optional(),
  issues: z.array(text).max(50).optional(),
});
export type Offer = z.infer<typeof inputRow> & { key: string; calculatedPrice: string; blockers: string[] };
export type Decision = { disposition: "pending" | "pilot" | "hold"; note: string };
const decisionSchema = z.object({ disposition: z.enum(["pending", "pilot", "hold"]), note: z.string().max(2000) });
const reviewSchema = z.object({ version: z.literal(1), kind: z.literal("supplier-review"), offers: z.array(inputRow).min(1).max(5000), decisions: z.record(decisionSchema) });
export function offerKey(row: Pick<Offer, "supplier" | "sku">) { return JSON.stringify([row.supplier, row.sku]); }

/** Round once, half up, using exact decimal arithmetic. */
export function recommendedPrice(cost: string): string {
  if (!/^\d{1,7}(\.\d{1,4})?$/.test(cost)) throw new Error("Invalid wholesale price");
  const [whole, fraction = ""] = cost.split(".");
  const units = BigInt(whole) * BigInt(10000) + BigInt(fraction.padEnd(4, "0"));
  if (units <= BigInt(0)) throw new Error("Wholesale price must be positive");
  const cents = ((units + BigInt(50000)) * BigInt(1547) + BigInt(50000)) / BigInt(100000);
  return `${cents / BigInt(100)}.${String(cents % BigInt(100)).padStart(2, "0")}`;
}
export function validGtin(value: string) {
  if (!/^(\d{8}|\d{12}|\d{13}|\d{14})$/.test(value)) return false;
  const sum = value.slice(0, -1).split("").reverse().reduce((s, n, i) => s + Number(n) * (i % 2 ? 1 : 3), 0);
  return (10 - sum % 10) % 10 === Number(value.slice(-1));
}
export function parseReview(raw: string): { offers: Offer[]; decisions: Record<string, Decision> } {
  if (new TextEncoder().encode(raw).byteLength > MAX_IMPORT_BYTES) throw new Error("File exceeds 10 MB");
  const value: unknown = JSON.parse(raw);
  const saved = Array.isArray(value) ? null : reviewSchema.parse(value);
  const rows = saved ? saved.offers : z.array(inputRow).min(1).max(5000).parse(value);
  const seen = new Set<string>();
  const offers = rows.map(row => {
    const key = offerKey(row);
    if (seen.has(key)) throw new Error(`Duplicate supplier SKU: ${row.sku}`);
    seen.add(key);
    const calculatedPrice = recommendedPrice(row.cost);
    const blockers = ["identity", "current_stock", "image", "inci", "image_rights", "catalog_mapping"];
    if (!row.eans.length || row.eans.some(e => !validGtin(e))) blockers.push("gtin");
    if (!row.stockAsOf) blockers.push("stock_date");
    if (!row.supplierStock || !/^(?:>\s*)?\d+$/.test(row.supplierStock) || /^0+$/.test(row.supplierStock)) blockers.push("stock_quantity");
    if (row.price2027 !== undefined && row.price2027 !== calculatedPrice) blockers.push("price_mismatch");
    if (row.issues?.length) blockers.push("source_issue");
    return { ...row, key, calculatedPrice, blockers };
  });
  const decisions: Record<string, Decision> = {};
  for (const row of offers) decisions[row.key] = saved?.decisions[row.key] ?? { disposition: "pending", note: "" };
  return { offers, decisions };
}
export function exportReview(offers: Offer[], decisions: Record<string, Decision>) {
  return JSON.stringify({ version: 1, kind: "supplier-review", status: "DRAFT", publish: false,
    ownStockPieces: 0, tax2026: { mode: "exempt", chargedVat: null },
    offers: offers.map(row => inputRow.parse(row)), decisions: z.record(decisionSchema).parse(decisions),
  }, null, 2);
}
export function reviewEnabled(env: { VERCEL_ENV?: string; SUPPLIER_IMPORT_REVIEW_ENABLED?: string }) {
  return (env.VERCEL_ENV === undefined || env.VERCEL_ENV === "development" || env.VERCEL_ENV === "preview") && env.SUPPLIER_IMPORT_REVIEW_ENABLED === "true";
}
