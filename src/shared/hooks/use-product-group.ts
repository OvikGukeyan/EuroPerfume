import { useEffect } from "react";
import { useProductGroupStore } from "../store";

export const useProductGroup = () => {
    const productGroupState = useProductGroupStore((state) => state);

    useEffect(() => {
        productGroupState.fetchProductGroups()
    }, []);

    return productGroupState;
}