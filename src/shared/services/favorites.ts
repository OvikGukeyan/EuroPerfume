import { axiosInstance } from "./instance";
import { FavoritesDTO } from "./dto/favorites.dto";

export const getFavorites = async (): Promise<FavoritesDTO> => {
  return (await axiosInstance.get<FavoritesDTO>('/favorites')).data;
};



export const addFavoritesItem = async (productId: number): Promise<FavoritesDTO> => {
  return (await axiosInstance.post('/favorites', productId)).data;
}