import { CartItemDTO } from "../services/dto/cart.dto";

export const calcCartItemTotalPrice = (item: CartItemDTO): number => {
  if(item.product.categoryId === 1) {
    const totalPrice =
    (item.quantity <= 10 && item.product.price.toNumber() * item.quantity + 1) ||
    (item.quantity === 20 && item.product.price.toNumber() * item.quantity + 2) ||
    (item.quantity === 30 && item.product.price.toNumber() * item.quantity + 3) ||
    0;
  return totalPrice;
  }
  return item.product.price.toNumber() * item.quantity
};
