import { AddOrderItemBody } from "@/src/app/api/order-item/[id]/route";
import { Api } from "../services/api-client";
import { OrderDTO } from "../services/dto/orders.dto";
import { create } from "zustand";

export interface OrderItemsState {
  loading: boolean;
  itemLoading: boolean;
  error: boolean;
  totalAmount: number;
  order: OrderDTO | null;

  fetchOrder: (id: number) => Promise<void>;
  updateItemQuantity: (id: number, quantity: number) => Promise<void>;
  addOrderItem: (values: AddOrderItemBody) => Promise<void>;
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
      console.log(id, 'id');
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
    try {
      set({ itemLoading: true, error: false });

      await Api.orderItem.removeOrderItem(id);

      set((state) => {
        if (!state.order) return state;

        return {
          order: {
            ...state.order,
            items: state.order.items.filter((item) => item.id !== id),
          },
        };
      });
    } catch (error) {
      console.error(error);
      set({ error: true });
    } finally {
      set({ itemLoading: false });
    }
  },

  updateItemQuantity: async (id: number, delta: number) => {
    try {
      set({ itemLoading: true, error: false });

      const res = await Api.orderItem.updateOrderItem(delta, id);

      set((state) => {
        if (!state.order) return state;

        return {
          order: {
            ...state.order,
            totalAmount: res.totalAmount,
            items: state.order.items
              .map((item) =>
                item.id === id
                  ? { ...item, quantity: item.quantity + delta }
                  : item
              )
              .filter((item) => item.quantity > 0),
          },
        };
      });
    } catch (error) {
      console.error(error);
      set({ error: true });
    } finally {
      set({ itemLoading: false });
    }
  },

  addOrderItem: async (values: AddOrderItemBody) => {
    try {
      set({ loading: true, error: false });
      const data = await Api.orderItem.addOrderItem(values);
      set({ order: data });
    } catch (error) {
      console.error(error);
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  }
}));
