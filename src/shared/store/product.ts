import { Api } from "../services/api-client";
import { create } from "zustand";
import { ProductDTO } from "../services/dto/product.dto";
import { GetSearchParams } from "../lib/find-products";
import { deleteProduct, toggleProductAvailability } from "@/src/app/actions";
import { getAvailableFilters } from "../lib";

export interface AvailableFilters {
  brands: { text: string; value: string }[] | null;
  classifications: { ru: string; de: string; value: string }[] | null;
  concentrations: { text: string; value: string }[] | null;
  genders: { ru: string; de: string; value: string }[] | null;
  aromas: { ru: string; de: string; value: string }[] | null;
  baseNotes: { ru: string; de: string; value: string }[] | null;
  topNotes: { ru: string; de: string; value: string }[] | null;
  heartNotes: { ru: string; de: string; value: string }[] | null;
}
interface ProductState {
  items: ProductDTO[];
  pages: number;
  availableFilters: AvailableFilters | null;
  loading: boolean;
  error: boolean;

  fetchAllProducts: (params?: GetSearchParams) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  switchAvailability: (id: number, available: boolean) => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  items: [],
  pages: 1,
  availableFilters: null,
  loading: true,
  error: false,

  fetchAllProducts: async (params?: GetSearchParams) => {
    try {
      set({ loading: true });
      const { products, totalPages, availableFilters } = await Api.products.getAll(params);
      set({
        items: products,
        pages: totalPages,
        availableFilters,
      });
    } catch (error) {
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },

  deleteProduct: async (id: number) => {
    try {
      set({ loading: true, error: false });
      const data = await deleteProduct(id);
      set({ items: get().items.filter((item) => item.id !== id) });
    } catch (error) {
      console.error(error);
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },

  switchAvailability: async (id: number, available: boolean) => {
    try {
      set({ loading: true, error: false });
      await toggleProductAvailability(id, available);
      set({
        items: get().items.map((item) =>
          item.id === id ? { ...item, available: available } : item
        ),
      });
    } catch (error) {
      console.error(error);
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },
}));
