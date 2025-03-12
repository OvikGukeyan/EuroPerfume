import { OrderStatus } from "@prisma/client";
import { OrderDTO } from "./dto/orders.dto";
import { axiosInstance } from "./instance";

export const fetchOrders = async (): Promise<OrderDTO[]> => {
      return (await axiosInstance.get<OrderDTO[]>('/order')).data;
}

export const removeOrder = async (orderId: number): Promise<OrderDTO[]> => {
  return (await axiosInstance.delete('/order/' + orderId)).data;
}

export const updateOrderStatus = async (itemId: number, status: OrderStatus): Promise<OrderDTO[]> => {
  return (await axiosInstance.patch('/order/' + itemId, { status })).data;
}