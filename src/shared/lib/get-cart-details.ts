import { dayOfferActive, offerPrices } from "./day-offer";
import { TAX_SETTINGS } from "../../config/tax";
import { minimumOrderGoodsCents } from "./minimum-order";
import { cartPackMl } from "./decant-pack";
import { roundMoney } from "./money";
import { Brand, ProductGroup } from "@prisma/client";
import { CartDTO, CartPromotionSummary } from "../services/dto/cart.dto";
import { calcCartItemTotalPrice } from "./calc-cart-item-total-price";

export type CartStateItem = {
  allowBackorder?: boolean;
  dayOffer?: boolean;
  discounted?: boolean;
  offerBoundary?: string | null;
  aromaBox?: boolean;
  id: number;
  productId:number;
  quantity: number;
  packMl?: number | null;
  invalidPack?: boolean;
  variationId?: number | null;
  name: string;
  brand: Brand;
  imageUrl?: string;
  variationName?: string;
  productGroup?: ProductGroup;
  groupName?: string;
  price: number;
  disabled: boolean;
};
interface ReturnProps {
  items: CartStateItem[];
  promotions: CartPromotionSummary[];
  totalAmount: number;
  minimumOrderCents: number;
  offerRefreshAt: number | null;
}
export const getCartDetails = (data: CartDTO): ReturnProps => {
  const now = Date.now();
  const items = data.items.map((item) => ({
    allowBackorder: item.product.allowBackorder === true,
    dayOffer: dayOfferActive(item.product, now),
    discounted: offerPrices(item.product, item.quantity, Boolean(item.product.productGroup?.onTap), now, true, item.packMl).discounted,
    offerBoundary: item.product.dayOfferEndsAt ? String(item.product.dayOfferEndsAt) : null,
    id: item.id,
    productId:item.productId,
    aromaBox: item.aromaBox,
    quantity: item.quantity,
    packMl: item.product.productGroup?.onTap ? cartPackMl(item.quantity, item.packMl) : null,
    invalidPack: Boolean(item.product.productGroup?.onTap) && !cartPackMl(item.quantity, item.packMl),
    variationId: item.variationId,
    name: item.product.name,
    brand: item.product.brand,
    imageUrl: item.product.imageUrl[0] || item.variation?.imageUrl,
    variationName: item.variation?.name || "",
    productGroup: item.product?.productGroup,
    price: calcCartItemTotalPrice(
      item.product.price,
      item.quantity,
      Boolean(item.product.productGroup?.onTap),
      item.product.discountPrice || undefined,
      item.product,
      now, true, item.packMl
    ),
    disabled: false,
  })) as CartStateItem[];
  const boundaries = [...data.items.flatMap(i => [i.product.dayOfferStartsAt, i.product.dayOfferEndsAt]), TAX_SETTINGS.VAT_START_AT]
    .filter(Boolean).map(d => new Date(d!).getTime()).filter(t => t > now);
  return {
    minimumOrderCents: minimumOrderGoodsCents(data.items, now),
    offerRefreshAt: boundaries.length ? Math.min(...boundaries) : null,
    totalAmount: roundMoney(items.reduce((sum, item) => sum + item.price, 0)),
    items,
    promotions:data.promotions||[],
  };
};
