"use client";
import { ProductCard, ProductCardSkeleton, SelectedFiltersContainer, Title } from ".";
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
  const { items, addFavoritesItem } = useFavorites();

  const productGroups = categories.flatMap(
    (category) => category.productGroups
  );

  const [category, productGroup] = useFiltersStore((state) => [
    state.category,
    state.productGroup,
  ]);
  const activeProductGroup = productGroups.find(
    (item) => item.id === productGroup
  );

  const locale = useLocale();

  const subTitle = activeProductGroup
    ? (locale === "ru"
        ? activeProductGroup?.labelRu
        : activeProductGroup?.labelDe
      )?.toUpperCase()
    : "";
  return (
    <div>
      {subTitle && (
        <div className="flex items-center justify-center gap-4 w-full">
          <div className="h-1 w-12 bg-black"></div>
          <Title
            className="text-2xl sm:text-3xl  md:text-5xl   font-extrabold text-center my-10"
            text={subTitle}
          />
          <div className="h-1 w-12 bg-black"></div>
        </div>
      )}
      <SelectedFiltersContainer />

      <div
        id="products-section"
        className={cn(
          "grid grid-cols-2 gap-3   lg:grid-cols-4 md:gap-x-[20px] md:gap-y-[60px] scroll-mt-96",
          className
        )}
      >
        {loading
          ? [...Array(9)].map((_, index) => <ProductCardSkeleton key={index} />)
          : products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                imageUrl={product.imageUrl[0]}
                price={product.price}
                available={product.available}
                categoryId={product.categoryId}
                variations={product.variations}
                concentration={product.concentration || undefined}
                productGroup={product.productGroup}
                discountPrice={product.discountPrice || undefined}
                isBestseller={!!product.isBestseller}
                isFavorite={items.some((item) => item.productId === product.id)}
                toggleIsFavorite={addFavoritesItem}
                reviews={product.reviews}
                brand={product.brand}
              />
            ))}
      </div>
    </div>
  );
};
