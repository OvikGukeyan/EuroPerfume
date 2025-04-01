import { Order, OrderItem } from "@prisma/client";


export interface OrderDTO extends Order {
    items: OrderItem[]
}