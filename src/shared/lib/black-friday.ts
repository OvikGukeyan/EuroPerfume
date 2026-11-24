/** 27 November 2026, midnight to midnight in Europe/Berlin (CET). */
export const BLACK_FRIDAY = {
  code: "BLACK15", discount: 15,
  // Fail closed: no campaign variants currently have a verified 30-day reference price.
  enabled: false,
  bannerStartsAt: "2026-11-26T18:00:00+01:00",
  startsAt: "2026-11-27T00:00:00+01:00",
  endsAt: "2026-11-28T00:00:00+01:00",
} as const;
/** Keep the verified schedule independent of the campaign release gate. */
export function blackFridayWithinWindow(now: number, phase: "banner" | "coupon"): boolean {
  const startsAt = phase === "banner" ? BLACK_FRIDAY.bannerStartsAt : BLACK_FRIDAY.startsAt;
  return now >= Date.parse(startsAt) && now < Date.parse(BLACK_FRIDAY.endsAt);
}
/** Teaser visibility is separate from the one-day coupon validity. */
export function blackFridayBannerVisible(now = Date.now()): boolean {
  return BLACK_FRIDAY.enabled && blackFridayWithinWindow(now, "banner");
}
export function isBlackFridayCode(code: unknown): boolean {
  return typeof code === "string" && code.trim().toUpperCase() === BLACK_FRIDAY.code;
}
export function blackFridayActive(now = Date.now()): boolean {
  return BLACK_FRIDAY.enabled && blackFridayWithinWindow(now, "coupon");
}
export function couponDiscountCents(eligibleCents: number, percent: number): number {
  return Math.round(eligibleCents * percent / 100);
}
