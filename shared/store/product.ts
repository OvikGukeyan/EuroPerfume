import { deleteProduct, toggleProductAvailability } from '@/app/actions';
import { Api } from '../services/api-client';
import { search } from './../services/products';
import { create } from "zustand";
import { Product } from '@prisma/client';
import { ProductDTO } from '../services/dto/product.dto';


interface ProductState {
    items: ProductDTO[];
    loading: boolean;
    error: boolean;

    fetchAllProducts: () => Promise<void>;
    deleteProduct: (id: number) => Promise<void>;
    switchAvailability: (id: number, available: boolean) => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  items: [],
  loading: true,
  error: false,

  fetchAllProducts: async () => {
      try{
          set({loading: true})
          const data = await Api.products.getAll();
          set({items: data})
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
