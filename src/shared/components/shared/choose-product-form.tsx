"use client";
import { ProductIngredients } from "./product-ingredients";
import { formatMoney, formatUnitPrice } from "@/src/shared/lib/money";
import { BottleOption, unitPricePerLitre } from "@/src/shared/lib/full-bottle";
import "./fragrance-detail.css";
import { noteLabel } from "../../lib/note-label";
import { FragranceFormatPicker } from "./fragrance-format-picker";
import { Link } from "@/src/i18n/navigation";
import { concentrations } from "@/../../prisma/constants";
import { TaxPriceNotice } from "./tax-price-notice";

import { cn } from "@/src/shared/lib/utils";
import React, { FC, useEffect, useState } from "react";
import { Button } from "../ui";
import { VolumeSelection, ProductCharacteristics, ChooseVariation, ProductCarousel } from ".";
import { Volume, volumes } from "@/src/shared/constants/perfume";
import { ProductTranslation } from "@prisma/client";
import {
  calcAverageRating,
  calcPrice,
  createCharacteristicsArray,
} from "@/src/shared/lib";
import { Rating } from "./rating";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useCartStore } from "../../store";
import toast from "react-hot-toast";
import { ProductDTO } from "../../services/dto/product.dto";
import { consentEvent, readCookieConsent } from "@/src/shared/lib/cookie-consent";

export type MediaItem = { type: "image" | "video"; url: string; id?: number };

