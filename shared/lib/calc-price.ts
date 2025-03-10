import { Volume } from "../constants/perfume";

export const calcPrice = (volume: Volume, price: number): number => {
    const finalPrice =
    (volume <= 10 && price * volume + 1) ||
    ((volume >= 20 && volume < 30) && price * volume + 2) ||
    (volume >= 30 && price * volume + 3) || 0;
    return finalPrice
}