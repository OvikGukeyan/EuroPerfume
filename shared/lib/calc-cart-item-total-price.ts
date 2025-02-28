import { CartItemDTO } from "../services/dto/cart.dto";

export const calcCartItemTotalPrice = (item: CartItemDTO): number => {
  const totalPrice =
    (item.quantity <= 10 && item.product.price * item.quantity + 1) ||
    (item.quantity === 20 && item.product.price * item.quantity + 2) ||
    (item.quantity === 30 && item.product.price * item.quantity + 3) ||
    0;
  return totalPrice;
};
