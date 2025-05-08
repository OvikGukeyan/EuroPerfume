import { Recommendations } from './../components/shared/recommendations';
import { ApiRouts } from "./constants";
import { axiosInstance } from "./instance";
import { ProductDTO, ProductsWithPagination } from "./dto/product.dto";
import { GetSearchParams } from '../lib/find-products';
import { Product } from '@prisma/client';
import { RecommendationsParams } from '../hooks/use-recommendations';

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


