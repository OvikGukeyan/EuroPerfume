'use client'
import { DashboardProduct } from "@/shared/components";
import { useProductStore } from "@/shared/store/product";
import { use, useEffect } from "react";

export default function Products() {
    const {items, fetchAllProducts, deleteProduct, loading, switchAvailability, error} = useProductStore((state) => state)
useEffect(() => {
    fetchAllProducts()
}, []);
   
    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-[50px] p-4 md:p-10">
            {items.map((item) => (
                <DashboardProduct switchAvailability={switchAvailability} loading={loading} deleteProduct={deleteProduct} key={item.id} {...item} />
            ))}
        </div>
    )
}