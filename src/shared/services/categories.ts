import { CategoriesDTO } from "./dto/categories.dto";
import { axiosInstance } from "./instance";

export const fetchCategories = async (): Promise<CategoriesDTO[]> => {
      return (await axiosInstance.get<CategoriesDTO[]>('/categories')).data;
}