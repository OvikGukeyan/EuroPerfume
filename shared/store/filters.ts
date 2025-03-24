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
  notes: Set<string>;
  prices: PriceProps;
  orderBy: OrderByType;
  currentPage: number;
}

interface FiltersStore extends Filters {
  setPrices: (name: keyof PriceProps, value: number) => void;
  setSelectedGender: (key: string) => void;
  setSelectedConcentration: (key: string) => void;
  setSelectedBrands: (key: string) => void;
  setSelectedClassification: (key: string) => void;
  setSelectedNotes: (key: string) => void;
  setCurrentPage: (page: number) => void;
  setFilters: (filters: Filters) => void;
  setOrderBy: (value: string) => void;
  resetFilters: () => void;
}

export const useFiltersStore = create<FiltersStore>((set, get) => ({
  // Начальное состояние фильтров
  gender: new Set<string>(),
  concentration: new Set<string>(),
  brands: new Set<string>(),
  classification: new Set<string>(),
  notes: new Set<string>(),
  prices: {},
  orderBy: {},
  currentPage: 1,

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

  setSelectedNotes: (key) =>
    set((state) => {
      const newSet = new Set(state.notes);
      newSet.has(key) ? newSet.delete(key) : newSet.add(key);
      return { notes: newSet };
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

  // Метод для установки всех фильтров сразу
  setFilters: (newFilters) => set(() => newFilters),

  resetFilters: () =>
    set({
      gender: new Set<string>(),
      concentration: new Set<string>(),
      brands: new Set<string>(),
      classification: new Set<string>(),
      notes: new Set<string>(),
      prices: {},
      orderBy: {},
      currentPage: 1,
    }),
}));
