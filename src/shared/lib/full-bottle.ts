import type { DayOfferWindow } from "./day-offer";
// Temporary explicit draft marker. Independent of stock, availability and orderability.
export const catalogDraftProductIds = [708];
export const isCatalogDraftProduct = (id: number) => catalogDraftProductIds.includes(id);

export const bottleGroup = { labelRu: "Полные флаконы", labelDe: "Originalflakons" } as const;

export type IngredientTranslation = { language: string; activeIngredients?: string | null };
export type BottleOption = DayOfferWindow & {
  ingredients?: IngredientTranslation[];
  regularPrice?: number; discountPrice?: number;
  id: number; ml: number; price: number; image: string; available: boolean; allowBackorder?: boolean; stock?: number;
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

export function publicBottle(p: { id:number; volume:string|null; price:{toString():string}; discountPrice?:{toString():string}|null; stockPieces:number; available:boolean; allowBackorder?:boolean; imageUrl:string[]; translations?: IngredientTranslation[] } & DayOfferWindow): BottleOption {
  return { ...(p.translations ? {ingredients:p.translations.map(t=>({language:t.language,activeIngredients:t.activeIngredients}))} : {}), stock:p.stockPieces, dayOfferStartsAt:p.dayOfferStartsAt, dayOfferEndsAt:p.dayOfferEndsAt, regularPrice:Number(p.price), discountPrice:p.discountPrice ? Number(p.discountPrice) : undefined, id:p.id, ml:Number(p.volume), price:Number(p.discountPrice ?? p.price), image:p.imageUrl[0] ?? "", allowBackorder:p.allowBackorder === true, available:p.available && (p.allowBackorder === true || p.stockPieces > 0) };
}

// Use the selling price of the selected format; invalid volumes must never produce NaN.
export function unitPricePerLitre(price: number, ml: number): number | null {
  return Number.isFinite(price) && price >= 0 && Number.isFinite(ml) && ml > 0
    ? Math.round(price * 100000 / ml) / 100 : null;
}
export const fullBottleInclude = { where: { id: { notIn: catalogDraftProductIds } }, select: { id:true, volume:true, price:true, discountPrice:true, imageUrl:true, stockPieces:true, allowBackorder:true, available:true, dayOfferStartsAt:true, dayOfferEndsAt:true } } as const;
type PublicBottleRow = Parameters<typeof publicBottle>[0];
export function withBottleOptions<T extends PublicBottleRow & { productGroupId:number; name:string; fullBottles: PublicBottleRow[] }>(product: T) {
  const { fullBottles, ...base } = product;
  return { ...base, name: fragranceName(base.name), bottles: [...(base.productGroupId===31 ? [base] : []), ...fullBottles].filter(p => !isCatalogDraftProduct(p.id)).map(publicBottle).filter(b => b.ml > 0 && Number.isFinite(b.ml)).sort((a,b) => a.ml-b.ml) };
}

export function fragranceName(name:string) { return name.replace(/\s*· Originalflakon \d+ ml$/, "").trim(); }

// Never fall back to another volume's formula when a selected bottle lacks INCI.
export function selectedIngredientSource(parent: {id:number;translations:IngredientTranslation[]}, bottle?:BottleOption) {
  return bottle ? {productId:bottle.id,translations:bottle.ingredients ?? []} : {productId:parent.id,translations:parent.translations};
}
