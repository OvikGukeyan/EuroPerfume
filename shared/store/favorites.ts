import { Favorites } from './../../node_modules/.prisma/client/index.d';
import { create } from "zustand";
import { Api } from "../services/api-client";
import { getCartDetails } from "../lib";
import { CartStateItem } from "../lib/get-cart-details";
import { CreateCartItemValues } from "../services/dto/cart.dto";



export type FavoritesStateItem = {
    id: number;
    productId: number;
    name: string;
    imageUrl: string;
    price: number;
    disabled: boolean;
};
export interface FavoritesState {
  loading: boolean;
  itemLoading: boolean;
  error: boolean;
  items: FavoritesStateItem[];

  fetchFavoritesItems: () => Promise<void>;
  addFavoritesItem: (id: number) => Promise<void>;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  items: [],
  loading: true,
  itemLoading: false,
  error: false,


  fetchFavoritesItems: async () => {
    try {
      set({ loading: true, error: false });
      const data = await Api.favorites.getFavorites();
      set({ items: data .items.map((item) => ({
        id: item.id,
        productId: item.productId,
        name: item.product.name,
        imageUrl: item.product.imageUrl,
        price: item.product.price,
        disabled: false
      }))});
    } catch (error) {
      console.error(error);
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },
  
  addFavoritesItem: async (productId: number) => {
    try {
      set({ loading: true, error: false });
      const {items} = await Api.favorites.addFavoritesItem(productId);
      set({ items: items.map((item) => ({
        id: item.id,
        productId: item.productId,
        name: item.product.name,
        imageUrl: item.product.imageUrl,
        price: item.product.price,
        disabled: false
      }))});
    } catch (error) {
      console.error(error);
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },

}))
