/** 27 November 2026, midnight to midnight in Europe/Berlin (CET). */
export const BLACK_FRIDAY = {
  code: "BLACK15", discount: 15, minimumEligibleCents: 8_000,
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
export function blackFridayMinimumMessage(ru: boolean): string {
  const amount = BLACK_FRIDAY.minimumEligibleCents / 100;
  return ru
    ? `BLACK15 действует от ${amount} € на неакционные товары. Доставка и акционные товары не учитываются.`
    : `BLACK15 gilt ab ${amount} € Warenwert ohne Aktionsartikel und Versandkosten.`;
}
export function couponDiscountCents(eligibleCents: number, percent: number): number {
  return Math.round(eligibleCents * percent / 100);
}
