import { SHOP_SETTINGS } from "../../config/shop";
import { linePrice } from "./day-offer";

type MinimumOrderItem = {
  quantity: number;
  product: { price: unknown; productGroup?: { onTap: boolean | null } | null };
};

// Use regular merchandise prices, including the atomizer component of a decant,
// not the payable subtotal (sale, coupon, points, gifts, or delivery).
export function minimumOrderGoodsCents(items: readonly MinimumOrderItem[]): number {
  return items.reduce((sum, { product, quantity }) =>
    sum + Math.round(linePrice(Number(product.price), quantity, Boolean(product.productGroup?.onTap)) * 100), 0);
}

export function meetsMinimumOrder(goodsCents: number): boolean {
  return goodsCents >= SHOP_SETTINGS.MIN_ORDER_EUR * 100;
}
