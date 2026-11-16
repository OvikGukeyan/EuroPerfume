"use client";
import { HomePriceProvider, HomePriceNote } from "@/src/shared/components/shared/home-price-note";
import { Link } from "@/src/i18n/navigation";
import { Button, Container, ProductCard, Title } from "@/src/shared/components";
import { useFavorites } from "@/src/shared/hooks";
import { useLocale } from "next-intl";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

export default function Favorites() {
  const ru=useLocale()==="ru";
  const { items, favoriteIds, favoritesLoading, addFavoritesItem } = useFavorites();
  return (
    <HomePriceProvider><Container>
      {items.some(i=>favoriteIds.includes(i.productId)) && <HomePriceNote />}
      {favoritesLoading ? <p role="status" className="py-10 text-center">{ru?"Загружаем избранное…":"Favoriten werden geladen…"}</p> : items.some(i=>favoriteIds.includes(i.productId)) ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4 md:gap-8">
          {items.filter(i=>favoriteIds.includes(i.productId)).map((item) => (
            <ProductCard dayOffer={item} discountPrice={item.discountPrice}
              brand={item.brand}
              bottles={item.bottles}
              available={item.available}
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
            text={ru?"В избранном пока пусто":"Noch keine Favoriten"}
            className="text-center font-bold my-2"
          />
          <p className="text-center text-neutral-500 mb-5">
            {ru?"Нажмите на сердечко у понравившегося аромата.":"Speichern Sie Ihre Lieblingsdüfte mit dem Herzsymbol."}
          </p>
          <Link href="/">
            <Button className="w-56 h-12 text-base" size="lg">
              <ArrowLeft className="w-5 mr-2" />
              {ru?"Продолжить покупки":"Weiter einkaufen"}
            </Button>
          </Link>
        </div>
      )}
    </Container></HomePriceProvider>
  );
}
