import { volumes } from "../constants/perfume";

export const MAX_DECANT_PACK_COUNT = 99;
export function decantAddVolume(size: number, count: unknown) {
  return isDecantPack(size) && typeof count === "number" && Number.isSafeInteger(count)
    && count >= 1 && count <= MAX_DECANT_PACK_COUNT ? size * count : null;
}

export const isDecantPack = (value: unknown): value is (typeof volumes)[number] =>
  typeof value === "number" && volumes.some(size => size === value);

/** Legacy rows contain only total ml. Infer one pack only when that exact size exists. */
export function cartPackMl(totalMl: number, packMl?: number | null) {
  if (packMl == null) return isDecantPack(totalMl) ? totalMl : null;
  return isDecantPack(packMl) && totalMl >= packMl && totalMl % packMl === 0 ? packMl : null;
}

export function formatPackQuantity(quantity: number, onTap: boolean, packMl?: number | null, ru = false) {
  const ml = ru ? "мл" : "ml";
  return packMl ? `${quantity / packMl} × ${packMl} ${ml}`
    : `${quantity} ${onTap ? ml : ru ? "шт." : "Stk."}`;
}
