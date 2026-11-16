import type { DayOfferWindow } from "./day-offer";
export const bottleGroup = { labelRu: "Полные флаконы", labelDe: "Originalflakons" } as const;

export type BottleOption = DayOfferWindow & {
  regularPrice?: number; discountPrice?: number;
  id: number; ml: number; price: number; image: string; available: boolean;
};
export type BottleAdminOption = BottleOption & { stock: number; version: string };

export function bottleFields(ml: string, price: string, stock: string) {
  const normalized = price.replace(",", ".");
  if (!/^[1-9]\d{0,3}$/.test(ml)) throw new Error("Укажите объём от 1 до 9999 мл.");
  if (!/^\d{1,6}(\.\d{1,2})?$/.test(normalized) || Number(normalized) <= 0)
    throw new Error("Укажите цену в евро, максимум два знака после запятой.");
  if (!/^(0|[1-9]\d{0,5})$/.test(stock)) throw new Error("Остаток должен быть целым числом от 0 до 999999.");
  return { ml: Number(ml), price: normalized, stock: Number(stock) };
}

export function publicBottle(p: { id:number; volume:string|null; price:{toString():string}; discountPrice?:{toString():string}|null; stockPieces:number; available:boolean; imageUrl:string[] } & DayOfferWindow): BottleOption {
  return { dayOfferStartsAt:p.dayOfferStartsAt, dayOfferEndsAt:p.dayOfferEndsAt, regularPrice:Number(p.price), discountPrice:p.discountPrice ? Number(p.discountPrice) : undefined, id:p.id, ml:Number(p.volume), price:Number(p.discountPrice ?? p.price), image:p.imageUrl[0] ?? "", available:p.available && p.stockPieces > 0 };
}

// Use the selling price of the selected format; invalid volumes must never produce NaN.
export function unitPricePerLitre(price: number, ml: number): number | null {
  return Number.isFinite(price) && price >= 0 && Number.isFinite(ml) && ml > 0
    ? Math.round(price * 100000 / ml) / 100 : null;
}
export const fullBottleInclude = { select: { id:true, volume:true, price:true, discountPrice:true, imageUrl:true, stockPieces:true, available:true, dayOfferStartsAt:true, dayOfferEndsAt:true } } as const;
type PublicBottleRow = Parameters<typeof publicBottle>[0];
export function withBottleOptions<T extends { fullBottles: PublicBottleRow[] }>(product: T) {
  const { fullBottles, ...base } = product;
  return { ...base, bottles: fullBottles.map(publicBottle).filter(b => b.ml > 0 && Number.isFinite(b.ml)).sort((a,b) => a.ml-b.ml) };
}
