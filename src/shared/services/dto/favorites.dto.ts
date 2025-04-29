import { Favorites, FavoritesItem } from "@prisma/client";
import { ProductDTO } from "./product.dto";

export type FavoritesItemDTO = FavoritesItem & {
  product: ProductDTO;
};

export interface FavoritesDTO extends Favorites {
  items: FavoritesItemDTO[];
}

export interface CreateFavoritesItemValues {
  productId: number;
}
