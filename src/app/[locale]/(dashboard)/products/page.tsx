"use client";
import { Categories, DashboardProduct, TopBar } from "@/shared/components";
import { useCategories, useProducts, useQueryFilters } from "@/shared/hooks";
import { useFiltersStore } from "@/shared/store/filters";
import { useEffect } from "react";

export default function Products() {
  const {
    items,
    fetchAllProducts,
    deleteProduct,
    loading,
    switchAvailability,
    error,
  } = useProducts();

  const { categories } = useCategories();

  const filters = useFiltersStore();
  useQueryFilters(filters);
  useEffect(() => {
    fetchAllProducts();
  }, []);

  return (
    <div>
      <Categories className="hidden md:block" items={categories} />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-[50px] p-4 md:p-10">
        {items.map((item) => (
          <DashboardProduct
            switchAvailability={switchAvailability}
            loading={loading}
            deleteProduct={deleteProduct}
            key={item.id}
            {...item}
          />
        ))}
      </div>
    </div>
  );
}
