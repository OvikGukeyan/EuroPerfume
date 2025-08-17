"use client";

import { FC } from "react";
import { SelectedFiltersBar } from ".";
import { buildFilterTokens } from "../../lib/build-filter-tokens";
import { useFiltersStore } from "../../store/filters";
import { FilterToken } from "./selected-filters-bar";
import { AvailableFilters, useProductStore } from "../../store/product";
import { useLocale } from "next-intl";

export const SelectedFiltersContainer: FC = () => {
  const filters = useFiltersStore((s) => s);
  const [availableFilters] = useProductStore((state) => [
    state.availableFilters,
  ]);

  const locale = useLocale() as "ru" | "de";
  const handleRemove = (t: FilterToken) => {
    switch (t.type) {
      case "price":
        filters.setPrices("priceFrom", undefined as any);
        filters.setPrices("priceTo", undefined as any);
        filters.setCurrentPage(1);
        break;
      case "brand":
        filters.setSelectedBrands(String(t.value));
        filters.setCurrentPage(1);
        break;
      case "classification":
        filters.setSelectedClassification(String(t.value));
        filters.setCurrentPage(1);
        break;
      case "concentration":
        filters.setSelectedConcentration(String(t.value));
        filters.setCurrentPage(1);
        break;
      case "gender":
        filters.setSelectedGender(String(t.value));
        filters.setCurrentPage(1);
        break;
      case "topNote":
        filters.setTopNotes(String(t.value));
        filters.setCurrentPage(1);
        break;
      case "heartNote":
        filters.setHeartNotes(String(t.value));
        filters.setCurrentPage(1);
        break;
      case "baseNote":
        filters.setBaseNotes(String(t.value));
        filters.setCurrentPage(1);
        break;
      case "aroma":
        filters.setSelectedAromas(String(t.value));
        filters.setCurrentPage(1);
        break;
      case "category":
        filters.setCategory(null as any);
        filters.setCurrentPage(1);
        break;
      case "productGroup":
        filters.setProductGroup(null);
        filters.setCurrentPage(1);
        break;
    }
  };

  const tokens = buildFilterTokens(filters, availableFilters as AvailableFilters, locale);

  return (
    <SelectedFiltersBar
      tokens={tokens}
      onRemove={handleRemove}
      onClearAll={filters.resetFilters}
      className="mb-4"
    />
  );
};
