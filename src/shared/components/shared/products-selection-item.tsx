"use client";
import { offerPrices, type DayOfferWindow } from "../../lib/day-offer";
import { useDayOfferClock } from "../../hooks/use-day-offer";
import "./compact-product-card.css";
import type { BottleOption } from "../../lib/full-bottle";

import { formatMoney, formatUnitPrice } from "@/src/shared/lib/money";
import Image from "next/image";
import React from "react";
import { cataloguePrice } from "../../lib/catalogue-price";
import { fragranceName } from "../../lib/full-bottle";
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
  dayOffer?: DayOfferWindow;
  preferBottle?: boolean;
  bottles?: BottleOption[];
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
  preferBottle = false,
  dayOffer,
  imageUrl,
  bottles = [],
  available = true,
  className,
  name: rawName,
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
  const name = fragranceName(rawName);
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

  const offerNow = useDayOfferClock([dayOffer, ...bottles]);
  const priced=cataloguePrice({price,discountPrice,...dayOffer,available,productGroup,bottles},preferBottle,offerNow);
  const displayBottle=priced.bottle;
  const productHref = `/product/${id}${displayBottle ? `?bottle=${displayBottle.id}` : ""}`;
  const finalPrice = priced.regular;
  const finalDiscountPrice = priced.discounted ? priced.effective : undefined;

  return (
    <article className={cn("home-product compact-product compact-selection", className)}>
      <div className="home-product-photo">
        <Link href={productHref} className="absolute inset-0 p-5 md:p-8" aria-label={`${brand.name} ${name}`}>
          {imageUrl || variations?.[0]?.imageUrl ? <Image src={imageUrl || variations[0].imageUrl} alt={`${brand.name} ${name}`} fill sizes="(max-width: 767px) 46vw, (max-width: 1400px) 23vw, 300px" className="object-contain p-4 md:p-7" /> : <span className="flex h-full items-center justify-center text-sm text-neutral-500">{locale==="ru" ? "Фото уточняется" : "Foto wird ergänzt"}</span>}
        </Link>
        <button type="button" className="home-product-heart" onClick={onToggleFavorite} aria-pressed={isFavorite} aria-label={locale === "ru" ? (isFavorite ? `Удалить ${name} из избранного` : `Добавить ${name} в избранное`) : (isFavorite ? `${name} aus Favoriten entfernen` : `${name} zu Favoriten hinzufügen`)}>
          {isFavorite ? <HeartBlack /> : <Heart />}
        </button>
        {bottles.length > 0 && <span className="compact-format-badge">{displayBottle ? (locale === "ru" ? "Полный флакон" : "Originalflakon") : (locale === "ru" ? "Есть полный флакон" : "Auch als Originalflakon")}</span>}
        {priced.discounted ? <span className="home-product-badge home-sale">SALE</span> : isBestseller ? <span className="home-product-badge">BESTSELLER</span> : null}
      </div>
      <Link href={productHref} className="home-product-description">
        <p className="home-product-brand">{brand.name}</p>
        <h3>{name}</h3>
      </Link>
      <div className="compact-product-meta">
        <p className="home-product-price">
          <small className="compact-product-from">{!displayBottle && productGroup.onTap ? (locale === "ru" ? "Отливант от" : "Abfüllung ab") : bottles.length ? (locale === "ru" ? "Флакон от" : "Originalflakon ab") : ""}</small>
          {priced.discounted ? <><del>{formatMoney(finalPrice)} €</del><strong>{formatMoney(finalDiscountPrice ?? finalPrice)} €</strong></> : <strong>{formatMoney(finalPrice)} €</strong>}
        </p>
        {productGroup.onTap && <span className="compact-product-size">{displayBottle?.ml ?? 2} ml</span>}
      </div>
      <div className="home-product-buy">
        <Link href={productHref} className="compact-product-open">{locale === "ru" ? "Выбрать формат" : "Format wählen"}</Link>
      </div>
      <div className="compact-product-extra">
        <p className="home-product-concentration">{concentratioName || productGroup?.[labelLocale]}</p>
        {productGroup.onTap && <p className="home-product-volume">({formatUnitPrice((finalDiscountPrice ?? finalPrice) / ((displayBottle?.ml ?? 2) / 1000))} € / 1 l)</p>}
        {reviews && count > 0 && <Link href={`/product-reviews/${id}`} className="home-product-rating"><Rating value={averageRating} reviewsCount={count} /></Link>}
      </div>
    </article>
  );
};
