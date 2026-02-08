import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useOrderItemsStore } from "../store";

export const useOrderItems = () => {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const state = useOrderItemsStore((store) => store);

  useEffect(() => {
    if (!Number.isFinite(id)) return;
    state.fetchOrder(id);
  }, [id]); 

  return state;
};
