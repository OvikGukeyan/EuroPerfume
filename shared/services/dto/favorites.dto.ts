import { Favorites, FavoritesItem, Product } from "@prisma/client";

export type FavoritesItemDTO = FavoritesItem & {
  product: Product;
};

export interface FavoritesDTO extends Favorites {
  items: FavoritesItemDTO[];
}

export interface CreateFavoritesItemValues {
  productId: number;
}
