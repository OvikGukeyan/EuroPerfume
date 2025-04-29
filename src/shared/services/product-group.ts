import { ProductGroup } from "@prisma/client";
import { axiosInstance } from "./instance";
import { ProductGroupValues } from "../store";


export const fetchProductGroups = async () => {
    return (await axiosInstance.get<ProductGroup[]>("/product-group")).data;
}

export const createProductGroup = async (data: ProductGroupValues): Promise<ProductGroup> => {
  return (await axiosInstance.post<ProductGroup>("/product-group", { data })).data;
};
