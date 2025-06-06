import { create } from "zustand";

interface PriceProps {
  priceFrom?: number;
  priceTo?: number;
}

interface OrderByType {
  [key: string]: string;
}

export interface Filters {
  gender: Set<string>;
  concentration: Set<string>;
  brands: Set<string>;
  classification: Set<string>;
  topNotes: Set<string>;
  heartNotes: Set<string>;
  baseNotes: Set<string>;
  aromas: Set<string>;
  prices: PriceProps;
  orderBy: OrderByType;
  category: number | null;
  productGroup: number | null;
  currentPage: number;
}

interface FiltersStore extends Filters {
  setPrices: (name: keyof PriceProps, value: number) => void;
  setSelectedGender: (key: string) => void;
  setSelectedConcentration: (key: string) => void;
  setSelectedBrands: (key: string) => void;
  setSelectedClassification: (key: string) => void;
  setTopNotes: (key: string) => void;
  setHeartNotes: (key: string) => void;
  setBaseNotes: (key: string) => void;
  setSelectedAromas: (key: string) => void;
  setCurrentPage: (page: number) => void;
  setFilters: (filters: Filters) => void;
  setOrderBy: (value: string) => void;
  resetFilters: () => void;
  setCategory: (category: number) => void;
  setProductGroup: (productGroup: number | null) => void;
}

export const useFiltersStore = create<FiltersStore>((set, get) => ({
  // Начальное состояние фильтров
  gender: new Set<string>(),
  concentration: new Set<string>(),
  brands: new Set<string>(),
  classification: new Set<string>(),
  topNotes: new Set<string>(),
  heartNotes: new Set<string>(),
  baseNotes: new Set<string>(),
  aromas: new Set<string>(),
  prices: {},
  orderBy: {},
  category: 1,
  productGroup: null,
  currentPage: 1,

  setCategory: (category: number) => set({ category, currentPage: 1 }),

  setProductGroup: (productGroup: number | null) => 
    set(() => ({ productGroup, currentPage: 1 })),
  

  setPrices: (name, value) =>
    set((state) => ({
      prices: { ...state.prices, [name]: value },
    })),

  setSelectedGender: (key) =>
    set((state) => {
      const newSet = new Set(state.gender);
      newSet.has(key) ? newSet.delete(key) : newSet.add(key);
      return { gender: newSet };
    }),

  setSelectedConcentration: (key) =>
    set((state) => {
      const newSet = new Set(state.concentration);
      newSet.has(key) ? newSet.delete(key) : newSet.add(key);
      return { concentration: newSet };
    }),

  setSelectedBrands: (key) =>
    set((state) => {
      const newSet = new Set(state.brands);
      newSet.has(key) ? newSet.delete(key) : newSet.add(key);
      return { brands: newSet };
    }),

  setSelectedClassification: (key) =>
    set((state) => {
      const newSet = new Set(state.classification);
      newSet.has(key) ? newSet.delete(key) : newSet.add(key);
      return { classification: newSet };
    }),

  setTopNotes: (key) =>
    set((state) => {
      const newSet = new Set(state.topNotes);
      newSet.has(key) ? newSet.delete(key) : newSet.add(key);
      return { topNotes: newSet };
    }),

  setHeartNotes: (key) =>
    set((state) => {
      const newSet = new Set(state.heartNotes);
      newSet.has(key) ? newSet.delete(key) : newSet.add(key);
      return { heartNotes: newSet };
    }),


  setBaseNotes: (key) =>
    set((state) => {
      const newSet = new Set(state.baseNotes);
      newSet.has(key) ? newSet.delete(key) : newSet.add(key);
      return { baseNotes: newSet };
    }),

  setSelectedAromas: (key) =>
    set((state) => {
      const newSet = new Set(state.aromas);
      newSet.has(key) ? newSet.delete(key) : newSet.add(key);
      return { aromas: newSet };
    }),

  setOrderBy: (value: string) => {
    const orderBy = ((): OrderByType => {
      switch (value) {
        case "nameAsc":
          return { name: "asc" };
        case "nameDesc":
          return { name: "desc" };
        case "priceAsc":
          return { price: "asc" };
        case "priceDesc":
          return { price: "desc" };
        default:
          return {};
      }
    })();
    set({ orderBy: orderBy });
  },

  setCurrentPage: (page) => set(() => ({ currentPage: page })),

  setFilters: (newFilters) => set(() => newFilters),

  resetFilters: () =>
    set({
      gender: new Set<string>(),
      concentration: new Set<string>(),
      brands: new Set<string>(),
      classification: new Set<string>(),
      topNotes: new Set<string>(),
      heartNotes: new Set<string>(),
      baseNotes: new Set<string>(),
      aromas: new Set<string>(),
      prices: {},
      orderBy: {},
      currentPage: 1,
      productGroup: null,
    }),
}));
