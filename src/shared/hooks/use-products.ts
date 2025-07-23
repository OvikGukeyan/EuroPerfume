import { useEffect, useRef } from "react";
import { useProductStore } from "../store/product";
import { GetSearchParams } from "../lib/find-products";
import { useSearchParams } from "next/navigation";

function shallowEqual(
  obj1: Record<string, string>,
  obj2: Record<string, string>
) {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }
  return true;
}
export const useProducts = () => {
  const searchParams = useSearchParams();
  const productsState = useProductStore((state) => state);
  const paramsRef = useRef<Record<string, string> | null>(undefined);

  useEffect(() => {
    if (
      paramsRef.current &&
      shallowEqual(
        paramsRef.current,
        Object.fromEntries(searchParams.entries())
      )
    ) {
      return;
    }
    paramsRef.current = Object.fromEntries(searchParams.entries());
    productsState.fetchAllProducts(searchParams as GetSearchParams);
  }, [searchParams, productsState]);

  return productsState;
};
