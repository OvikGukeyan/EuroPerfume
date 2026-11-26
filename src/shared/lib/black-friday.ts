/** 27 November 2026, midnight to midnight in Europe/Berlin (CET). */
export const BLACK_FRIDAY = {
  code: "BLACK15", discount: 15, minimumEligibleCents: 0,
  tiers: [{ minimum: 8_000, percent: 15 }, { minimum: 5_000, percent: 10 }, { minimum: 0, percent: 5 }],
  bannerStartsAt: "2026-11-26T18:00:00+01:00",
  startsAt: "2026-11-27T00:00:00+01:00",
  endsAt: "2026-11-28T00:00:00+01:00",
} as const;
/** Teaser visibility is separate from the one-day coupon validity. */
export function blackFridayBannerVisible(now = Date.now()): boolean {
  return now >= Date.parse(BLACK_FRIDAY.bannerStartsAt) && now < Date.parse(BLACK_FRIDAY.endsAt);
}
export function isBlackFridayCode(code: unknown): boolean {
  return typeof code === "string" && code.trim().toUpperCase() === BLACK_FRIDAY.code;
}
export function blackFridayActive(now = Date.now()): boolean {
  return now >= Date.parse(BLACK_FRIDAY.startsAt) && now < Date.parse(BLACK_FRIDAY.endsAt);
}
export function blackFridayPercent(eligibleCents: number): number {
  return eligibleCents > 0 ? BLACK_FRIDAY.tiers.find(tier => eligibleCents >= tier.minimum)?.percent ?? 0 : 0;
}
export function blackFridayMinimumMessage(ru: boolean): string {
  return ru
    ? "BLACK15 действует только на неакционные товары. Доставка в расчёт не входит."
    : "BLACK15 gilt nur für nicht reduzierte Artikel. Versandkosten zählen nicht mit.";
}
export function couponDiscountCents(eligibleCents: number, percent: number): number {
  return Math.round(eligibleCents * percent / 100);
}
