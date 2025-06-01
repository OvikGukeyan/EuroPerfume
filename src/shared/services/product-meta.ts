import { MetaValues, ProductMeta } from './../store';
import { Aroma, Brand, Note } from "@prisma/client";
import { axiosInstance } from "./instance";

export const fetchProductMeta = async (): Promise<ProductMeta> => {
  return (await axiosInstance.get<ProductMeta>("/product-meta")).data;
};

export const createNote = async (data: MetaValues): Promise<Note> => {
  return (await axiosInstance.post<Note>("/product-meta/notes", { data })).data;
};

export const deleteNote = async (id: number): Promise<Note[]> => {
  return (await axiosInstance.delete<Note[]>(`/product-meta/notes/${id}`)).data;
};  

export const createAroma = async (data: MetaValues): Promise<Aroma> => {
  return (await axiosInstance.post<Aroma>("/product-meta/aromas", { data })).data;
};

export const deleteAroma = async (id: number): Promise<Aroma[]> => {
  return (await axiosInstance.delete<Aroma[]>(`/product-meta/aromas/${id}`)).data;
};

export const createBrand = async (data: {name: string}): Promise<Brand> => {
  return (await axiosInstance.post<Brand>("/product-meta/brands", { data })).data;
};

export const deleteBrand = async (id: number): Promise<Brand[]> => {
  return (await axiosInstance.delete<Brand[]>(`/product-meta/brands/${id}`)).data;
};

export const createClassification = async (data: MetaValues): Promise<Aroma> => {
  return (await axiosInstance.post<Aroma>("/product-meta/classifications", { data })).data;
};

export const deleteClassification = async (id: number): Promise<Aroma[]> => {
  return (await axiosInstance.delete<Aroma[]>(`/product-meta/classifications/${id}`)).data;
};

export const createEffect = async (data: MetaValues): Promise<Aroma> => {
  return (await axiosInstance.post<Aroma>("/product-meta/effects", { data })).data;
};

export const deleteEffect = async (id: number): Promise<Aroma[]> => {
  return (await axiosInstance.delete<Aroma[]>(`/product-meta/effects/${id}`)).data;
};

export const createSkinType = async (data: MetaValues): Promise<Aroma> => {
  return (await axiosInstance.post<Aroma>("/product-meta/skin-types", { data })).data;
};

export const deleteSkinType = async (id: number): Promise<Aroma[]> => {
  return (await axiosInstance.delete<Aroma[]>(`/product-meta/skin-types/${id}`)).data;
};

export const createPackagingFormat = async (data: MetaValues): Promise<Aroma> => {
  return (await axiosInstance.post<Aroma>("/product-meta/packaging-formats", { data })).data;
};

export const deletePackagingFormat = async (id: number): Promise<Aroma[]> => {
  return (await axiosInstance.delete<Aroma[]>(`/product-meta/packaging-formats/${id}`)).data;
};

export const createFinish = async (data: MetaValues): Promise<Aroma> => {
  return (await axiosInstance.post<Aroma>("/product-meta/finishes", { data })).data;
};

export const deleteFinish = async (id: number): Promise<Aroma[]> => {
  return (await axiosInstance.delete<Aroma[]>(`/product-meta/finishes/${id}`)).data;
};

export const createApplicationMethod = async (data: MetaValues): Promise<Aroma> => {
  return (await axiosInstance.post<Aroma>("/product-meta/application-methods", { data })).data;
};

export const deleteApplicationMethod = async (id: number): Promise<Aroma[]> => {
  return (await axiosInstance.delete<Aroma[]>(`/product-meta/application-methods/${id}`)).data;
};

export const createTexture = async (data: MetaValues): Promise<Aroma> => {
  return (await axiosInstance.post<Aroma>("/product-meta/textures", { data })).data;
};

export const deleteTexture = async (id: number): Promise<Aroma[]> => {
  return (await axiosInstance.delete<Aroma[]>(`/product-meta/textures/${id}`)).data;
};

export const createFormula = async (data: MetaValues): Promise<Aroma> => {
  return (await axiosInstance.post<Aroma>("/product-meta/formulas", { data })).data;
};

export const deleteFormula = async (id: number): Promise<Aroma[]> => {
  return (await axiosInstance.delete<Aroma[]>(`/product-meta/formulas/${id}`)).data;
};

export const createPurpose = async (data: MetaValues): Promise<Aroma> => {
  return (await axiosInstance.post<Aroma>("/product-meta/purposes", { data })).data;
};

export const deletePurpose = async (id: number): Promise<Aroma[]> => {
  return (await axiosInstance.delete<Aroma[]>(`/product-meta/purposes/${id}`)).data;
};

