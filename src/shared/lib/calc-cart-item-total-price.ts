export const calcCartItemTotalPrice = (
  productPrice: number,
  quantity: number,
  onTap: boolean,
  discountPrice?: number,
): number => {
  const price = discountPrice || productPrice;
  if (onTap) {
    const totalPrice =
      (quantity <= 10 && price * quantity + 1) ||
      (quantity <= 20 && price * quantity + 2) ||
      (quantity <= 30 && price * quantity + 3) ||
      (quantity <= 40 && price * quantity + 4) ||
      price * quantity + 5;
    return Number(totalPrice.toFixed(2));
  }
  return Number((price * quantity).toFixed(2));
};

