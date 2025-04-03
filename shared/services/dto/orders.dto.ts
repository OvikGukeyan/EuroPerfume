import { Order, OrderItem, Product, ProductVariation } from "@prisma/client";


export interface OrderDTO extends Order {
    items: (OrderItem & {variation: ProductVariation})[]
}