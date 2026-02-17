import { AddOrderItemBody } from "@/src/app/api/order-item/[id]/route";
import { OrderDTO } from "./dto/orders.dto";
import { axiosInstance } from "./instance";


export const fetchOrder = async (orderId: number): Promise<OrderDTO> => {
  console.log(orderId, 'orderId');
  return (await axiosInstance.get('/order/' + orderId)).data;
}
export const removeOrderItem = async (itemId: number): Promise<OrderDTO> => {
  return (await axiosInstance.delete('/order-item/' + itemId)).data;
}


export const updateOrderItem = async (delta: number, itemId: number): Promise<OrderDTO> => {
  return (await axiosInstance.patch('/order-item/' + itemId, { delta: delta })).data;
}

export const addOrderItem = async (data: AddOrderItemBody): Promise<OrderDTO> => {
  return (await axiosInstance.post('/order-item', data)).data;
}