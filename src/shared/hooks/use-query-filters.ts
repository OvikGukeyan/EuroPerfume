import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import qs from "qs";
import { Filters } from "../store/filters";
import { usePathname, useRouter } from "@/src/i18n/navigation";

export const useQueryFilters = (filters: Filters) => {
  const isMounted = useRef(false);
  const previousQuery = useRef<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locationKey = `${pathname}?${searchParams.toString()}`;
  const previousLocation = useRef(locationKey);
  const isFilterPage = pathname === "/items" || pathname === "/products" || pathname === "/sale";
  useEffect(() => {
    const params = {
      // Search is URL-owned; changing filters must not erase the requested fragrance.
      search: searchParams.get("search") || undefined,
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
    
    const locationChanged = previousLocation.current !== locationKey;
    previousLocation.current = locationKey;
    const queryChanged = previousQuery.current !== query;
    previousQuery.current = query;
    if (!isMounted.current || locationChanged) {
      isMounted.current = true;
      return;
    }
    const normalized = (value: string) => { const params = new URLSearchParams(value); params.sort(); return params.toString(); };
    if (queryChanged && normalized(query) !== normalized(searchParams.toString())) {
      if (isFilterPage) router.push(`${pathname}${query ? `?${query}` : ""}`);
      else if (query) router.push(`/items?${query}`);
    }
  }, [filters, pathname, router, isFilterPage, locationKey, searchParams]);

};

