import { Aroma, Note } from "@prisma/client";
import { create } from "zustand";
import { Api } from "../services/api-client";

export type AromaValues = {
    labelRu: string;
    labelDe: string;
}
export interface AromasState {
    aromas: Aroma[];
    loading: boolean;
    error: boolean;

    fetchAromas: () => Promise<void>;
    createAroma: (note: AromaValues) => Promise<void>;
    deleteAroma: (id: number) => Promise<void>;
}

export const useAromasStore = create<AromasState>()((set) => ({
    aromas: [],
    loading: true,
    error: false,

    fetchAromas: async () => {
        try {
            set({ loading: true, error: false });
            const data = await Api.aromas.fetchAromas();
            set({ aromas: data });
        } catch (error) {
            console.error(error);
            set({ error: true });
        } finally {
            set({ loading: false });
        }
    },

    createAroma: async (aroma: AromaValues) => {
        try {
            set({ loading: true, error: false });
            const data = await Api.aromas.createAroma(aroma);
            set((state) => ({
                aromas: [...state.aromas, data]  
              }));
        } catch (error) {
            console.error(error);
            set({ error: true });
        } finally {
            set({ loading: false });
        }
    },

    deleteAroma: async (id: number) => {
        try {
            set({ loading: true, error: false });
            const data = await Api.aromas.deleteAroma(id);
            set({ aromas: data });
        } catch (error) {
            console.error(error);
            set({ error: true });
        } finally {
            set({ loading: false });
        }
    }
}));