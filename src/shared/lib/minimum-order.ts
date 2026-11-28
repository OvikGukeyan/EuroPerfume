import { SHOP_SETTINGS } from "../../config/shop";
import { offerPrices } from "./day-offer";

type MinimumOrderItem = {
  quantity: number;
  packMl?: number | null;
  product: { price: unknown; productGroup?: { onTap: boolean | null } | null };
};

// Use regular merchandise prices, including the atomizer component of a decant,
// not the payable subtotal (sale, coupon, points, gifts, or delivery).
export function minimumOrderGoodsCents(items: readonly MinimumOrderItem[], at = Date.now()): number {
  return items.reduce((sum, { product, quantity, packMl }) =>
    sum + Math.round(offerPrices({ price: product.price }, quantity, Boolean(product.productGroup?.onTap), at, true, packMl).regular * 100), 0);
}

export function meetsMinimumOrder(goodsCents: number): boolean {
  return goodsCents >= SHOP_SETTINGS.MIN_ORDER_EUR * 100;
}
