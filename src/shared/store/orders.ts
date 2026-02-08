import { Api } from "../services/api-client";
import { create } from "zustand";
import { OrderDTO } from "../services/dto/orders.dto";
import { OrderStatus } from '@prisma/client';

export interface OrdersState {
  loading: boolean;
  error: boolean;
  orders: OrderDTO[];

  fetchOrders: () => Promise<void>;
  removeOrder: (id: number) => Promise<void>;
  changeOrderStatus: (id: number, status: OrderStatus) => Promise<void>;
}

export const useOrdersStore = create<OrdersState>((set, get) => ({
  orders: [],
  loading: true,
  error: false,

  fetchOrders: async () => {
    try {
      set({ loading: true, error: false });
      const data = await Api.orders.fetchOrders();
      set({ orders: data });
    } catch (error) {
      console.error(error);
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },
  removeOrder: async (id: number) => {
    try {
      set({ loading: true, error: false });
      const data = await Api.orders.removeOrder(id);
      set({orders: get().orders.filter(item => item.id !== data.id)});
    } catch (error) {
      set({ error: true });
      console.error(error);
    } finally {
      set({ loading: false });

    }
  },

  changeOrderStatus: async (itemId: number, status: OrderStatus) => {
    try {
      set({ loading: true, error: false });
      const data = await Api.orders.updateOrderStatus(itemId, status);
      set({orders: get().orders.map(item => item.id === itemId ? { ...item, status: data.status } : item)});
    } catch (error) {
      set({ error: true });
      console.error(error);
    } finally {
      set({ loading: false });
    }
  }
}));
