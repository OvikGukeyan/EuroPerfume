import {
  Brand,
  Order,
  OrderItem,
  Product,
  ProductGroup,
  ProductVariation,
} from "@prisma/client";

export type OrderItemDTO = Omit<OrderItem, "variation" | "product"> & {
  variation: ProductVariation;
  product: Product & { brand: Brand, productGroup?: ProductGroup };
};
export type SafeOrder = Omit<Order, "totalAmount"> & {
  totalAmount: number;
};
export interface OrderDTO extends SafeOrder {
  items: OrderItemDTO[];
}
