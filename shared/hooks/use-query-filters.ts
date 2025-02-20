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
        brands: Array.from(filters.brands),
        types: Array.from(filters.types),
        concentration: Array.from(filters.concentration),
        gender: Array.from(filters.gender),
        notes: Array.from(filters.notes),
        page: filters.currentPage > 1 ? filters.currentPage : undefined,
      };
      const query = qs.stringify(params, { arrayFormat: "comma" });
      router.push(`?${query}`, { scroll: false });
    }

    isMounted.current = true;
  }, [filters, router]);
};
