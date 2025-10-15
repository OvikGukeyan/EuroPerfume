
export const calcTotlalAmountWithDelivery = (
  totlalAmount: number,
  discount?: number
) => {
  let totalAmountWithDelivery = 0;
  let deliveryPrice = 0;
  const totalAmountWithDiscount = discount
    ? totlalAmount - totlalAmount * (discount / 100)
    : totlalAmount;
  if (totlalAmount < 100 && totlalAmount > 0) {
    deliveryPrice = 5.95;
    totalAmountWithDelivery = Number(totalAmountWithDiscount) + deliveryPrice;
  } else {
    totalAmountWithDelivery = Number(totalAmountWithDiscount);
  }
  totalAmountWithDelivery = Number(totalAmountWithDelivery.toFixed(2));
  return { totalAmountWithDelivery, deliveryPrice };
};
