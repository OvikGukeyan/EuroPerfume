import { Product, ProductVariation } from "@prisma/client";
import { ApiRouts } from "./constants";
import { axiosInstance } from "./instance";
import { ProductDTO } from "./dto/product.dto";

export const search = async (query?: string): Promise<ProductDTO[]> => {
  const { data } = await axiosInstance.get<ProductDTO[]>(
    ApiRouts.SEARCH_PRODUCTS,
    { params: { query } }
  );

  return data;
};

export const getAll = async (): Promise<ProductDTO[]> => {
  const { data } = await axiosInstance.get<ProductDTO[]>(ApiRouts.PRODUCTS);
  return data;
};
