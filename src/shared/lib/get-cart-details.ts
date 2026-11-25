import { dayOfferActive, offerPrices } from "./day-offer";
import { minimumOrderGoodsCents } from "./minimum-order";
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
  const items = data.items.map((item) => ({
    allowBackorder: item.product.allowBackorder === true,
    dayOffer: dayOfferActive(item.product),
    discounted: offerPrices(item.product, item.quantity, Boolean(item.product.productGroup?.onTap)).discounted,
    offerBoundary: item.product.dayOfferEndsAt ? String(item.product.dayOfferEndsAt) : null,
    id: item.id,
    productId:item.productId,
    aromaBox: item.aromaBox,
    quantity: item.quantity,
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
      item.product
    ),
    disabled: false,
  })) as CartStateItem[];
  const boundaries = data.items.flatMap(i => [i.product.dayOfferStartsAt, i.product.dayOfferEndsAt]).filter(Boolean).map(d => new Date(d!).getTime()).filter(t => t > Date.now());
  return {
    minimumOrderCents: minimumOrderGoodsCents(data.items),
    offerRefreshAt: boundaries.length ? Math.min(...boundaries) : null,
    totalAmount: roundMoney(items.reduce((sum, item) => sum + item.price, 0)),
    items,
    promotions:data.promotions||[],
  };
};
