import { mapPizzaType, PizzaSize, PizzaType } from "../constants/pizza";
import { calcTotalPizzaPrice } from "./calc-total-pizza-price";
import { Ingredient, ProductItem } from '@prisma/client';

interface ReturnProps {
    TextDetaills: string;
    totalPrice: number;
}
export const getPizzaDetails = (size: PizzaSize, type: PizzaType, items: ProductItem[], ingredients: Ingredient[], selectedIngredients: Set<number>): ReturnProps => {
    const TextDetaills = `${size} cm, ${mapPizzaType[type]} crust`
    const totalPrice = calcTotalPizzaPrice(items, ingredients, selectedIngredients, size, type);

    return {
        TextDetaills,
        totalPrice}
}