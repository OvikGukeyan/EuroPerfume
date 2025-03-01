"use client";
import { Container, ProductCard } from "@/shared/components";
import { useFavorites } from "@/shared/hooks";

export default function Favorites() {
  const { items } = useFavorites();
  console.log(items, "items");
  return (
    <Container>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[50px] p-10">
        {items.map((item) => (
          <ProductCard
            key={item.id}
            id={item.productId}
            name={item.name}
            imageUrl={item.imageUrl}
            price={item.price}
          />
        ))}
      </div>
    </Container>
  );
}
