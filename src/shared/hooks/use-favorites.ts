import { addFavoritesItem } from './../services/favorites';
import { useEffect } from "react";
import { FavoritesState, FavoritesStateItem, useCartStore, useFavoritesStore } from "../store";
import { CartStateItem } from "../lib/get-cart-details";
import { CreateCartItemValues } from '../services/dto/cart.dto';



export const useFavorites = (): FavoritesState => {
    
    const favoritesState = useFavoritesStore((state) => state);
    
    useEffect(() => {
        favoritesState.fetchFavoritesItems()
    }, []);

    return favoritesState;
}