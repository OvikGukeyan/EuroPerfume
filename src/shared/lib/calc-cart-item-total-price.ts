import { CartItemDTO } from "../services/dto/cart.dto";

export const calcCartItemTotalPrice = (item: CartItemDTO): number => {
  const price = item.product.discountPrice || item.product.price;
  if (
    item.product.categoryId === 1 &&
    item.product.productGroupId &&
    item.product.productGroupId < 4
  ) {
    const totalPrice =
      (item.quantity <= 10 && price * item.quantity + 1) ||
      (item.quantity <= 20 && price * item.quantity + 2) ||
      (item.quantity <= 30 && price * item.quantity + 3) ||
      (item.quantity <= 40 && price * item.quantity + 4) ||
      price * item.quantity + 5;
    return totalPrice;
  }
  return price * item.quantity;
};
