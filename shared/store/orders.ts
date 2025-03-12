import { removeOrder } from './../services/orders';
import { Api } from "../services/api-client";
import { create } from "zustand";
import { OrderDTO } from "../services/dto/orders.dto";

export interface OrdersState {
  loading: boolean;
  itemLoading: boolean;
  error: boolean;
  items: OrderDTO[];

  fetchOrders: () => Promise<void>;
  removeOrder: (id: number) => Promise<void>;
}

export const useOrdersStore = create<OrdersState>((set, get) => ({
  items: [],
  loading: true,
  itemLoading: false,
  error: false,

  fetchOrders: async () => {
    try {
      set({ loading: true, error: false });
      const data = await Api.orders.fetchOrders();
      set({ items: data });
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
      // set({items: data});
    } catch (error) {
      set({ error: true });
      console.error(error);
    } finally {
      set({ loading: false });

    }
  },
}));
