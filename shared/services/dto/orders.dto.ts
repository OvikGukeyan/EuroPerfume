import { Order, OrderItem, Product, ProductVariation } from "@prisma/client";

export type SafeOrder = Omit<Order, 'totalAmount'> & {
    totalAmount: number
}
export interface OrderDTO extends SafeOrder {
    items: (OrderItem & {variation: ProductVariation})[]
}