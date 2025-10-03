import { CartItemDTO } from "../services/dto/cart.dto";

export const calcCartItemTotalPrice = (item: CartItemDTO): number => {
  const price = item.product.discountPrice || item.product.price;
  if (item.product.productGroup?.onTap) {
    const totalPrice =
      (item.quantity <= 10 && price * item.quantity + 1) ||
      (item.quantity <= 20 && price * item.quantity + 2) ||
      (item.quantity <= 30 && price * item.quantity + 3) ||
      (item.quantity <= 40 && price * item.quantity + 4) ||
      price * item.quantity + 5;
    return Number(totalPrice.toFixed(2));
  }
  return Number((price * item.quantity).toFixed(2));
};
