import { useEffect } from "react";
import { useCartStore } from "../store";
import { CartStateItem } from "../lib/get-cart-details";
import { CreateCartItemValues, CartPromotionSummary } from '../services/dto/cart.dto';

type ReturnPeops = {
    totalAmount: number;
    minimumOrderCents: number;
    items: CartStateItem[];
    promotions: CartPromotionSummary[];
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
        let timer: ReturnType<typeof setTimeout> | undefined;
        const arm = () => {
            if (!next) return;
            const remaining = next - Date.now();
            timer = setTimeout(remaining >= 2147483597 ? arm : refresh,
                Math.min(Math.max(0, remaining) + 50, 2147483647));
        };
        arm();
        window.addEventListener("focus", refresh);
        document.addEventListener("visibilitychange", refresh);
        return () => {
            clearTimeout(timer);
            window.removeEventListener("focus", refresh);
            document.removeEventListener("visibilitychange", refresh);
        };
    }, [cartState.offerRefreshAt]);
    return cartState;
}