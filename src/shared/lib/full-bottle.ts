export const bottleGroup = { labelRu: "Полные флаконы", labelDe: "Originalflakons" } as const;

export type BottleOption = {
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

export function publicBottle(p: { id:number; volume:string|null; price:{toString():string}; discountPrice?:{toString():string}|null; stockPieces:number; available:boolean; imageUrl:string[] }): BottleOption {
  return { id:p.id, ml:Number(p.volume), price:Number(p.discountPrice ?? p.price), image:p.imageUrl[0] ?? "", available:p.available && p.stockPieces > 0 };
}
