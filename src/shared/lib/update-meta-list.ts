import { ProductMeta } from "../store";

export const updateMetaList = async <T>(
  set: any,
  key: keyof ProductMeta,
  apiCall: () => Promise<T>,
) => {
  try {
    set({ loading: true, error: false });
    const newItemOrList = await apiCall();
    set((state: any) => ({
      productMeta: {
        ...state.productMeta,
        [key]: [...state.productMeta[key], newItemOrList],
      },
    }));
  } catch (error) {
    console.error(error);
    set({ error: true });
  } finally {
    set({ loading: false });
  }
};