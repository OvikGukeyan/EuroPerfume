"use client";

import { HomePriceNote } from "./home-price-note";
import { formatMoney } from "@/src/shared/lib/money";
import Image from "next/image";
import React from "react";
import { ByProductDialog } from ".";
import { Heart } from "lucide-react";
import { HeartBlack } from "@/src/shared/icons";
import {
  Brand,
  PerfumeConcentration,
  ProductGroup,
  ProductVariation,
  Review,
} from "@prisma/client";
import { concentrations } from "@/../../prisma/constants";
import { useLocale } from "use-intl";
import { cn } from "../../lib/utils";
import { Rating } from "./rating";
import { calcAverageRating } from "../../lib";
import { Link } from "@/src/i18n/navigation";

interface Props {
  id: number;
  productGroup: ProductGroup;
  name: string;
  imageUrl: string;
  available?: boolean;
  variations: ProductVariation[];
  concentration?: PerfumeConcentration;
  discountPrice?: number;
  isBestseller?: boolean;
  isFavorite: boolean;
  toggleIsFavorite: (id: number, title?:string) => void;
  reviews?: Review[];
  brand: Brand;
  price: number;
  className?: string;
}

export const ProductSelectionItem: React.FC<Props> = ({
  imageUrl,
  className,
  name,
  id,
  productGroup,
  variations,
  concentration,
  discountPrice,
  isBestseller,
  isFavorite,
  toggleIsFavorite,
  reviews,
  price,
  brand,
}) => {
  const onToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    toggleIsFavorite(id,brand.name+" · "+name);
  };

  const { averageRating, count } = calcAverageRating(reviews as Review[]);

  const concentratioName = concentrations.find(
    (item) => item.value === concentration
  )?.name;

  const locale = useLocale();
  const labelLocale = locale === "ru" ? "labelRu" : "labelDe";

  const finalPrice = productGroup.onTap ? price * 2 + 1 : price;

  const finalDiscountPrice =
    discountPrice && productGroup.onTap ? discountPrice * 2 + 1 : discountPrice;

  return (
    <article className={cn("home-product", className)}>
      <div className="home-product-photo">
        <Link href={`/product/${id}`} className="absolute inset-0 p-5 md:p-8" aria-label={`${brand.name} ${name}`}>
          <Image src={imageUrl || variations?.[0]?.imageUrl || ""} alt={`${brand.name} ${name}`} fill sizes="(max-width: 767px) 46vw, (max-width: 1400px) 23vw, 300px" className="object-contain p-4 md:p-7" />
        </Link>
        <button type="button" className="home-product-heart" onClick={onToggleFavorite} aria-pressed={isFavorite} aria-label={locale === "ru" ? (isFavorite ? `Удалить ${name} из избранного` : `Добавить ${name} в избранное`) : (isFavorite ? `${name} aus Favoriten entfernen` : `${name} zu Favoriten hinzufügen`)}>
          {isFavorite ? <HeartBlack /> : <Heart />}
        </button>
        {discountPrice ? <span className="home-product-badge home-sale">SALE</span> : isBestseller ? <span className="home-product-badge">BESTSELLER</span> : null}
      </div>
      <Link href={`/product/${id}`} className="home-product-description">
        <p className="home-product-brand">{brand.name}</p>
        <h3>{name}</h3>
        <p className="home-product-concentration">{concentratioName || productGroup?.[labelLocale]}</p>
      </Link>
      {reviews && count > 0 && <Link href={`/product-reviews/${id}`} className="home-product-rating"><Rating value={averageRating} reviewsCount={count} /></Link>}
      <p className="home-product-price">
        {discountPrice ? <><del>{formatMoney(finalPrice)} €</del><strong>{formatMoney(finalDiscountPrice ?? finalPrice)} €</strong></> : <strong>{formatMoney(finalPrice)} €</strong>}
      </p>
      {productGroup.onTap && <p className="home-product-volume">{locale === "ru" ? "Отливант 2 мл" : "2 ml Abfüllung"} · {formatMoney((finalDiscountPrice ?? finalPrice) / 0.002)} €/l</p>}
      <HomePriceNote />
      <div className="home-product-buy">
        <ByProductDialog id={id} variations={variations} price={price} discountPrice={discountPrice} brand={brand} imageUrl={imageUrl} name={name} productGroup={productGroup} />
      </div>
    </article>
  );
};
