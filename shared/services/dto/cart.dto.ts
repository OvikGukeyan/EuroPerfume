import { Cart, CartItem } from "@prisma/client";
import { ProductDTO } from "./product.dto";

export type CartItemDTO = CartItem & {
  product: ProductDTO;
};

export interface CartDTO extends Cart {
  items: CartItemDTO[];
}

export interface CreateCartItemValues {
  productId: number;
  volume: number
}
