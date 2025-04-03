import { Cart, CartItem, Product, ProductVariation } from "@prisma/client";
import { ProductDTO } from "./product.dto";

export type CartItemDTO = CartItem & {
  product: Product;
  variation?: ProductVariation;
};

export interface CartDTO extends Cart {
  items: CartItemDTO[];
}

export interface CreateCartItemValues {
  productId: number;
  volume: number;
  variationId?: number;
}
