"use client";
import {
  Categories,
  DashboardProduct,
  PaginationComponent,
} from "@/src/shared/components";
import {
  russianToGermanLayout,
  ruToDeLayoutQWERTZ,
} from "@/src/shared/components/shared/search-input";
import {
  useCategories,
  useProducts,
  useQueryFilters,
} from "@/src/shared/hooks";
import { Api } from "@/src/shared/services/api-client";
import { ProductDTO } from "@/src/shared/services/dto/product.dto";
import { useFiltersStore } from "@/src/shared/store/filters";
import { Search } from "lucide-react";
import { useState } from "react";
import { useDebounce } from "react-use";

export default function Products() {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<ProductDTO[]>([]);

  useDebounce(
    async () => {
      try {
        if (searchQuery === "") {
          setProducts([]);
          return;
        }
        const convertedQuery = ruToDeLayoutQWERTZ(searchQuery);
        const convertedQuery2 = russianToGermanLayout(searchQuery);

        const response = await Api.products.search(convertedQuery);
        const responseAlt =
          response.length === 0 && convertedQuery !== convertedQuery2
            ? await Api.products.search(convertedQuery2)
            : [];

        const combined = [...response, ...responseAlt].reduce<ProductDTO[]>(
          (acc, curr) => {
            if (!acc.some((p) => p.id === curr.id)) acc.push(curr);
            return acc;
          },
          []
        );
        setProducts(combined);
      } catch (error) {
        console.log(error);
      }
    },
    250,
    [searchQuery]
  );
  console.log(products);
  const { items, deleteProduct, loading, switchAvailability } = useProducts();

  const { categories } = useCategories();

  const filters = useFiltersStore();
  useQueryFilters(filters);

  const list = products.length > 0 ? products : items;
  return (
    <div>
      <Categories className="hidden md:flex mx-10" items={categories} />
      <div className="flex rounded-2xl flex-1 justify-between relative h-12 z-30 my-2 mx-10">
        <Search className="absolute top-1/2 translate-y-[-50%] left-3 h-5 text-gray-400" />
        <input
          className="rounded-md outline-none w-full bg-gray-100 pl-11"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-[50px] p-4 md:p-10">
        {list.map((item) => (
          <DashboardProduct
            switchAvailability={switchAvailability}
            loading={loading}
            deleteProduct={deleteProduct}
            key={item.id}
            {...item}
          />
        ))}
      </div>
      <PaginationComponent />
    </div>
  );
}
