import {
  ApplicationMethod,
  Aroma,
  Brand,
  Classification,
  Effect,
  Finish,
  Formula,
  Note,
  PackagingFormat,
  Purpose,
  SkinType,
  Texture,
} from "@prisma/client";
import { create } from "zustand";
import { Api } from "../services/api-client";
import { updateMetaList } from "../lib";

export type MetaValues = {
  labelRu: string;
  labelDe: string;
};
export interface ProductMeta {
  notes: Note[];
  aromas: Aroma[];
  brands: Brand[];
  classifications: Classification[];
  effects: Effect[];
  purposes: Purpose[];
  skinTypes: SkinType[];
  packagingFormats: PackagingFormat[];
  finishes: Finish[];
  applicationMethods: ApplicationMethod[];
  textures: Texture[];
  formulas: Formula[];
}
export interface ProductMetaState {
  productMeta: ProductMeta;
  loading: boolean;
  error: boolean;

  fetchProductMeta: () => Promise<void>;
  createBrand: (brandName: { name: string }) => Promise<void>;
  deleteBrand: (id: number) => Promise<void>;
  createAroma: (values: MetaValues) => Promise<void>;
  deleteAroma: (id: number) => Promise<void>;
  createNote: (values: MetaValues) => Promise<void>;
  deleteNote: (id: number) => Promise<void>;
  createClassification: (values: MetaValues) => Promise<void>;
  deleteClassification: (id: number) => Promise<void>;
  createEffect: (values: MetaValues) => Promise<void>;
  deleteEffect: (id: number) => Promise<void>;
  createSkinType: (values: MetaValues) => Promise<void>;
  deleteSkinType: (id: number) => Promise<void>;
  createPackagingFormat: (values: MetaValues) => Promise<void>;
  deletePackagingFormat: (id: number) => Promise<void>;
  createFinish: (values: MetaValues) => Promise<void>;
  deleteFinish: (id: number) => Promise<void>;
  createApplicationMethod: (values: MetaValues) => Promise<void>;
  deleteApplicationMethod: (id: number) => Promise<void>;
  createTexture: (values: MetaValues) => Promise<void>;
  deleteTexture: (id: number) => Promise<void>;
  createFormula: (values: MetaValues) => Promise<void>;
  deleteFormula: (id: number) => Promise<void>;
  createPurpose: (values: MetaValues) => Promise<void>;
  deletePurpose: (id: number) => Promise<void>;
}

