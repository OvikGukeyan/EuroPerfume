// src/shared/utils/update-query.ts
import { useRouter } from "next/navigation";
import qs from "qs";
import { Filters } from "@/src/shared/store/filters";

export const useUpdateFiltersQuery = () => {
  const router = useRouter();

  return (filters: Filters) => {
    const params = {
      ...filters.prices,
      orderBy:
        Object.keys(filters.orderBy).length > 0
          ? JSON.stringify(filters.orderBy)
          : undefined,
      brands: Array.from(filters.brands),
      classification: Array.from(filters.classification),
      concentration: Array.from(filters.concentration),
      gender: Array.from(filters.gender),
      topNotes: Array.from(filters.topNotes),
      heartNotes: Array.from(filters.heartNotes),
      baseNotes: Array.from(filters.baseNotes),
      aromas: Array.from(filters.aromas),
      page: filters.currentPage > 1 ? filters.currentPage : undefined,
      category: filters.category || undefined,
      productGroup: filters.productGroup || undefined,
    };

    const query = qs.stringify(params, { arrayFormat: "comma" });
    router.push(`?${query}`, { scroll: false });
  };
};