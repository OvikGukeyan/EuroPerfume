type BoxItem = { id: number; productId: number; quantity: number; variationId?: number | null };
export function aromaBoxItems<T extends BoxItem>(raw: string | undefined, items: T[]): T[] {
  if (!raw) return [];
  const exact = raw.startsWith("items:");
  const ids = (exact ? raw.slice(6) : raw).split(",").map(Number);
  if (ids.length !== 8 || new Set(ids).size !== 8 || ids.some(id => !Number.isSafeInteger(id) || id <= 0)) return [];
  const found = ids.map(id => items.find(item => (exact ? item.id : item.productId) === id && item.quantity === 2 && !item.variationId));
  return found.every(Boolean) ? found as T[] : [];
}
