import { AddOrderItemBody } from "@/src/app/api/order-item/[id]/route";
import { Api } from "../services/api-client";
import { OrderDTO } from "../services/dto/orders.dto";
import { create } from "zustand";
import { ProductDTO } from "../services/dto/product.dto";
import toast from "react-hot-toast";



export interface OrderItemsState {
  loading: boolean;
  itemLoading: boolean;
  error: boolean;
  totalAmount: number;
  order: OrderDTO | null;

  fetchOrder: (id: number) => Promise<void>;
  updateItemQuantity: (id: number, quantity: number) => Promise<void>;
  addOrderItem: (orderId: number, product: ProductDTO,  variationId: number | undefined, quantity?: number,) => Promise<void>;
  removeOrderItem: (id: number) => Promise<void>;
}

export const useOrderItemsStore = create<OrderItemsState>((set) => ({
  order: null,
  loading: true,
  itemLoading: false,
  error: false,
  totalAmount: 0,

  fetchOrder: async (id: number) => {
    try {
      set({ loading: true, error: false });
      const data = await Api.orderItem.fetchOrder(id);
      set({ order: data });
    } catch (error) {
      console.error(error);
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },

  removeOrderItem: async (id: number) => {
    try{
      set({itemLoading:true,error:false});
      const result=await Api.orderItem.removeOrderItem(id);
      const fresh=await Api.orderItem.fetchOrder(result.orderId);
      set({order:fresh,totalAmount:Number(fresh.totalAmount)});
    }catch(e){
      set({error:true});
      toast.error("Не удалось изменить заявку. Проверьте статус заказа.");
      console.error(e);
    }finally{set({itemLoading:false});}
  },

  updateItemQuantity: async (id: number, delta: number) => {
    try{
      set({itemLoading:true,error:false});
      const result=await Api.orderItem.updateOrderItem(delta,id);
      const fresh=await Api.orderItem.fetchOrder(result.orderId);
      set({order:fresh,totalAmount:Number(fresh.totalAmount)});
    }catch(e){
      set({error:true});
      toast.error("Не удалось пересчитать заявку.");
      console.error(e);
    }finally{set({itemLoading:false});}
  },

  addOrderItem: async (orderId: number, product: ProductDTO,variationId: number | undefined,quantity=1) => {
    try{
      set({itemLoading:true,error:false});
      await Api.orderItem.addOrderItem({orderId,productId:product.id,variationId,quantity});
      const fresh=await Api.orderItem.fetchOrder(orderId);
      set({order:fresh,totalAmount:Number(fresh.totalAmount)});
    }catch(e){
      set({error:true});
      toast.error("Не удалось добавить товар в заявку.");
      console.error(e);
    }finally{set({itemLoading:false});}
  }
}));
