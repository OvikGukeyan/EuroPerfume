"use client";
import { offerPrices } from "../../lib/day-offer";
import { useDayOfferClock } from "../../hooks/use-day-offer";
import { ProductIngredients } from "./product-ingredients";
import { FragranceBrandInformation } from "./fragrance-brand-information";
import { FragranceAccordion } from "./fragrance-accordion";
import { formatMoney, formatUnitPrice } from "@/src/shared/lib/money";
import { BottleOption, selectedIngredientSource, unitPricePerLitre } from "@/src/shared/lib/full-bottle";
import { bottleInquiry } from "@/src/shared/lib/bottle-inquiry";
import "./fragrance-detail.css";
import { FragranceNoteCard } from "./fragrance-note-card";
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
    bottles.find(b=>b.id===initialBottleId)?.id ?? (!product.productGroup.onTap || !product.available ? firstBottle?.id : null) ?? null);
  const bottle=bottles.find(b=>b.id===bottleId);
  const offerNow = useDayOfferClock([product, ...bottles]);
  const priced = bottle
    ? offerPrices({ ...bottle, price: bottle.regularPrice ?? bottle.price, discountPrice: bottle.discountPrice }, 1, false, offerNow)
    : offerPrices(product, product.productGroup.onTap ? volume : 1, Boolean(product.productGroup.onTap), offerNow);
  const finalPrice = priced.regular;
  const finalDiscountPrice = priced.discounted ? priced.effective : undefined;

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
      document.dispatchEvent(new CustomEvent("europerfume:open-cart"));
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

  const translation = product.translations.find(
    (t) => t.language.toLowerCase() === locale.toLowerCase()
  );
  const description = translation?.description || "";
  const ingredientSource = selectedIngredientSource(product, bottle);
  const setContents = product.productGroupId === 8 ? translation?.compositionFeatures : null;

  const ru=locale==="ru";
  const noteGroups=[
    {type:"TOP",title:ru?"Верхние ноты":"Kopfnoten"},
    {type:"HEART",title:ru?"Ноты сердца":"Herznoten"},
    {type:"BASE",title:ru?"Базовые ноты":"Basisnoten"},
  ].map(g=>({...g,notes:product.productNotes.filter(n=>n.noteType===g.type).map(n=>n.note)}));
  const concentrationName=concentrations.find(c=>c.value===product.concentration)?.name;
  const selectedMl=bottle?.ml ?? (product.productGroup.onTap ? volume : Number(product.volume));
  const unavailableBottle = bottle ? !bottle.available : !product.productGroup.onTap && product.categoryId === 1 && !product.available;
  const inquiryHref = unavailableBottle ? bottleInquiry({id:bottle?.id ?? product.id,name:`${product.brand.name} ${product.name}`,ml:selectedMl,locale}) : null;
  const unitPrice=unitPricePerLitre(finalDiscountPrice ?? finalPrice,selectedMl);
  return <div className={cn("fragrance-detail",className)}>
    <div className="fragrance-hero">
      <div className="fragrance-gallery">
        <ProductCarousel
          slides={bottle ? (bottle.image ? [{ type: "image", url: bottle.image }] : []) : media.length > 1 ? media : variationsMedia.length > 1 ? variationsMedia : (activeVariation?.imageUrl || product.imageUrl[0]) ? [{ type: "image", url: activeVariation?.imageUrl || product.imageUrl[0] }] : []}
          alt={product.brand.name + " " + product.name}
          setActiveVariationId={setActiveVariationId}
          activeVariationId={activeVariationId}
        />
      </div>
      <div className="fragrance-side">
      <div className="fragrance-summary">
        <Link href={`/items?brands=${product.brand.id}`} className="fragrance-brand fragrance-brand-link" aria-label={ru?`Все товары бренда ${product.brand.name}`:`Alle Artikel von ${product.brand.name}`}>{product.brand.name}</Link>
        <h1 className="fragrance-name">{product.name}</h1>
        <p className="fragrance-perfumer">{concentrationName}{product.perfumer ? (ru?" · Парфюмер: ":" · Komponiert von ")+product.perfumer:""}</p>
        <button type="button" className="fragrance-reviews" onClick={handleRatingClick} aria-label={ru?"Перейти к отзывам":"Bewertungen ansehen"}><Rating value={averageRating} reviewsCount={count}/></button>
        
        {setContents && <div className="fragrance-scent-summary"><strong>{ru ? "В наборе" : "Im Set"}</strong>{setContents}</div>}
        <section className="fragrance-purchase" aria-label={ru?"Выбрать формат и купить":"Format auswählen und kaufen"}>
          <FragranceFormatPicker bottles={bottles} selected={bottleId} onSelect={setBottleId} decantAvailable={product.available} hasDecants={Boolean(product.productGroup.onTap)}/>
          {!bottle && product.variations.length>0 && <ChooseVariation setActiveVariationId={setActiveVariationId} activeVariationId={activeVariationId} items={product.variations}/>}
          {!bottle && product.productGroup.onTap && <div><p className="fragrance-volume-label">{ru?"Выберите объём":"Größe wählen"}</p><VolumeSelection className="fragrance-volumes" volume={volume} setVolume={setVolume} volumes={[...volumes]}/></div>}
          {!bottle && product.productGroup.onTap && <p className="fragrance-disclosure">{ru?"Отливант из оригинального флакона. Не является официальным пробником производителя.":"Duftabfüllung aus einem Originalflakon. Keine offizielle Herstellerprobe."}</p>}
          {bottle && <p className="fragrance-disclosure">{ru?"Полный оригинальный флакон · ":"Originalflakon · "}{bottle.ml} ml</p>}
          <p className="fragrance-disclosure">{ru?"Артикул: ":"Artikelnummer: "}EP-{bottle?.id ?? product.id}</p>
          {bottle && <p className="fragrance-disclosure" role="status">{(bottle.stock ?? 0)>0 ? (ru?"В наличии":"Auf Lager") : (ru?"По запросу":"Auf Anfrage")}</p>}
          <div aria-live="polite">{priced.dayOffer && <p className="mb-2 text-sm font-medium">{ru ? "Товар дня −10%" : "Tagesangebot −10%"}</p>}<p className="fragrance-price">{formatMoney(finalDiscountPrice ?? finalPrice)} €</p>{finalDiscountPrice!=null && <del aria-label={ru ? "Низшая цена за 30 дней" : "Niedrigster Preis der letzten 30 Tage"} className="text-sm text-neutral-500">{formatMoney(finalPrice)} €</del>}{unitPrice!==null && <p className="fragrance-unit">({formatUnitPrice(unitPrice)} € / 1 l)</p>}{priced.dayOffer && <p className="mt-1 text-[10px] text-neutral-500">{ru ? "Низшая цена за 30 дней: " : "Niedrigster Preis der letzten 30 Tage: "}{formatMoney(finalPrice)} €</p>}<TaxPriceNotice gross={finalDiscountPrice ?? finalPrice}/><p className="fragrance-disclosure"><Link href="/delivery-and-payment">{ru?"Дополнительно доставка — условия и стоимость":"Zzgl. Versand — Kosten und Lieferbedingungen"}</Link></p></div>
          {inquiryHref ? <div className="space-y-3">
            <p className="fragrance-disclosure">{ru?"Наличие уточняется. Срок подтверждается после заявки.":"Verfügbarkeit auf Anfrage. Lieferzeit wird nach Ihrer Anfrage bestätigt."}</p>
            <a href={inquiryHref} className="fragrance-buy flex items-center justify-center text-center">{ru?"Запросить наличие по email":"Verfügbarkeit per E-Mail anfragen"}</a>
            <p className="fragrance-disclosure">{ru?"Откроется ваше почтовое приложение. Отправьте письмо, чтобы мы подтвердили возможность заказа.":"Ihr E-Mail-Programm wird geöffnet. Senden Sie die Nachricht, damit wir die Bestellmöglichkeit bestätigen können."}</p>
          </div> : <Button loading={loading} disabled={bottle ? !bottle.available : !product.available} onClick={onSubmit} className="fragrance-buy">{(bottle ? !bottle.available : !product.available) ? (ru?"Нет в наличии":"Ausverkauft") : (ru?"В корзину":"In den Warenkorb")}</Button>}
          <div className="fragrance-service"><span>{ru?"Доставка по Германии и ЕС":"Versand nach Deutschland und in die EU"}</span><Link href="/return-and-exchange" className="underline">{ru?"Условия возврата":"Rückgabebedingungen"}</Link></div>
        </section>
      </div>
      <div className="fragrance-information" aria-label={ru ? "Информация об аромате" : "Informationen zum Duft"}>
        {description && <FragranceAccordion title={ru ? "Знакомство с ароматом" : "Den Duft entdecken"} id="description">
          <div className="fragrance-description">{description.split(/\n\s*\n/).map((paragraph,i)=><p key={i} className="whitespace-pre-line">{paragraph.trim()}</p>)}</div>
        </FragranceAccordion>}
        <FragranceAccordion title={t("characteristics")} id="characteristics">
          <ProductCharacteristics className="fragrance-characteristics" showTitle={false} charactiristics={charactiristics}/>
        </FragranceAccordion>
        {(product.categoryId===1 || product.concentration || product.productGroup.onTap || product.translations.some(t=>Boolean(t.activeIngredients?.trim()))) && <ProductIngredients {...ingredientSource} locale={locale}/>}
        {product.categoryId===1 && <FragranceBrandInformation brandName={product.brand.name} locale={locale} />}
      </div>
      </div>
    {noteGroups.some(g=>g.notes.length>0) && <section className="fragrance-pyramid"><h2>{ru?"Как раскрывается аромат":"Die Duftpyramide"}</h2><div className="fragrance-notes">{noteGroups.filter(g=>g.notes.length>0).map(g=><div className="fragrance-note-stage" data-stage={g.type} key={g.type}><h3>{g.title}</h3><ul>{g.notes.map(note=><FragranceNoteCard key={note.id} note={note} locale={locale}/>)}</ul></div>)}</div></section>}
    </div>
  </div>;
};
