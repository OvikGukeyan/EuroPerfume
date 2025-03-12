import { Order, OrderItem, Product } from "@prisma/client";


export interface OrderDTO extends Order {
    items: OrderItem[]
}