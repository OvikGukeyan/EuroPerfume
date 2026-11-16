export type DayOfferWindow = {
  dayOfferStartsAt?: Date | string | null;
  dayOfferEndsAt?: Date | string | null;
};
export type PriceSource = DayOfferWindow & {
  price: unknown; discountPrice?: unknown;
};
export const DAY_OFFER_PERCENT = 10;

export function dayOfferActive(offer: DayOfferWindow | null | undefined, now = Date.now()): boolean {
  if (!offer?.dayOfferStartsAt || !offer.dayOfferEndsAt) return false;
  const start = new Date(offer.dayOfferStartsAt).getTime();
  const end = new Date(offer.dayOfferEndsAt).getTime();
  return Number.isFinite(start) && Number.isFinite(end) && start < end && now >= start && now < end;
}
export function linePrice(price: number, quantity: number, onTap: boolean): number {
  if (!Number.isFinite(price) || price < 0 || !Number.isInteger(quantity) || quantity <= 0) throw new Error("Invalid product price or quantity");
  const packaging = onTap ? (quantity <= 10 ? 1 : quantity <= 20 ? 2 : quantity <= 30 ? 3 : quantity <= 40 ? 4 : 5) : 0;
  return Math.round((price * quantity + packaging + Number.EPSILON) * 100) / 100;
}
export function offerPrices(product: PriceSource, quantity: number, onTap: boolean, now = Date.now()) {
  const regular = linePrice(Number(product.price), quantity, onTap);
  const sale = Number(product.discountPrice);
  const existing = sale > 0 && sale < Number(product.price) ? linePrice(sale, quantity, onTap) : regular;
  // Apply to the complete selling price, including the atomizer. Never stack.
  const day = dayOfferActive(product, now) ? Math.round(Math.round(regular * 100) * 90 / 100) / 100 : regular;
  const effective = Math.min(existing, day);
  return { regular, effective, discounted: effective < regular, dayOffer: dayOfferActive(product, now) && day <= existing };
}
export function berlinOfferTime(value: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) throw new Error("Укажите дату и время по Германии");
  const desired = Date.parse(value + ":00Z");
  if (!Number.isFinite(desired)) throw new Error("Некорректная дата");
  const formatter = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Berlin", year:"numeric", month:"2-digit", day:"2-digit", hour:"2-digit", minute:"2-digit", hourCycle:"h23" });
  let instant = desired;
  for (let i = 0; i < 3; i++) {
    const represented = Date.parse(formatter.format(new Date(instant)).replace(" ", "T") + ":00Z");
    instant += desired - represented;
  }
  if (formatter.format(new Date(instant)).replace(" ", "T") !== value) throw new Error("Это время не существует из-за перехода на летнее время");
  // Reject ambiguous autumn clock changes; an explicit offset is needed instead.
  if (formatter.format(new Date(instant - 3600000)).replace(" ", "T") === value || formatter.format(new Date(instant + 3600000)).replace(" ", "T") === value) throw new Error("Неоднозначное время перевода часов. Выберите другое время.");
  return new Date(instant);
}
