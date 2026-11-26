import { blackFridayActive, blackFridayPercent, couponDiscountCents, isBlackFridayCode } from "./black-friday";

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
export function couponQuote(lines: readonly CouponLine[], percent: number, code?: string, now = Date.now()) {
  if (!Number.isInteger(percent) || percent < 0 || percent > 100) throw new Error("Invalid coupon percentage");
  if (lines.some(l => !Number.isSafeInteger(l.grossCents) || l.grossCents < 0)) throw new Error("Invalid coupon line");
  const eligibleCents = lines.filter(l => !l.excluded).reduce((s,l) => s + l.grossCents,0);
  const excludedCents = lines.filter(l => l.excluded).reduce((s,l) => s + l.grossCents,0);
  const blackFriday = isBlackFridayCode(code);
  const percentage = blackFriday ? (blackFridayActive(now) ? blackFridayPercent(eligibleCents) : 0) : percent;
  const meetsMinimum = !blackFriday || percentage > 0;
  const discountCents = couponDiscountCents(eligibleCents,percentage);
  return {eligibleCents,excludedCents,discountCents,percentage,meetsMinimum,hasExclusions:excludedCents>0};
}
