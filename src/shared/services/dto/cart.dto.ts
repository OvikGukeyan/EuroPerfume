import { Brand, Cart, CartItem, Product, ProductGroup, ProductVariation } from "@prisma/client";
import { ProductDTO, SafeProduct } from "./product.dto";

export type SafeCart = Omit<Cart, "totalAmount"> & {
  totalAmount: number;
};
export type CartItemDTO = CartItem & {
  product: (SafeProduct & {
    productGroup?: ProductGroup;
    brand: Brand;
  });
  variation?: ProductVariation;
};

export interface CartDTO extends SafeCart {
  items: CartItemDTO[];
}

export interface CreateCartItemValues {
  productId: number;
  volume: number;
  variationId?: number;
}
