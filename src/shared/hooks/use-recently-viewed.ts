import { useEffect, useState } from "react";
import { ProductDTO } from "../services/dto/product.dto";
import { Api } from "../services/api-client";

export const useRecentlyViewed = () => {
  const [recentlyViewed, setRecentlyViewed] = useState<ProductDTO[]>([]);
  useEffect(() => {
    const recentlyViewedIds: string[] = JSON.parse(
      localStorage.getItem("recentlyViewed") || "[]"
    );
    const getRecentlyViewedItems = async () => {
      if (!recentlyViewedIds) return;
      const data = await Api.products.getByIds(recentlyViewedIds);
      setRecentlyViewed(data);
    };
    if (recentlyViewedIds) {
      getRecentlyViewedItems();
    }
  }, []);
  return recentlyViewed;
};
