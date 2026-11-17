"use client";
import { offerPrices } from "../../lib/day-offer";
import { useDayOfferClock } from "../../hooks/use-day-offer";
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
  sale?: boolean;
}

export const ProductsGroupList: React.FC<Props> = ({ className, sale = false }) => {
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
  const offerNow = useDayOfferClock(products.flatMap(p => [p, ...(p.bottles || [])]));
  const currentProducts = sale ? products.filter(p => p.saleBottleOnly ? p.bottles?.some(b => b.available && offerPrices({ ...b, price: b.regularPrice ?? b.price }, 1, false, offerNow).discounted) : p.available && offerPrices(p, 2, Boolean(p.productGroup.onTap), offerNow).discounted) : products;
  const visibleProducts = isBottleGroup
    ? currentProducts.filter(p => p.productGroup.id === productGroup || p.bottles?.some(b => b.available))
    : currentProducts;

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
          {sale && !loading && visibleProducts.length === 0 && <p className="py-8 text-sm text-neutral-600">{locale === "ru" ? "По выбранным фильтрам товаров со скидкой нет." : "Keine reduzierten Artikel für diese Filter gefunden."}</p>}
          <HomePriceNote />

          <div
            id="products-section"
            className={cn(
              "catalogue-products-grid grid grid-cols-2 gap-3 lg:grid-cols-4 md:gap-x-[20px] md:gap-y-[60px] scroll-mt-96",
              className
            )}
          >
            {loading
              ? [...Array(9)].map((_, index) => <ProductCardSkeleton key={index} />)
              : visibleProducts.map((product) => (
                  <ProductSelectionItem dayOffer={product}
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    imageUrl={product.imageUrl[0]}
                    price={product.price}
                    available={product.available}
                    preferBottle={isBottleGroup || Boolean(product.saleBottleOnly)}
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