export const useProductMetaStore = create<ProductMetaState>()((set) => ({
  productMeta: {
    notes: [],
    aromas: [],
    brands: [],
    classifications: [],
    effects: [],
    purposes: [],
    skinTypes: [],
    packagingFormats: [],
    finishes: [],
    applicationMethods: [],
    textures: [],
    formulas: [],
  },
  loading: true,
  error: false,

  fetchProductMeta: async () => {
    try {
      set({ loading: true, error: false });
      const data = await Api.productMeta.fetchProductMeta();
      console.log(data);
      set({ productMeta: data });
    } catch (error) {
      console.error(error);
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },

  createNote: async (note: MetaValues) => {
    try {
      set({ loading: true, error: false });
      const data = await Api.productMeta.createNote(note);
      set((state) => ({
        productMeta: {
          ...state.productMeta,
          notes: [...state.productMeta.notes, data],
        },
      }));
    } catch (error) {
      console.error(error);
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },

  deleteNote: async (id: number) => {
    try {
      set({ loading: true, error: false });
      const data = await Api.productMeta.deleteNote(id);
      set((state) => ({
        productMeta: { ...state.productMeta, notes: data },
      }));
    } catch (error) {
      console.error(error);
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },

  createAroma: async (data) => {
    await updateMetaList(
      set,
      "aromas",
      () => Api.productMeta.createAroma(data)
    );
  },

  deleteAroma: async (id: number) => {
    try {
      set({ loading: true, error: false });
      const data = await Api.productMeta.deleteAroma(id);
      set((state) => ({
        productMeta: { ...state.productMeta, aromas: data },
      }));
    } catch (error) {
      console.error(error);
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },

  createBrand: async (data: { name: string }) => {
    try {
      set({ loading: true, error: false });
      const res = await Api.productMeta.createBrand(data);
      set((state) => ({
        productMeta: {
          ...state.productMeta,
          brands: [...state.productMeta.brands, res],
        },
      }));
    } catch (error) {
      console.error(error);
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },

  deleteBrand: async (id: number) => {
    try {
      set({ loading: true, error: false });
      const data = await Api.productMeta.deleteBrand(id);
      set((state) => ({ productMeta: { ...state.productMeta, brands: data } }));
    } catch (error) {
      console.error(error);
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },

  createClassification: async (data: MetaValues) => {
    try {
      set({ loading: true, error: false });
      const res = await Api.productMeta.createClassification(data);
      set((state) => ({
        productMeta: {
          ...state.productMeta,
          classifications: [...state.productMeta.classifications, res],
        },
      }));
    } catch (error) {
      console.error(error);
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },

  deleteClassification: async (id: number) => {
    try {
      set({ loading: true, error: false });
      const data = await Api.productMeta.deleteClassification(id);
      set((state) => ({
        productMeta: { ...state.productMeta, classifications: data },
      }));
    } catch (error) {
      console.error(error);
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },

  createFinish: async (data: MetaValues) => {
    try {
      set({ loading: true, error: false });
      const res = await Api.productMeta.createFinish(data);
      set((state) => ({
        productMeta: {
          ...state.productMeta,
          finishes: [...state.productMeta.finishes, res],
        },
      }));
    } catch (error) {
      console.error(error);
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },

  deleteFinish: async (id: number) => {
    try {
      set({ loading: true, error: false });
      const data = await Api.productMeta.deleteFinish(id);
      set((state) => ({
        productMeta: { ...state.productMeta, finishes: data },
      }));
    } catch (error) {
      console.error(error);
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },

  createApplicationMethod: async (data: MetaValues) => {
    try {
      set({ loading: true, error: false });
      const res = await Api.productMeta.createApplicationMethod(data);
      set((state) => ({
        productMeta: {
          ...state.productMeta,
          applicationMethods: [...state.productMeta.applicationMethods, res],
        },
      }));
    } catch (error) {
      console.error(error);
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },

  deleteApplicationMethod: async (id: number) => {
    try {
      set({ loading: true, error: false });
      const data = await Api.productMeta.deleteApplicationMethod(id);
      set((state) => ({
        productMeta: { ...state.productMeta, applicationMethods: data },
      }));
    } catch (error) {
      console.error(error);
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },

  createSkinType: async (data: MetaValues) => {
    try {
      set({ loading: true, error: false });
      const res = await Api.productMeta.createSkinType(data);
      set((state) => ({
        productMeta: {
          ...state.productMeta,
          skinTypes: [...state.productMeta.skinTypes, res],
        },
      }));
    } catch (error) {
      console.error(error);
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },

  deleteSkinType: async (id: number) => {
    try {
      set({ loading: true, error: false });
      const data = await Api.productMeta.deleteSkinType(id);
      set((state) => ({
        productMeta: { ...state.productMeta, skinTypes: data },
      }));
    } catch (error) {
      console.error(error);
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },

  createPackagingFormat: async (data: MetaValues) => {
    try {
      set({ loading: true, error: false });
      const res = await Api.productMeta.createPackagingFormat(data);
      set((state) => ({
        productMeta: {
          ...state.productMeta,
          packagingFormats: [...state.productMeta.packagingFormats, res],
        },
      }));
    } catch (error) {
      console.error(error);
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },

  deletePackagingFormat: async (id: number) => {
    try {
      set({ loading: true, error: false });
      const data = await Api.productMeta.deletePackagingFormat(id);
      set((state) => ({
        productMeta: { ...state.productMeta, packagingFormats: data },
      }));
    } catch (error) {
      console.error(error);
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },

  createTexture: async (data: MetaValues) => {
    try {
      set({ loading: true, error: false });
      const res = await Api.productMeta.createTexture(data);
      set((state) => ({
        productMeta: {
          ...state.productMeta,
          textures: [...state.productMeta.textures, res],
        },
      }));
    } catch (error) {
      console.error(error);
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },

  deleteTexture: async (id: number) => {
    try {
      set({ loading: true, error: false });
      const data = await Api.productMeta.deleteTexture(id);
      set((state) => ({
        productMeta: { ...state.productMeta, textures: data },
      }));
    } catch (error) {
      console.error(error);
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },

  createFormula: async (data: MetaValues) => {
    try {
      set({ loading: true, error: false });
      const res = await Api.productMeta.createFormula(data);
      set((state) => ({
        productMeta: {
          ...state.productMeta,
          formulas: [...state.productMeta.formulas, res],
        },
      }));
    } catch (error) {
      console.error(error);
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },

  deleteFormula: async (id: number) => {
    try {
      set({ loading: true, error: false });
      const data = await Api.productMeta.deleteFormula(id);
      set((state) => ({
        productMeta: { ...state.productMeta, formulas: data },
      }));
    } catch (error) {
      console.error(error);
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },

  createEffect: async (data: MetaValues) => {
    try {
      set({ loading: true, error: false });
      const res = await Api.productMeta.createEffect(data);
      set((state) => ({
        productMeta: {
          ...state.productMeta,
          effects: [...state.productMeta.effects, res],
        },
      }));
    } catch (error) {
      console.error(error);
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },

  deleteEffect: async (id: number) => {
    try {
      set({ loading: true, error: false });
      const data = await Api.productMeta.deleteEffect(id);
      set((state) => ({
        productMeta: { ...state.productMeta, effects: data },
      }));
    } catch (error) {
      console.error(error);
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },

  createPurpose: async (data: MetaValues) => {
    try {
      set({ loading: true, error: false });
      const res = await Api.productMeta.createPurpose(data);
      set((state) => ({
        productMeta: {
          ...state.productMeta,
          purposes: [...state.productMeta.purposes, res],
        },
      }));
    } catch (error) {
      console.error(error);
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },

  deletePurpose: async (id: number) => {
    try {
      set({ loading: true, error: false });
      const data = await Api.productMeta.deletePurpose(id);
      set((state) => ({
        productMeta: { ...state.productMeta, purposes: data },
      }));
    } catch (error) {
      console.error(error);
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },
}));
