import { AddOrderItemBody } from "@/src/app/api/order-item/[id]/route";
import { OrderDTO } from "./dto/orders.dto";
import { axiosInstance } from "./instance";


export const fetchOrder = async (orderId: number): Promise<OrderDTO> => {
  return (await axiosInstance.get('/order/' + orderId)).data;
}
export type OrderMutationResponse={ok:boolean;orderId:number;subtotal:number;totalAmount:number;itemsCount:number};
export const removeOrderItem = async (itemId: number): Promise<OrderMutationResponse> => {
  return (await axiosInstance.delete('/order-item/' + itemId)).data;
}


export const updateOrderItem = async (delta: number, itemId: number): Promise<OrderMutationResponse> => {
  return (await axiosInstance.patch('/order-item/' + itemId, { delta: delta })).data;
}

export const addOrderItem = async (data: AddOrderItemBody): Promise<OrderMutationResponse> => {
  return (await axiosInstance.post('/order-item/' + data.orderId, data)).data;
}