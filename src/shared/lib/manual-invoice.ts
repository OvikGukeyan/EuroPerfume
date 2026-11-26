import { z } from "zod";
import { euCountriesAlpha3 } from "./calc-total-amount-with-delivery";
import { berlinDate, invoiceTax, taxPolicyAt, validateSupplyDate, type PricingSnapshot } from "./tax";

export const MANUAL_ORDER_PREFIX = "manual-invoice:";
const singleLine = (max: number) => z.string().trim().min(1).max(max).regex(/^[^\u0000-\u001f\u007f]+$/);
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const money = z.number().int().min(0).max(10_000_000);
export const manualInvoiceInput = z.object({
  requestId: z.string().uuid(),
  customer: z.object({
    name: singleLine(100), street: singleLine(100), house: singleLine(20),
    zip: singleLine(16), city: singleLine(80),
    country: z.string().refine(code => euCountriesAlpha3.includes(code)),
    email: z.union([z.literal(""), z.string().trim().email().max(254)]),
  }),
  orderDate: date,
  supplyDate: date,
  shippingCents: money,
  rows: z.array(z.object({
    productId: z.number().int().positive().max(2_147_483_647),
    variationId: z.number().int().positive().max(2_147_483_647).nullable(),
    quantity: z.number().int().min(1).max(500),
    grossCents: money,
  })).min(1).max(30),
});
export type ManualInvoiceInput = z.infer<typeof manualInvoiceInput>;
export type ManualInvoiceCatalogItem = {
  id: number; title: string; onTap: boolean; price: number; imageUrl?: string | null;
  variations: { id: number; name: string }[];
};

export function euroInputToCents(value: string): number {
  const normalized = value.trim().replace(",", ".");
  if (!/^\d{1,6}(\.\d{1,2})?$/.test(normalized)) return NaN;
  const [euros, fraction = ""] = normalized.split(".");
  return Number(euros) * 100 + Number(fraction.padEnd(2, "0"));
}

export function prepareManualPricing(input: ManualInvoiceInput, products: ManualInvoiceCatalogItem[], now: Date) {
  const orderDate = new Date(input.orderDate + "T12:00:00Z");
  if (!Number.isFinite(orderDate.getTime()) || orderDate.toISOString().slice(0, 10) !== input.orderDate || input.orderDate > berlinDate(now)) {
    throw new Error("ORDER_DATE");
  }
  const supplyDate = validateSupplyDate(input.supplyDate, orderDate, now);
  const byId = new Map(products.map(product => [product.id, product]));
  const lines = input.rows.map(row => {
    const product = byId.get(row.productId);
    const variation = product?.variations.find(entry => entry.id === row.variationId);
    if (!product || (product.variations.length > 0 && !variation) || (row.variationId !== null && !variation)) {
      throw new Error("PRODUCT_VARIATION");
    }
    return {
      ...row,
      title: product.title + (variation ? " · " + variation.name : ""),
      onTap: product.onTap,
    };
  });
  const subtotalGrossCents = lines.reduce((sum, line) => sum + line.grossCents, 0);
  if (!subtotalGrossCents) throw new Error("ZERO_SUBTOTAL");
  const country = input.customer.country;
  const pricing: PricingSnapshot = {
    version: 1, country, capturedAt: now.toISOString(), policy: taxPolicyAt(orderDate, country),
    subtotalGrossCents, shippingGrossCents: input.shippingCents, discountGrossCents: 0,
    totalGrossCents: subtotalGrossCents + input.shippingCents, lines,
  };
  return { pricing, orderDate, tax: invoiceTax(pricing, supplyDate) };
}
