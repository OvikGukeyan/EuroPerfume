import { offerPrices, type DayOfferWindow } from "./day-offer";
export const calcCartItemTotalPrice = (productPrice: number, quantity: number, onTap: boolean, discountPrice?: number, offer?: DayOfferWindow, at = Date.now(), applyCatalogVat = true, packMl?: number | null): number =>
  offerPrices({ price: productPrice, discountPrice, ...offer }, quantity, onTap, at, applyCatalogVat, packMl).effective;
