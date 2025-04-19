import { Brand } from '@prisma/client';
import { create } from 'zustand';
import { Api } from '../services/api-client';
export interface BrandsState {
    brands: Brand[];
    loading: boolean;
    error: boolean;

    fetchBrands: () => Promise<void>;
    createBrand: (brandName: {name: string}) => Promise<void>;
}


export const useBrandsStore = create<BrandsState>((set, get) => ({
    brands: [],
    loading: false,
    error: false,
    fetchBrands: async () => {
        try {
            set({ loading: true, error: false });
            const data = await Api.brands.fetchBrands();
            set({ brands: data });
        } catch (error) {
            console.error(error);
            set({ error: true });
        } finally {
            set({ loading: false });
        }
    },

    createBrand: async (data: {name: string}) => {
        try {
            set({ loading: true, error: false });
            const res = await Api.brands.createBrand(data);
            set((state) => ({ brands: [...state.brands, res] }));
        } catch (error) {
            console.error(error);
            set({ error: true });
        } finally {
            set({ loading: false });
        }
    }
}));