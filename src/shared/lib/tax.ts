import { couponQuote } from "./coupon-eligibility";
import { pointRedemptionQuote } from "./loyalty-arithmetic";
import { offerPrices, type DayOfferWindow } from "./day-offer";
import { z } from "zod";
import { TAX_SETTINGS } from "@/src/config/tax";
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
  subtotalGrossCents: amountSchema, shippingGrossCents: amountSchema, discountGrossCents: amountSchema, loyaltyDiscountCents: amountSchema.optional(), totalGrossCents: amountSchema,
  lines: z.array(z.object({ productId: z.number().int(), variationId: z.number().int().nullable(), title: z.string(), quantity: z.number().int().positive(), onTap: z.boolean(), grossCents: amountSchema, regularGrossCents: amountSchema.optional(), dayOfferPercent: z.literal(10).optional(), couponExcluded: z.boolean().optional() })),
});
export type PricingSnapshot = z.infer<typeof pricingSchema>;
type PriceableItem = { productId: number; variationId: number | null; quantity: number; product: DayOfferWindow & { name: string; price: { toString(): string } | number; discountPrice: { toString(): string } | number | null; brand?: { name: string }; productGroup?: { onTap: boolean | null } | null } };

export function capturePricing(
  items: PriceableItem[], country: string, discount = 0, at = new Date(),
  policy = taxPolicyAt(at,country), _legacyExcludeDiscounted = false,
  giftProductIds: ReadonlySet<number> = new Set(), couponCode?: string
): PricingSnapshot {
  if (!Number.isInteger(discount) || discount < 0 || discount > 100) throw new Error("Invalid discount");
  const lines = items.map(item => {
    const onTap = Boolean(item.product.productGroup?.onTap);
    const price = offerPrices(item.product,item.quantity,onTap,at.getTime());
    const activeDayOffer = Boolean(item.product.dayOfferStartsAt && item.product.dayOfferEndsAt &&
      at.getTime() >= new Date(item.product.dayOfferStartsAt).getTime() &&
      at.getTime() < new Date(item.product.dayOfferEndsAt).getTime());
    const couponExcluded = price.discounted || activeDayOffer || giftProductIds.has(item.productId);
    return {
      productId:item.productId, variationId:item.variationId,
      title:`${item.product.brand?.name ? item.product.brand.name + " | " : ""}${item.product.name}`,
      quantity:item.quantity, onTap, grossCents:cents(price.effective),
      couponExcluded,
      ...(price.dayOffer ? {regularGrossCents:cents(price.regular),dayOfferPercent:10 as const} : {})
    };
  });
  const subtotalGrossCents=lines.reduce((sum,line)=>sum+line.grossCents,0);
  // Delivery threshold uses the pre-coupon merchandise subtotal; shipping is never discounted.
  const deliveryPrice=calcTotlalAmountWithDelivery(subtotalGrossCents/100,country,0).deliveryPrice;
  const shippingGrossCents=cents(deliveryPrice);
  const discountGrossCents=couponQuote(lines.map(l=>({productId:l.productId,grossCents:l.grossCents,excluded:l.couponExcluded})),discount,couponCode,at.getTime()).discountCents;
  const totalGrossCents=subtotalGrossCents+shippingGrossCents-discountGrossCents;
  return {version:1,country,capturedAt:at.toISOString(),policy,lines,subtotalGrossCents,shippingGrossCents,discountGrossCents,totalGrossCents};
}
export function readPricing(value: unknown): PricingSnapshot | null {
  const result = pricingSchema.safeParse(value);
  if (!result.success) return null;
  const p = result.data;
  if (p.subtotalGrossCents + p.shippingGrossCents - p.discountGrossCents - (p.loyaltyDiscountCents ?? 0) !== p.totalGrossCents || p.lines.reduce((sum, l) => sum + l.grossCents, 0) !== p.subtotalGrossCents) return null;
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

/** Preserve the prices accepted in a submitted enquiry when an admin edits it. */
export function reviseOrderPricing(items: PriceableItem[], country: string, discount: number, at: Date, previous: PricingSnapshot | null) {
  if (!previous) return capturePricing(items, country, discount, at);
  // Points are reserved at enquiry time. Before Invoice, edits may only RELEASE
  // excess points; increasing the reservation without buyer approval is forbidden.
  // Preserve saved historic exclusion flags; do not re-qualify old orders with today's rules.
  // Apply the price era of the original enquiry, not the time an admin opens it.
  const quotedAt = new Date(previous.capturedAt);
  const revised = capturePricing(items,country,discount,quotedAt,previous.policy,false);
  const vatFactor = quotedAt.getTime() >= Date.parse(TAX_SETTINGS.VAT_START_AT)
    ? (10000 + TAX_SETTINGS.GERMAN_RATE_BASIS_POINTS) / 10000 : 1;
  revised.lines = revised.lines.map(line => {
    const old = previous.lines.find(l => l.productId === line.productId && l.variationId === line.variationId);
    if (!old) return line;
    if (old.quantity === line.quantity) return old;
    const packaging = (q:number) => old.onTap ? (q<=10?1:q<=20?2:q<=30?3:q<=40?4:5) : 0;
    // Undo the line uplift in cents before separating the original atomizer
    // charge; otherwise a volume change would leave part of that charge in €/ml.
    const oldBaseCents = Math.round((old.regularGrossCents ?? old.grossCents) / vatFactor);
    const perUnitCents = (oldBaseCents - 100 * packaging(old.quantity)) / old.quantity;
    const baseCents = Math.round(perUnitCents * line.quantity + 100 * packaging(line.quantity));
    const regularGrossCents = Math.round(baseCents * vatFactor);
    return { ...old, quantity:line.quantity, grossCents:old.dayOfferPercent ? Math.round(Math.round(baseCents*90/100)*vatFactor) : regularGrossCents,
      ...(old.dayOfferPercent ? {regularGrossCents} : {}) };
  });
  revised.subtotalGrossCents = revised.lines.reduce((sum,l)=>sum+l.grossCents,0);
  const shipping=calcTotlalAmountWithDelivery(revised.subtotalGrossCents/100,country,0);
  revised.shippingGrossCents=cents(shipping.deliveryPrice);
  const excluded=previous.lines.some(l=>l.couponExcluded!==undefined);
  revised.discountGrossCents=couponQuote(revised.lines.map(l=>({
    productId:l.productId,grossCents:l.grossCents,
    excluded:excluded ? Boolean(l.couponExcluded) : false
  })),discount).discountCents;
  const oldReserved=previous.loyaltyDiscountCents??0;
  if(oldReserved>0){
    const eligibleAfterCoupon=Math.max(0,revised.lines.filter(l=>!l.couponExcluded).reduce((sum,l)=>sum+l.grossCents,0)-revised.discountGrossCents);
    const {spendPoints}=pointRedemptionQuote({balancePoints:oldReserved,eligibleAfterCouponCents:eligibleAfterCoupon});
    revised.loyaltyDiscountCents=spendPoints;
  }
  revised.totalGrossCents=revised.subtotalGrossCents+revised.shippingGrossCents-revised.discountGrossCents-(revised.loyaltyDiscountCents??0);
  return revised;
}
