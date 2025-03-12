import { useEffect } from "react";
import { OrdersState, useOrdersStore } from "../store";

export const useOrders = (): OrdersState => {
  const ordersState = useOrdersStore((state) => state);

  useEffect(() => {
    ordersState.fetchOrders();
  }, []);

  return ordersState;
};
