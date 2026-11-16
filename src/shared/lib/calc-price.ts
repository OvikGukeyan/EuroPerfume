import { linePrice } from "./day-offer";
import { Volume } from "../constants/perfume";
export const calcPrice = (volume: Volume, price: number): number => linePrice(price, volume, true);
