"use client";
import { Link } from "@/src/i18n/navigation";
import { Button, Container, ProductCard, Title } from "@/src/shared/components";
import { useFavorites } from "@/src/shared/hooks";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

export default function Favorites() {
  const { items, addFavoritesItem } = useFavorites();
  return (
    <Container>
      {items.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-[50px] p-10">
          {items.map((item) => (
            <ProductCard
              brand={item.brand}
              productGroup={item.productGroup}
              key={item.id}
              id={item.productId}
              name={item.name}
              imageUrl={item.imageUrl || ''} 
              variations={[]}
              price={item.price}
              isFavorite={true}
              toggleIsFavorite={addFavoritesItem}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full min-h-[500px] mx-auto">
          <Image
            src={"/assets/images/empty-box.png"}
            alt="empty-cart"
            width={200}
            height={200}
          />
          <Title
            size="sm"
            text={"Your favorites is empty"}
            className="text-center font-bold my-2"
          />
          <p className="text-center text-neutral-500 mb-5">
            Add some products to the favorites
          </p>
          <Link href="/">
            <Button className="w-56 h-12 text-base" size="lg">
              <ArrowLeft className="w-5 mr-2" />
              Continue shopping
            </Button>
          </Link>
        </div>
      )}
    </Container>
  );
}
