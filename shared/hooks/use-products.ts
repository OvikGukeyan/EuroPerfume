import { useEffect } from "react";
import { useProductStore } from "../store/product";
import { GetSearchParams } from "../lib/find-products";
import { useSearchParams } from "next/navigation";

export const useProducts = () => {
  const searchParams = useSearchParams();
  const productsState = useProductStore((state) => state);
  useEffect(() => {
    productsState.fetchAllProducts(searchParams as GetSearchParams);
  }, [searchParams]);

  return productsState;
};
