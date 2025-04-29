import { deleteProduct, toggleProductAvailability } from '@/app/actions';
import { Api } from '../services/api-client';
import { create } from "zustand";
import { ProductDTO } from '../services/dto/product.dto';
import { findProducts, GetSearchParams } from '../lib/find-products';


interface ProductState {
    items: ProductDTO[];
    pages: number;
    loading: boolean;
    error: boolean;


    fetchAllProducts: (params?: GetSearchParams) => Promise<void>;
    deleteProduct: (id: number) => Promise<void>;
    switchAvailability: (id: number, available: boolean) => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  items: [],
  pages: 1,
  loading: true,
  error: false,

  fetchAllProducts: async (params?: GetSearchParams) => {
      try{
          set({loading: true})
          const {products, totalPages} = await Api.products.getAll(params);
         
          set({pages: totalPages})
          set({items: products})
      }catch(error){
          console.error(error);
      }finally{
          set({loading: false})
      }
  },

  deleteProduct: async (id: number) => {
    try {
      set({ loading: true, error: false });
      const data = await deleteProduct(id);
      set({ items: get().items.filter(item => item.id !== id) });
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
      set({ items: get().items.map(item => item.id === id ? { ...item, available: available } : item) });
    } catch (error) {
      console.error(error);
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  }
}));
