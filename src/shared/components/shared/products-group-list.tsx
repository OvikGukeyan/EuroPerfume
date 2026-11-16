"use client";
import { HomePriceProvider, HomePriceNote } from "./home-price-note";
import { FiltersDrawer, ProductSelectionItem, ProductCardSkeleton, SelectedFiltersContainer } from ".";
import { bottleGroup } from "../../lib/full-bottle";
import { cn } from "@/src/shared/lib/utils";
import { useFavorites, useProducts } from "@/src/shared/hooks";
import { useFiltersStore } from "../../store/filters";
import { useCategoryStore } from "../../store";
import { useLocale } from "next-intl";

interface Props {
  className?: string;
}

export const ProductsGroupList: React.FC<Props> = ({ className }) => {
  const { items: products, loading } = useProducts();
  const [categories] = useCategoryStore((state) => [state.categories]);
  const { favoriteIds, addFavoritesItem } = useFavorites();

  const productGroups = categories.flatMap(
    (category) => category.productGroups
  );

  const productGroup = useFiltersStore((state) => state.productGroup);
  const setProductGroup = useFiltersStore((state) => state.setProductGroup);
  const activeProductGroup = productGroups.find(
    (item) => item.id === productGroup
  );

  const locale = useLocale();

  const label = locale === "ru" ? "labelRu" : "labelDe";
  const isBottleGroup = productGroup === 31 || activeProductGroup?.[label] === bottleGroup[label];
  const title = isBottleGroup ? bottleGroup[label] : activeProductGroup?.[label];
  const visibleProducts = isBottleGroup
    ? products.filter(p => p.productGroup.id === productGroup || p.bottles?.some(b => b.available))
    : products;

  return (
    <HomePriceProvider>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-3 xl:grid-cols-[250px_minmax(0,1fr)] xl:grid-rows-[auto_1fr] xl:items-start xl:gap-x-12">
        <div className={cn("row-start-1 xl:col-start-1 xl:row-span-2 xl:sticky xl:top-56", title ? "col-start-2" : "col-start-1")}>
          <FiltersDrawer />
        </div>
        {title && (
          <div className="col-start-1 row-start-1 xl:col-start-2">
            {isBottleGroup && <button type="button" onClick={() => setProductGroup(null)} className="mb-1 text-xs text-neutral-600 hover:underline">
              {locale === "ru" ? "Парфюмерия" : "Parfümerie"}
            </button>}
            <h1 className="text-2xl font-medium leading-tight tracking-tight md:text-3xl">{title}</h1>
          </div>
        )}
        <div className={cn("col-span-2 min-w-0 xl:col-span-1 xl:col-start-2", title ? "xl:row-start-2" : "xl:row-start-1")}>
          <SelectedFiltersContainer hideCategoryTokens={isBottleGroup} />
          <HomePriceNote />

          <div
            id="products-section"
            className={cn(
              "grid grid-cols-2 gap-3   lg:grid-cols-4 md:gap-x-[20px] md:gap-y-[60px] scroll-mt-96",
              className
            )}
          >
            {loading
              ? [...Array(9)].map((_, index) => <ProductCardSkeleton key={index} />)
              : visibleProducts.map((product) => (
                  <ProductSelectionItem
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    imageUrl={product.imageUrl[0]}
                    price={product.price}
                    available={product.available}
                    preferBottle={isBottleGroup}
                    variations={product.variations}
                    concentration={product.concentration || undefined}
                    productGroup={product.productGroup}
                    discountPrice={product.discountPrice || undefined}
                    isBestseller={!!product.isBestseller}
                    isFavorite={favoriteIds.includes(product.id)}
                    toggleIsFavorite={addFavoritesItem}
                    reviews={product.reviews}
                    brand={product.brand}
                    bottles={product.bottles}
                  />
                ))}
          </div>
        </div>
      </div>
    </HomePriceProvider>
  );
};
