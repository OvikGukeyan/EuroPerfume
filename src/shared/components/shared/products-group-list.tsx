"use client";
import { ProductCard, ProductCardSkeleton } from ".";
import { cn } from "@/src/shared/lib/utils";
import { useProducts } from "@/src/shared/hooks";

interface Props {
  className?: string;
}

export const ProductsGroupList: React.FC<Props> = ({ className }) => {
  const { items: products, loading } = useProducts();

  return (
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
  );
};
