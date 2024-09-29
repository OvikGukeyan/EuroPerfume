import { Ingredient, ProductItem } from "@prisma/client";
import { PizzaSize, PizzaType } from "../constants/pizza";

export const calcTotalPizzaPrice = (items: ProductItem[], ingredients: Ingredient[], selectedIngredients: Set<number>, size: PizzaSize, type: PizzaType) => {
    const pizzaPrice = items.find((item) => item.size === size && item.pizzaType === type)?.price ?? 0;
    const totlalIngredientsPrice = ingredients.filter((ingredient) => selectedIngredients.has(ingredient.id)).reduce((prev, curr) => prev + curr.price, 0);
    return pizzaPrice + totlalIngredientsPrice;
}