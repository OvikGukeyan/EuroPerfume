import { create } from "zustand";
import { Api } from "../services/api-client";
import { Review } from "@prisma/client";



export type FavoritesStateItem = {
    id: number;
    productId: number;
    name: string;
    imageUrl?: string;
    price: number;
    disabled: boolean;
};
export interface FavoritesState {
  favoritesLoading: boolean;
  error: boolean;
  items: FavoritesStateItem[];

  fetchFavoritesItems: () => Promise<void>;
  addFavoritesItem: (id: number) => Promise<void>;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  items: [],
  favoritesLoading: true,
  error: false,


  fetchFavoritesItems: async () => {
    try {
      set({ favoritesLoading: true, error: false });
      const data = await Api.favorites.getFavorites();
      set({ items: data .items.map((item) => ({
        id: item.id,
        productId: item.productId,
        name: item.product.name,
        imageUrl: item.product.imageUrl[0] || item.product.variations[0].imageUrl,
        price: item.product.price,
        disabled: false
      }))});
    } catch (error) {
      console.error(error);
      set({ error: true });
    } finally {
      set({ favoritesLoading: false });
    }
  },
  
  addFavoritesItem: async (productId: number) => {
    try {
      set({ favoritesLoading: true, error: false });
      const {items} = await Api.favorites.addFavoritesItem(productId);
      set({ items: items.map((item) => ({
        id: item.id,
        productId: item.productId,
        name: item.product.name,
        imageUrl: item.product.imageUrl[0] || undefined,
        price: item.product.price,
        disabled: false
      }))});
      
    } catch (error) {
      console.error(error);
      set({ error: true });
    } finally {
      set({ favoritesLoading: false });
    }
  },

}))
