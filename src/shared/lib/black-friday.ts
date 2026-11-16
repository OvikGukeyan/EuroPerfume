/** 27 November 2026, midnight to midnight in Europe/Berlin (CET). */
export const BLACK_FRIDAY = {
  code: "BLACK15", discount: 15,
  startsAt: "2026-11-27T00:00:00+01:00",
  endsAt: "2026-11-28T00:00:00+01:00",
} as const;
export function isBlackFridayCode(code: unknown): boolean {
  return typeof code === "string" && code.trim().toUpperCase() === BLACK_FRIDAY.code;
}
export function blackFridayActive(now = Date.now()): boolean {
  return now >= Date.parse(BLACK_FRIDAY.startsAt) && now < Date.parse(BLACK_FRIDAY.endsAt);
}
export function couponDiscountCents(eligibleCents: number, percent: number): number {
  return Math.round(eligibleCents * percent / 100);
}
