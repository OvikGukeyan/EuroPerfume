import { z } from "zod";
import { TAX_SETTINGS } from "@/src/config/tax";
import { calcCartItemTotalPrice } from "./calc-cart-item-total-price";
import { calcTotlalAmountWithDelivery, euCountriesAlpha3 } from "./calc-total-amount-with-delivery";

export type TaxPolicy = { mode: "exempt" | "vat" | "review"; rateBasisPoints: number | null };
export function taxPolicyAt(at: Date, country = "DEU"): TaxPolicy {
  if (!Number.isFinite(at.getTime())) throw new Error("Invalid tax date");
  if (at.getTime() < new Date(TAX_SETTINGS.VAT_START_AT).getTime()) return { mode: "exempt", rateBasisPoints: 0 };
  if (country === "DEU" || (TAX_SETTINGS.EU_VAT_MODE === "origin" && euCountriesAlpha3.includes(country))) {
    return { mode: "vat", rateBasisPoints: TAX_SETTINGS.GERMAN_RATE_BASIS_POINTS };
  }
  return { mode: "review", rateBasisPoints: null };
}

export function cents(value: number): number {
  if (!Number.isFinite(value) || value < 0 || value > Number.MAX_SAFE_INTEGER / 100) throw new Error("Invalid amount");
  return Math.round((value + Number.EPSILON) * 100);
}
export function splitGross(grossCents: number, rateBasisPoints: number) {
  if (!Number.isSafeInteger(grossCents) || grossCents < 0 || !Number.isInteger(rateBasisPoints) || rateBasisPoints < 0 || rateBasisPoints > 3000) throw new Error("Invalid tax amount or rate");
  const netCents = Math.round(grossCents * 10000 / (10000 + rateBasisPoints));
  return { grossCents, netCents, vatCents: grossCents - netCents };
}

const policySchema = z.object({ mode: z.enum(["exempt", "vat", "review"]), rateBasisPoints: z.number().int().min(0).max(3000).nullable() });
const amountSchema = z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER);
export const pricingSchema = z.object({
  version: z.literal(1), country: z.string(), capturedAt: z.string().datetime(), policy: policySchema,
  subtotalGrossCents: amountSchema, shippingGrossCents: amountSchema, discountGrossCents: amountSchema, totalGrossCents: amountSchema,
  lines: z.array(z.object({ productId: z.number().int(), variationId: z.number().int().nullable(), title: z.string(), quantity: z.number().int().positive(), onTap: z.boolean(), grossCents: amountSchema })),
});
export type PricingSnapshot = z.infer<typeof pricingSchema>;
type PriceableItem = { productId: number; variationId: number | null; quantity: number; product: { name: string; price: { toString(): string } | number; discountPrice: { toString(): string } | number | null; brand?: { name: string }; productGroup?: { onTap: boolean | null } | null } };

export function capturePricing(items: PriceableItem[], country: string, discount = 0, at = new Date(), policy = taxPolicyAt(at, country)): PricingSnapshot {
  if (!Number.isInteger(discount) || discount < 0 || discount > 100) throw new Error("Invalid discount");
  const lines = items.map(item => ({
    productId: item.productId, variationId: item.variationId,
    title: `${item.product.brand?.name ? item.product.brand.name + " | " : ""}${item.product.name}`,
    quantity: item.quantity, onTap: Boolean(item.product.productGroup?.onTap),
    grossCents: cents(calcCartItemTotalPrice(Number(item.product.price), item.quantity, Boolean(item.product.productGroup?.onTap), Number(item.product.discountPrice) || undefined)),
  }));
  const subtotalGrossCents = lines.reduce((sum, item) => sum + item.grossCents, 0);
  const { totalAmountWithDelivery, deliveryPrice } = calcTotlalAmountWithDelivery(subtotalGrossCents / 100, country, discount);
  const shippingGrossCents = cents(deliveryPrice), totalGrossCents = cents(totalAmountWithDelivery);
  return { version: 1, country, capturedAt: at.toISOString(), policy, lines, subtotalGrossCents, shippingGrossCents, totalGrossCents, discountGrossCents: subtotalGrossCents + shippingGrossCents - totalGrossCents };
}
export function readPricing(value: unknown): PricingSnapshot | null {
  const result = pricingSchema.safeParse(value);
  if (!result.success) return null;
  const p = result.data;
  if (p.subtotalGrossCents + p.shippingGrossCents - p.discountGrossCents !== p.totalGrossCents || p.lines.reduce((sum, l) => sum + l.grossCents, 0) !== p.subtotalGrossCents) return null;
  return p;
}

export function berlinDate(at: Date): string { return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Berlin", year: "numeric", month: "2-digit", day: "2-digit" }).format(at); }
export function validateSupplyDate(value: string, orderCreatedAt: Date, now = new Date()): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error("Укажите дату фактической поставки / Leistungsdatum");
  const date = new Date(`${value}T12:00:00Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value || value < berlinDate(orderCreatedAt) || value > berlinDate(now)) throw new Error("Дата поставки должна быть между датой заказа и сегодняшним днём");
  return date;
}
export function invoiceTax(pricing: PricingSnapshot, supplyDate: Date) {
  const policy = taxPolicyAt(supplyDate, pricing.country);
  if (policy.mode === "review" || policy.rateBasisPoints === null) throw new Error("Для этой страны нужно настроить режим НДС/OSS перед созданием счёта");
  return { ...policy, ...splitGross(pricing.totalGrossCents, policy.rateBasisPoints), supplyDate: supplyDate.toISOString().slice(0, 10) };
}

export function deliveryCountryForCheckout(data: { shippingMethod: string; country: string; deliveryCountry?: string }) {
  return data.shippingMethod === "BILLING_ADDRESS" ? data.country : data.deliveryCountry || data.country;
}
