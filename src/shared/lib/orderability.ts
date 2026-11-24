/** Read flags from the database, never from a cart request. Stock is owned inventory. */
export type OrderableProduct = {
  available: boolean;
  allowBackorder?: boolean;
  bottleParentId: number | null;
  stockPieces: number;
};

export function canOrderQuantity(product: OrderableProduct, quantity: number, variationId?: number | null): boolean {
  if (!product.available || !Number.isSafeInteger(quantity) || quantity < 1) return false;
  if (product.bottleParentId !== null && variationId != null) return false;
  return product.allowBackorder === true || product.bottleParentId === null || quantity <= product.stockPieces;
}
