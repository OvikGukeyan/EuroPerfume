import { useEffect, useRef } from "react";
import qs from "qs";
import { Filters } from "../store/filters";
import { usePathname, useRouter } from "@/src/i18n/navigation";

export const useQueryFilters = (filters: Filters) => {
  const isMounted = useRef(false);
  const previousQuery = useRef<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const isFilterPage = pathname === "/items" || pathname === "/products";
  useEffect(() => {
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
    if (isMounted.current && previousQuery.current !== query) {
      previousQuery.current = query;
      if (pathname === `/items` || pathname === `/products`) {
        window.history.pushState(null, "", `${pathname}?${query}`);
      } else if (query.length > 0) {

        router.push(`/items?${query}`);
      }
    }

    isMounted.current = true;
  }, [filters, pathname, router]);

  useEffect(() => {
    if (!isFilterPage) {
      previousQuery.current = null;
    }
  }, [pathname, isFilterPage]);
};
