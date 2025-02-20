import {create} from "zustand";

interface PriceProps {
  priceFrom?: number;
  priceTo?: number;
}

export interface Filters {
  gender: Set<string>;
  concentration: Set<string>;
  brands: Set<string>;
  types: Set<string>;
  notes: Set<string>;
  prices: PriceProps;
  currentPage: number;
}

interface FiltersStore extends Filters {
  setPrices: (name: keyof PriceProps, value: number) => void;
  setSelectedGender: (key: string) => void;
  setSelectedConcentration: (key: string) => void;
  setSelectedBrands: (key: string) => void;
  setSelectedTypes: (key: string) => void;
  setSelectedNotes: (key: string) => void;
  setCurrentPage: (page: number) => void;
  setFilters: (filters: Filters) => void;
  resetFilters: () => void;
}

export const useFiltersStore = create<FiltersStore>((set, get) => ({
  // Начальное состояние фильтров
  gender: new Set<string>(),
  concentration: new Set<string>(),
  brands: new Set<string>(),
  types: new Set<string>(),
  notes: new Set<string>(),
  prices: {},
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

  setSelectedTypes: (key) =>
    set((state) => {
      const newSet = new Set(state.types);
      newSet.has(key) ? newSet.delete(key) : newSet.add(key);
      return { types: newSet };
    }),

  setSelectedNotes: (key) =>
    set((state) => {
      const newSet = new Set(state.notes);
      newSet.has(key) ? newSet.delete(key) : newSet.add(key);
      return { notes: newSet };
    }),

  setCurrentPage: (page) => set(() => ({ currentPage: page })),

  // Метод для установки всех фильтров сразу
  setFilters: (newFilters) => set(() => newFilters),

  resetFilters: () =>
    set({
      gender: new Set<string>(),
      concentration: new Set<string>(),
      brands: new Set<string>(),
      types: new Set<string>(),
      notes: new Set<string>(),
      prices: {},
      currentPage: 1,
    }),
}));
