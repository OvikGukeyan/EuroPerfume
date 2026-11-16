import { useEffect } from "react";
import { useCartStore } from "../store";
import { CartStateItem } from "../lib/get-cart-details";
import { CreateCartItemValues } from '../services/dto/cart.dto';

type ReturnPeops = {
    totalAmount: number;
    items: CartStateItem[];
    loading: boolean;
    itemLoading: boolean;
    updateItemQuantity: (id: number, quantity: number) => Promise<void>;
    removeCartItem: (id: number) => Promise<void>;
    addCartItem: (values: CreateCartItemValues) => Promise<void>;
}

export const useCart = (): ReturnPeops => {
    
    const cartState = useCartStore((state) => state);
    
    useEffect(() => {
        cartState.fetchCartItems()
    }, []);

    useEffect(() => {
        const refresh = () => { if (!document.hidden) void useCartStore.getState().fetchCartItems(); };
        const next = cartState.offerRefreshAt;
        const timer = next ? setTimeout(refresh, Math.min(Math.max(0, next - Date.now()) + 50, 2147483647)) : undefined;
        window.addEventListener("focus", refresh);
        return () => { clearTimeout(timer); window.removeEventListener("focus", refresh); };
    }, [cartState.offerRefreshAt]);
    return cartState;
}