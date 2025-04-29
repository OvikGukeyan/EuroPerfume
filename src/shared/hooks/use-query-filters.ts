import { useEffect, useRef } from "react";
import qs from "qs";
import { useRouter } from "next/navigation";
import { Filters } from "../store/filters";

export const useQueryFilters = (filters: Filters) => {
  const router = useRouter();
  const isMounted = useRef(false);
  useEffect(() => {
    if (isMounted.current) {
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
    }

    isMounted.current = true;
  }, [filters, router]);
};
