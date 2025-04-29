import { Brand } from "@prisma/client";
import { axiosInstance } from "./instance";

export const fetchBrands = async (): Promise<Brand[]> => {
  return (await axiosInstance.get<Brand[]>("/brands")).data;
};

export const createBrand = async (data: {name: string}): Promise<Brand> => {
  return (await axiosInstance.post<Brand>("/brands", { data })).data;
};