import { Aroma } from "@prisma/client";
import { axiosInstance } from "./instance";
import { AromaValues } from "../store/aromas";

export const fetchAromas = async (): Promise<Aroma[]> => {
  return (await axiosInstance.get<Aroma[]>("/aromas")).data;
};

export const createAroma = async (data: AromaValues): Promise<Aroma> => {
  return (await axiosInstance.post<Aroma>("/aromas", { data })).data;
};
