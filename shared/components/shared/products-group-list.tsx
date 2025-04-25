
'use client';
import { ProductCard, ProductCardSkeleton } from ".";
import { cn } from "@/shared/lib/utils";
import { useProducts } from "@/shared/hooks";

interface Props {
  className?: string;
  listClassName?: string;
}

export const ProductsGroupList: React.FC<Props> = ({
  listClassName,
  className,
}) => {
  const {items: products, loading} = useProducts();
  return (
    <div className={className}  >
      <div
        className={cn(
          "grid grid-cols-2 gap-3   lg:grid-cols-4 md:gap-x-[20px] md:gap-y-[60px]",
          listClassName
        )}
      >
        {
        loading ? 
          [...Array(9)].map((_, index) => (
            <ProductCardSkeleton key={index} />
          )): 
          products.map((product) => (
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
            />
          ))
        }
      </div>
    </div>
  );
};
