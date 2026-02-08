import { Brand, ProductGroup } from "@prisma/client";
import { CartDTO } from "../services/dto/cart.dto";
import { calcCartItemTotalPrice } from "./calc-cart-item-total-price";

export type CartStateItem = {
  id: number;
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
  totalAmount: number;
}
export const getCartDetails = (data: CartDTO): ReturnProps => {
  const items = data.items.map((item) => ({
    id: item.id,
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
      item.product.discountPrice || undefined
    ),
    disabled: false,
  })) as CartStateItem[];
  return {
    totalAmount: data.totalAmount,
    items,
  };
};
