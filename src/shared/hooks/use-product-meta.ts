import { useEffect } from "react";
import { useProductMetaStore } from "../store";

export const useProductMeta = () => {
  const productMetaState = useProductMetaStore();

  useEffect(() => {
    productMetaState.fetchProductMeta();
  }, []);

  return productMetaState;
};
