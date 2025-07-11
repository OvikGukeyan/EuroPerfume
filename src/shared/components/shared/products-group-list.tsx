"use client";
import { ProductCard, ProductCardSkeleton, Title } from ".";
import { cn } from "@/src/shared/lib/utils";
import { useProducts } from "@/src/shared/hooks";
import { useFiltersStore } from "../../store/filters";
import { useCategoryStore } from "../../store";
import { useLocale } from "next-intl";

interface Props {
  className?: string;
}

export const ProductsGroupList: React.FC<Props> = ({ className }) => {
  const { items: products, loading } = useProducts();
  const [activeId, categories] = useCategoryStore((state) => [
    state.activeId,
    state.categories,
  ]);

  const [category, productGroup] = useFiltersStore((state) => [
    state.category,
    state.productGroup,
  ])

  const activeCategory = categories.find((item) => item.id === category);

  const locale = useLocale();
  const title = locale === 'ru' ? activeCategory?.labelRu : activeCategory?.labelDe
console.log(category)
  return (
    <div>
      <div className="flex items-center justify-center gap-4 w-full">
        <div className="h-1 w-12 bg-black"></div>
        <Title
          className="text-2xl sm:text-3xl  md:text-5xl   font-extrabold text-center my-10"
          text={title || ''}
        />
        <div className="h-1 w-12 bg-black"></div>
      </div>
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
              />
            ))}
      </div>
    </div>
  );
};
