import { ProductGroup } from "@prisma/client";
import { create } from "zustand";
import { Api } from "../services/api-client";

export interface ProductGroupValues {
  name: string;
  categoryId: number;
}
export interface ProductGroupState {
  productGroups: ProductGroup[];
  loading: boolean;
  error: boolean;

  fetchProductGroups: () => Promise<void>;
  createProductGroup: (values: ProductGroupValues) => Promise<void>;
}

export const useProductGroupStore = create<ProductGroupState>()((set) => ({
  productGroups: [],
  loading: true,
  error: false,

  fetchProductGroups: async () => {
    try {
      set({ loading: true, error: false });
      const data = await Api.productGroup.fetchProductGroups();
      set({ productGroups: data });
    } catch (error) {
      console.error(error);
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },

  createProductGroup: async (values: ProductGroupValues) => {
    try {
      set({ loading: true, error: false });
      const data = await Api.productGroup.createProductGroup(values);
      set((state) => ({
        productGroups: [...state.productGroups, data],
      }));
    } catch (error) {
      console.error(error);
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },
}));
