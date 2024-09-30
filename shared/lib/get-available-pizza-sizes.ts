import { ProductItem } from "@prisma/client";
import { pizzaSizes, PizzaType } from "../constants/pizza";
import { Variant } from "../components/shared/group-variants";

export const getAvailablePizzaSizes = (items: ProductItem[], type: PizzaType): Variant[] => {
    const filteredPizzasByType = items.filter((item) => item.pizzaType === type);
    return pizzaSizes.map((item) => (
        {
            ...item,
            disabled: !filteredPizzasByType.some((type) => Number(type.size) === Number(item.value))
        }
    ))
}