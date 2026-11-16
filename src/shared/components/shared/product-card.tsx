"use client";
import "./compact-product-card.css";
import { BottleOption, unitPricePerLitre } from "../../lib/full-bottle";
import { FragranceFormatPicker } from "./fragrance-format-picker";

import { formatMoney, formatUnitPrice } from "@/src/shared/lib/money";
import Image from "next/image";
import React, { useState } from "react";
import { ChooseVariation, VolumeSelection } from ".";
import { Button } from "../ui";
import { Heart, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import { useCartStore } from "@/src/shared/store";
import { Volume, volumes } from "@/src/shared/constants/perfume";
import { calcAverageRating, calcPrice } from "@/src/shared/lib";
import { HeartBlack } from "@/src/shared/icons";
import {
  Brand,
  PerfumeConcentration,
  ProductGroup,
  ProductVariation,
  Review,
} from "@prisma/client";
import { concentrations } from "@/../../prisma/constants";
import { useLocale, useTranslations } from "use-intl";
import { cn } from "../../lib/utils";
import { Rating } from "./rating";
import { Link } from "@/src/i18n/navigation";

interface Props {
  bottles?: BottleOption[];
  id: number;
  productGroup: ProductGroup;
  name: string;
  price: number;
  imageUrl: string;
  available?: boolean;
  categoryId?: number;
  variations: ProductVariation[];
  concentration?: PerfumeConcentration;
  discountPrice?: number;
  isBestseller?: boolean;
  isFavorite: boolean;
  toggleIsFavorite: (id: number, title?:string) => void;
  reviews?: Review[];
  brand: Brand;
  className?: string;
}

export const ProductCard: React.FC<Props> = ({
  imageUrl,
  bottles = [],
  available = true,
  className,
  name,
  price,
  discountPrice,
  id,
  productGroup,
  variations,
  concentration,
  isBestseller,
  isFavorite,
  toggleIsFavorite,
  reviews,
  brand,
}) => {
  const [bottleId,setBottleId]=useState<number|null>(()=>!available?(bottles.find(b=>b.available)?.id ?? null):null);
  const bottle=bottles.find(b=>b.id===bottleId);
  const selectedAvailable=bottle?bottle.available:available;
  const [volume, setVolume] = useState<Volume>(volumes[0]);
  const [activeVariationId, setActiveVariationId] = useState<number>(
    variations[0]?.id
  );
  const activeVariation = variations.find(
    (variation) => variation.id === activeVariationId
  );
  const t = useTranslations("Product");

  const { averageRating, count } = calcAverageRating(reviews as Review[]);
  const onToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    toggleIsFavorite(id,brand.name+" · "+name);
  };

  const [addCartItem, loading] = useCartStore((state) => [
    state.addCartItem,
    state.loading,
  ]);

  const onSubmit = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!selectedAvailable) return;
    try {
      await addCartItem({
        productId: bottle?.id ?? id,
        volume: !bottle && productGroup.onTap ? volume : 1,
        variationId: !bottle && activeVariation ? activeVariation.id : undefined,
      });
      toast.success(name + " added to cart");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };
  const finalPrice = bottle ? bottle.price : productGroup.onTap ? calcPrice(volume, price) : price;
  const finalDiscountPrice =
    bottle ? null : discountPrice && productGroup.onTap
      ? calcPrice(volume, discountPrice)
      : discountPrice;
  const concentratioName = concentrations.find(
    (item) => item.value === concentration
  )?.name;
  const locale = useLocale();
  const labelLocale = locale === "ru" ? "labelRu" : "labelDe";

  const image = bottle?.image || imageUrl || activeVariation?.imageUrl || "";

  return (
    <article className={cn("home-product compact-product catalogue-product", className)}>
      <div className="home-product-photo">
        <Link href={`/product/${id}`} className="absolute inset-0" aria-label={`${brand.name} ${name}`}>
          <Image src={image} alt={`${brand.name} ${name}`} fill sizes="(max-width: 767px) 46vw, (max-width: 1400px) 23vw, 300px" className="object-contain p-4 md:p-7" />
        </Link>
        <button type="button" className="home-product-heart" onClick={onToggleFavorite} aria-pressed={isFavorite} aria-label={locale === "ru" ? (isFavorite ? `Удалить ${name} из избранного` : `Добавить ${name} в избранное`) : (isFavorite ? `${name} aus Favoriten entfernen` : `${name} zu Favoriten hinzufügen`)}>
          {isFavorite ? <HeartBlack /> : <Heart />}
        </button>
        {discountPrice ? <span className="home-product-badge home-sale">SALE</span> : isBestseller ? <span className="home-product-badge">BESTSELLER</span> : null}
      </div>
      <Link href={`/product/${id}`} className="home-product-description">
        <p className="home-product-brand">{brand.name}</p>
        <h3>{name}</h3>
      </Link>
      <div className="compact-product-meta">
        <p className="home-product-price">
          {!bottle && productGroup.onTap && volume === volumes[0] && <small className="compact-product-from">{locale === "ru" ? "от" : "ab"}</small>}
          {!bottle && discountPrice ? <><del>{formatMoney(finalPrice)} €</del><strong>{formatMoney(finalDiscountPrice ?? finalPrice)} €</strong></> : <strong>{formatMoney(finalPrice)} €</strong>}
        </p>
        {productGroup.onTap && <span className="compact-product-size">{bottle?.ml ?? volume} ml</span>}
      </div>
      <FragranceFormatPicker bottles={bottles} selected={bottleId} onSelect={setBottleId} decantAvailable={available}/>
      {!bottle && productGroup.onTap && <VolumeSelection className="compact-product-volumes" volumes={[...volumes]} volume={volume} setVolume={setVolume} />}
      {!bottle && variations.length > 1 && <ChooseVariation setActiveVariationId={setActiveVariationId} activeVariationId={activeVariationId} className="compact-product-variations" items={variations} />}
      <div className="home-product-buy">
        <Button disabled={!selectedAvailable || loading} onClick={onSubmit} variant="outline" className="w-full" aria-label={`${t("addToCart")} ${name}`}>
          <ShoppingCart size={16} />{selectedAvailable?t("addToCart"):(locale==="ru"?"Нет в наличии":"Ausverkauft")}
        </Button>
      </div>
      <div className="compact-product-extra">
        <p className="home-product-concentration">{concentratioName || productGroup?.[labelLocale]}</p>
        {productGroup.onTap && <p className="home-product-volume">({formatUnitPrice(unitPricePerLitre(finalDiscountPrice ?? finalPrice,bottle?.ml ?? volume) ?? 0)} € / 1 l)</p>}
        {reviews && count > 0 && <Link href={`/product-reviews/${id}`} className="home-product-rating"><Rating value={averageRating} reviewsCount={count} /></Link>}
      </div>
    </article>
  );
};
