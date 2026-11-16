import { offerPrices, type DayOfferWindow } from "./day-offer";
export const calcCartItemTotalPrice = (productPrice: number, quantity: number, onTap: boolean, discountPrice?: number, offer?: DayOfferWindow, at = Date.now()): number =>
  offerPrices({ price: productPrice, discountPrice, ...offer }, quantity, onTap, at).effective;
