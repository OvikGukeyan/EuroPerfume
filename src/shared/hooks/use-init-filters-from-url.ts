import { useEffect } from "react";
import { Filters, useFiltersStore } from "../store/filters";

export const useInitFiltersFromUrl = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const searchParams = new URLSearchParams(window.location.search);

    const newFilters: Filters = {
      // Если параметр существует, разбиваем строку на массив и создаем Set
      brands: new Set<string>(
        searchParams.get("brands")?.split(",").filter(Boolean) || []
      ),
      gender: new Set<string>(
        searchParams.get("gender")?.split(",").filter(Boolean) || []
      ),
      concentration: new Set<string>(
        searchParams.get("concentration")?.split(",").filter(Boolean) || []
      ),
      classification: new Set<string>(
        searchParams.get("classification")?.split(",").filter(Boolean) || []
      ),
      topNotes: new Set<string>(
        searchParams.get("topNotes")?.split(",").filter(Boolean) || []
      ),
      heartNotes: new Set<string>(
        searchParams.get("heartNotes")?.split(",").filter(Boolean) || []
      ),
      baseNotes: new Set<string>(
        searchParams.get("baseNotes")?.split(",").filter(Boolean) || []
      ),
      aromas: new Set<string>(
        searchParams.get("aromas")?.split(",").filter(Boolean) || []
      ),
      currentPage: Number(searchParams.get("page")) || 1,
      orderBy: JSON.parse(searchParams.get("orderBy") || "{}"),
      prices: {
        priceFrom: searchParams.get("priceFrom")
          ? Number(searchParams.get("priceFrom"))
          : undefined,
        priceTo: searchParams.get("priceTo")
          ? Number(searchParams.get("priceTo"))
          : undefined,
      },
      category: Number(searchParams.get("category")) || null,
      productGroup: Number(searchParams.get("productGroup")) || null,
    };

    useFiltersStore.getState().setFilters(newFilters);
  }, []);
};
