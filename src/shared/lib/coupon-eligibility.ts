import { BLACK_FRIDAY, couponDiscountCents, isBlackFridayCode } from "./black-friday";

/** Pure shared coupon policy, used by both checkout and server snapshots. */
export type CouponLine = {
  productId: number;
  grossCents: number;
  excluded: boolean;
};
export type GiftPromotionEligibility = {
  eligible: boolean;
  productIds: readonly number[];
};
/** A gift offer excludes its required products only while it actually qualifies. */
export function giftPromotionProductIds(promotions: readonly GiftPromotionEligibility[]): Set<number> {
  return new Set(promotions.filter(p => p.eligible).flatMap(p => p.productIds));
}
export function couponQuote(lines: readonly CouponLine[], percent: number, code?: string) {
  if (!Number.isInteger(percent) || percent < 0 || percent > 100) throw new Error("Invalid coupon percentage");
  if (lines.some(l => !Number.isSafeInteger(l.grossCents) || l.grossCents < 0)) throw new Error("Invalid coupon line");
  const eligibleCents = lines.filter(l => !l.excluded).reduce((s,l) => s + l.grossCents,0);
  const excludedCents = lines.filter(l => l.excluded).reduce((s,l) => s + l.grossCents,0);
  const meetsMinimum = !isBlackFridayCode(code) || eligibleCents >= BLACK_FRIDAY.minimumEligibleCents;
  const discountCents = meetsMinimum ? couponDiscountCents(eligibleCents,percent) : 0;
  return {eligibleCents,excludedCents,discountCents,meetsMinimum,hasExclusions:excludedCents>0};
}