export interface ProductWithTranslations extends ProductDTO {
  translations: ProductTranslation[];
}
interface Props {
  product: ProductWithTranslations;
  bottles?: BottleOption[];
  initialBottleId?: number;
  className?: string;
}
export const ChooseProductForm: FC<Props> = ({ product, className, bottles=[], initialBottleId }) => {
  const [activeVariationId, setActiveVariationId] = useState<number>(
    product.variations[0]?.id
  );
  const activeVariation = product.variations.find(
    (variation) => variation.id === activeVariationId
  );

  const [volume, setVolume] = useState<Volume>(volumes[0]);

  const firstBottle=bottles.find(b=>b.available) ?? bottles[0];
  const [bottleId,setBottleId]=useState<number|null>(()=>
    bottles.find(b=>b.id===initialBottleId)?.id ?? (!product.available ? firstBottle?.id : null) ?? null);
  const bottle=bottles.find(b=>b.id===bottleId);
  const finalPrice = bottle ? bottle.price : product.productGroup.onTap
    ? calcPrice(volume, product.price)
    : product.price;
  const finalDiscountPrice =
    bottle ? null : product.discountPrice && product.productGroup.onTap
      ? calcPrice(volume, product.discountPrice)
      : product.discountPrice;
  const { averageRating, count } = calcAverageRating(product.reviews);

  const locale = useLocale() as "ru" | "de";

  const [addCartItem, loading] = useCartStore((state) => [
    state.addCartItem,
    state.loading,
  ]);

  useEffect(() => {
    const remember = () => {
      if (!readCookieConsent()?.preferences) return;
      try {
        const saved = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
        const viewed: number[] = Array.isArray(saved) ? saved.filter(id => typeof id === "number") : [];
        localStorage.setItem("recentlyViewed", JSON.stringify([product.id, ...viewed.filter(id => id !== product.id)].slice(0, 10)));
      } catch { /* Optional history is unavailable when browser storage is blocked. */ }
    };
    remember();
    window.addEventListener(consentEvent, remember);
    return () => window.removeEventListener(consentEvent, remember);
  }, [product.id]);

  const onSubmit = async () => {
    try {
      await addCartItem({
        productId: bottle?.id ?? product.id,
        volume: !bottle && product.productGroup.onTap ? volume : 1,
        variationId: bottle ? undefined : activeVariation?.id,
      });
      toast.success(locale==="ru"?"Добавлено в корзину":"Zum Warenkorb hinzugefügt");
    } catch (error) {
      console.error(error);
      toast.error(locale==="ru"?"Не удалось добавить товар. Проверьте наличие и количество в корзине.":"Der Artikel konnte nicht hinzugefügt werden. Bitte Bestand und Menge im Warenkorb prüfen.");
    }
  };

  const charactiristics = createCharacteristicsArray(product, locale);
  const t = useTranslations("Product");
  const media: MediaItem[] = [
    ...product.imageUrl.map((url) => ({ type: "image" as const, url })),
    ...(product.videoUrl
      ? [{ type: "video" as const, url: product.videoUrl }]
      : []),
  ];
  const variationsMedia: MediaItem[] = [
    ...product.variations.map((variation) => ({
      type: "image" as const,
      url: variation.imageUrl,
      id: variation.id,
    })),
    ...(product.videoUrl
      ? [{ type: "video" as const, url: product.videoUrl }]
      : []),
  ];

  const handleRatingClick = () => document.getElementById("reviews")?.scrollIntoView({behavior:"smooth",block:"start"});

  const description =
    product.translations.find(
      (t) => t.language.toLocaleLowerCase() === locale.toLocaleLowerCase()
    )?.description || "";

  const ru=locale==="ru";
  const noteGroups=[
    {type:"TOP",title:ru?"Верхние ноты":"Kopfnoten"},
    {type:"HEART",title:ru?"Ноты сердца":"Herznoten"},
    {type:"BASE",title:ru?"Базовые ноты":"Basisnoten"},
  ].map(g=>({...g,notes:product.productNotes.filter(n=>n.noteType===g.type).map(n=>noteLabel(n.note,locale))}));
  const scentNotes=noteGroups.flatMap(g=>g.notes).slice(0,5);
  const concentrationName=concentrations.find(c=>c.value===product.concentration)?.name;
  const selectedMl=bottle?.ml ?? (product.productGroup.onTap ? volume : Number(product.volume));
  const unitPrice=unitPricePerLitre(finalDiscountPrice ?? finalPrice,selectedMl);
  return <div className={cn("fragrance-detail",className)}>
    <div className="fragrance-hero">
      <div className="fragrance-gallery">
        {bottle?.image ? <Image src={bottle.image} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-contain p-6 md:p-10" alt={product.name+" · "+bottle.ml+" ml"}/> :
          media.length>1 || variationsMedia.length>1 ? <ProductCarousel slides={media.length>1 ? media : variationsMedia} setActiveVariationId={setActiveVariationId} activeVariationId={activeVariationId}/> :
          (activeVariation?.imageUrl || product.imageUrl[0]) ? <Image fill sizes="(min-width:1024px) 50vw, 100vw" className="object-contain p-6 md:p-10" src={activeVariation?.imageUrl || product.imageUrl[0]} alt={product.name}/> : null}
      </div>
      <div className="fragrance-summary">
        <p className="fragrance-brand">{product.brand.name}</p>
        <h1 className="fragrance-name">{product.name}</h1>
        <p className="fragrance-perfumer">{concentrationName}{product.perfumer ? (ru?" · Парфюмер: ":" · Komponiert von ")+product.perfumer:""}</p>
        <button type="button" className="fragrance-reviews" onClick={handleRatingClick} aria-label={ru?"Перейти к отзывам":"Bewertungen ansehen"}><Rating value={averageRating} reviewsCount={count}/></button>
        {scentNotes.length>0 && <div className="fragrance-scent-summary"><strong>{ru?"В аромате":"Duftnoten"}</strong>{scentNotes.join(" · ")}</div>}
        <section className="fragrance-purchase" aria-label={ru?"Выбрать формат и купить":"Format auswählen und kaufen"}>
          <FragranceFormatPicker bottles={bottles} selected={bottleId} onSelect={setBottleId} decantAvailable={product.available}/>
          {!bottle && product.variations.length>0 && <ChooseVariation setActiveVariationId={setActiveVariationId} activeVariationId={activeVariationId} items={product.variations}/>}
          {!bottle && product.productGroup.onTap && <div><p className="fragrance-volume-label">{ru?"Выберите объём":"Größe wählen"}</p><VolumeSelection className="fragrance-volumes" volume={volume} setVolume={setVolume} volumes={[...volumes]}/></div>}
          {!bottle && product.productGroup.onTap && <p className="fragrance-disclosure">{ru?"Отливант из оригинального флакона. Не является официальным пробником производителя.":"Duftabfüllung aus einem Originalflakon. Keine offizielle Herstellerprobe."}</p>}
          {bottle && <p className="fragrance-disclosure">{ru?"Полный оригинальный флакон · ":"Originalflakon · "}{bottle.ml} ml</p>}
          <div aria-live="polite"><p className="fragrance-price">{formatMoney(finalDiscountPrice ?? finalPrice)} €</p>{finalDiscountPrice!=null && <del className="text-sm text-neutral-500">{formatMoney(finalPrice)} €</del>}{unitPrice!==null && <p className="fragrance-unit">({formatUnitPrice(unitPrice)} € / 1 l)</p>}<TaxPriceNotice gross={finalDiscountPrice ?? finalPrice}/><p className="fragrance-disclosure"><Link href="/delivery-and-payment">{ru?"Дополнительно доставка — условия и стоимость":"Zzgl. Versand — Kosten und Lieferbedingungen"}</Link></p></div>
          <Button loading={loading} disabled={bottle ? !bottle.available : !product.available} onClick={onSubmit} className="fragrance-buy">{(bottle ? !bottle.available : !product.available) ? (ru?"Нет в наличии":"Ausverkauft") : (ru?"В корзину":"In den Warenkorb")}</Button>
          <div className="fragrance-service"><span>{ru?"Доставка по Германии и ЕС":"Versand nach Deutschland und in die EU"}</span><Link href="/return-and-exchange" className="underline">{ru?"Условия возврата":"Rückgabebedingungen"}</Link></div>
        </section>
      </div>
    </div>
    {description && <section className="fragrance-reading"><h2>{ru?"Знакомство с ароматом":"Den Duft entdecken"}</h2><div className="fragrance-description">{description.split(/\n\s*\n/).map((paragraph,i)=><p key={i} className="mb-4">{paragraph.trim()}</p>)}</div></section>}
    {noteGroups.some(g=>g.notes.length>0) && <section className="fragrance-reading"><h2>{ru?"Как раскрывается аромат":"Die Duftpyramide"}</h2><div className="fragrance-notes">{noteGroups.filter(g=>g.notes.length>0).map(g=><div className="fragrance-note-stage" data-stage={g.type} key={g.type}><h3>{g.title}</h3><ul>{g.notes.map((note,i)=><li key={i}>{note}</li>)}</ul></div>)}</div></section>}
    <section className="fragrance-reading"><details><summary className="cursor-pointer py-3 text-lg">{t("characteristics")}</summary><ProductCharacteristics charactiristics={charactiristics}/></details></section>
    {(product.concentration || product.productGroup.onTap) && <ProductIngredients productId={product.id} translations={product.translations} locale={locale}/>}
    {product.productGroup.onTap && <aside className="fragrance-advice"><div><h2>{ru?"Сначала познакомьтесь с ароматом":"Erst kennenlernen, dann entscheiden"}</h2><p>{ru?"Выберите небольшой объём и попробуйте аромат на своей коже. Если уже нашли любимый — переключитесь на полный флакон.":"Entdecke den Duft mit einer kleinen Abfüllung auf deiner Haut. Schon dein Favorit? Wähle oben den Originalflakon, sofern verfügbar."}</p></div><a href="#" onClick={e=>{e.preventDefault();setBottleId(null);document.querySelector('.fragrance-purchase')?.scrollIntoView({behavior:'smooth',block:'center'});}}>{ru?"Выбрать отливант":"Abfüllung wählen"}</a></aside>}
  </div>;
};
