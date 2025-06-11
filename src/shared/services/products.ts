import { ApiRouts } from "./constants";
import { axiosInstance } from "./instance";
import { ProductDTO, ProductsWithPagination } from "./dto/product.dto";
import { GetSearchParams } from '../lib/find-products';

export const search = async (query?: string): Promise<ProductDTO[]> => {
  const { data } = await axiosInstance.get<ProductDTO[]>(
    ApiRouts.SEARCH_PRODUCTS,
    { params: { query } }
  );

  return data;
};

export const getAll = async (
  params?: GetSearchParams
): Promise<ProductsWithPagination> => {
  const { data } = await axiosInstance.get<ProductsWithPagination>(
    ApiRouts.PRODUCTS,
    {
      params,           
    }
  );
  return data;
};

export const getByIds = async (ids: string[]): Promise<ProductDTO[]> => {
  const { data } = await axiosInstance.get<ProductDTO[]>(ApiRouts.BY_IDS, {
    params: { ids: ids },
  });
  return data;
};


export const getPopularProducts = async (): Promise<ProductDTO[]> => {
  const { data } = await axiosInstance.get<ProductDTO[]>(
    ApiRouts.POPULAR_PRODUCTS
  );
  return data;
};