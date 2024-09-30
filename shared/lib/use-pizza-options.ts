import { useEffect, useState } from "react";
import { PizzaSize, PizzaType } from "../constants/pizza";
import { Variant } from "../components/shared/group-variants";
import { useSet } from "react-use";
import { getAvailablePizzaSizes } from ".";
import { ProductItem } from "@prisma/client";

interface ReturnProps {
    size: PizzaSize;
    type: PizzaType;
    selectedIngredients: Set<number>;
    availableSizes: Variant[]
    setSize: (value: PizzaSize) => void;
    setType: (value: PizzaType) => void;
    addIngredient: (value: number) => void;
}
export const usePizzaOptions = ( items: ProductItem[] ): ReturnProps => {
    const [size, setSize] = useState<PizzaSize>(20);
    const [type, setType] = useState<PizzaType>(1);
    const [selectedIngredients, {toggle: addIngredient}] = useSet(new Set<number>([]))
    const availableSizes = getAvailablePizzaSizes(items, type); 
    
    useEffect(()=> {
        const isAvailableSize = availableSizes.find((item) => Number(item.value) === size && !item.disabled);

        const availableSize = availableSizes?.find((item) => !item.disabled);

        if(!isAvailableSize && availableSize) {
            setSize(Number(availableSize.value) as PizzaSize);
        }
    }, [type])

    return {
        size,
        type,
        availableSizes,
        selectedIngredients,
        setSize,
        setType,
        addIngredient,
    }
}