import { Product } from '@prisma/client';
import { ApiRouts } from './constants';
import { axiosInstance } from "./instance"

export const search = async (query?: string): Promise<Product[]> => {
    const {data} = await axiosInstance.get<Product[]>(ApiRouts.SEARCH_PRODUCTS, {params: {query}});

    return data
}

export const getAll = async (): Promise<Product[]> => {
    console.log('getAll')
    const {data} = await axiosInstance.get<Product[]>(ApiRouts.PRODUCTS);
    console.log(data)
    return data
}

