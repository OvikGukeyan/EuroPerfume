import { useEffect } from "react";
import { BrandsState, useBrandsStore } from "../store";

export const useBrands = (): BrandsState => {
    const brandsState = useBrandsStore((state) => state);
    
    useEffect(() => {
        brandsState.fetchBrands()
    }, []);
    
    return brandsState;
}