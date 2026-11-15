import { axiosInstance } from "./instance";
import { FavoritesDTO } from "./dto/favorites.dto";

export const getFavorites = async (): Promise<FavoritesDTO> => {
  return (await axiosInstance.get<FavoritesDTO>('/favorites',{timeout:10000})).data;
};



export const addFavoritesItem = async (productId: number, selected?:boolean): Promise<FavoritesDTO> => {
  return (await axiosInstance.post('/favorites', {productId,selected}, {timeout:10000})).data;
}