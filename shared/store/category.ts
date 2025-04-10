import { Category, ProductGroup } from '@prisma/client';
import {create} from 'zustand'
import { Api } from '../services/api-client';

export interface CategoriesState {
    activeId: number;
    categories: (Category & { productGroups: ProductGroup[] })[]
    setActiveId: (activeId: number) => void;
    fetchCategories: () => Promise<void>
}

export const useCategoryStore = create<CategoriesState>()((set) => ({
    activeId: 1,
    categories:[],
    setActiveId: (activeId: number) => set({activeId}),
    fetchCategories: async () => {
        try {
            const data = await Api.categories.fetchCategories()
            set({categories: data})
        } catch (error) {
            console.error(error)
        }
    }
}))
