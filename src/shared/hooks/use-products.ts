import { usePathname } from "@/src/i18n/navigation";
import { useEffect, useRef } from "react";
import { useProductStore } from "../store/product";
import { GetSearchParams } from "../server-lib/find-products";
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
  const sale = usePathname() === "/sale";
  const queryKey = JSON.stringify({ ...Object.fromEntries(searchParams.entries()), ...(sale ? { sale: "1" } : {}) });
  const productsState = useProductStore((state) => state);
  const paramsRef = useRef<Record<string, string> | null>(undefined);

  useEffect(() => {
    if (
      paramsRef.current &&
      shallowEqual(
        paramsRef.current,
        JSON.parse(queryKey)
      )
    ) {
      return;
    }
    paramsRef.current = JSON.parse(queryKey);
    productsState.fetchAllProducts(JSON.parse(queryKey) as GetSearchParams);
  }, [queryKey, productsState]);

  useEffect(() => {
    if (!sale) return;
    const refresh = () => {
      if (document.visibilityState === "visible") void useProductStore.getState().fetchAllProducts(JSON.parse(queryKey), true);
    };
    const timer = window.setInterval(refresh, 60000);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => { window.clearInterval(timer); window.removeEventListener("focus", refresh); document.removeEventListener("visibilitychange", refresh); };
  }, [sale, queryKey]);

  return productsState;
};
