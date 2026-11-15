"use client";
import { formatMoney } from "@/src/shared/lib/money";
import type { BottleOption } from "@/src/shared/lib/full-bottle";
import { TaxPriceNotice } from "./tax-price-notice";

import { cn } from "@/src/shared/lib/utils";
import React, { FC, useEffect, useRef, useState } from "react";
import { Button, Separator } from "../ui";
import {
  Title,
  Text,
  VolumeSelection,
  ProductCharacteristics,
  ChooseVariation,
  ProductCarousel,
  ReviewsComponent,
  ShareButton,
} from ".";
import { Volume, volumes } from "@/src/shared/constants/perfume";
import { ProductTranslation } from "@prisma/client";
import {
  calcAverageRating,
  calcPrice,
  createCharacteristicsArray,
} from "@/src/shared/lib";
import { Rating } from "./rating";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
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
  const reviewsRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("characteristics");
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

  const handleRatingClick = () => {
    setTimeout(() => {
      const reviewsEl = document.getElementById("reviews");
      const isVisible = reviewsEl && reviewsEl.offsetParent !== null;
      if (!isVisible) {
        setActiveTab("comments");
      }
      const targetOffset = isVisible
        ? reviewsEl.offsetTop
        : reviewsRef.current?.offsetTop || 0;

      window.scrollTo({
        top: targetOffset,
        behavior: "smooth",
      });
    }, 200);
  };

  const description =
    product.translations.find(
      (t) => t.language.toLocaleLowerCase() === locale.toLocaleLowerCase()
    )?.description || "";

  const activeIngredients =
    product.translations.find(
      (t) => t.language.toLocaleLowerCase() === locale.toLocaleLowerCase()
    )?.activeIngredients || "";

  return (
    <div
      className={cn(
        "flex flex-col lg:flex-row flex-1 max-w-full gap-4 bg-white",
        className
      )}
    >
      <div className="relative flex min-h-[min(90vw,460px)] w-full items-center justify-center self-start overflow-hidden bg-white lg:w-1/2 lg:min-h-[32rem]">
        {bottle?.image ? <Image src={bottle.image} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-contain p-4" alt={product.name+" · "+bottle.ml+" ml"}/> :
          media.length>1 || variationsMedia.length>1 ? (
          <ProductCarousel slides={media.length>1 ? media : variationsMedia} setActiveVariationId={setActiveVariationId} activeVariationId={activeVariationId}/>
        ) : (activeVariation?.imageUrl || product.imageUrl[0]) ? (
          <Image fill sizes="(min-width:1024px) 50vw, 100vw" className="object-contain p-4" src={activeVariation?.imageUrl || product.imageUrl[0]} alt={product.name}/>
        ) : null}
      </div>
      <div className="w-full bg-white p-4 md:p-7 lg:w-1/2">
        <div>
          <Title
            text={product.brand.name}
            size="md"
            className="font-extrabold mb-2"
          />
          <Title
            text={product.name}
            size="sm"
            className="font-extrabold mb-2"
          />

          <Separator />
          {!bottle && product.variations.length > 0 && (
            <ChooseVariation
              setActiveVariationId={setActiveVariationId}
              activeVariationId={activeVariationId}
              className="mt-4"
              items={product.variations}
            />
          )}
          <section className="my-5 space-y-4" aria-label={locale==="ru"?"Покупка":"Kaufen"}>
            {bottles.length>0 && <div className="grid grid-cols-2 gap-1 rounded-xl bg-neutral-100 p-1">
              {[{title:locale==="ru"?"Отливант":"Abfüllung",active:!bottle,select:()=>setBottleId(null)},
                {title:locale==="ru"?"Полный флакон":"Originalflakon",active:!!bottle,select:()=>setBottleId(firstBottle.id)}]
                .map(b=><button type="button" key={b.title} aria-pressed={b.active} onClick={b.select} className={cn("min-h-11 rounded-lg px-2 text-sm font-semibold",b.active&&"bg-white shadow-sm")}>{b.title}</button>)}
            </div>}
            {product.productGroup.onTap && <div>
              <p className="mb-2 text-sm font-semibold">{locale==="ru"?"Объём":"Größe"}</p>
              {bottle ? <div className="flex flex-wrap gap-2">{bottles.map(b=><button type="button" key={b.id} aria-pressed={b.id===bottle.id} onClick={()=>setBottleId(b.id)} className={cn("min-h-10 rounded-lg border px-4 text-sm", b.id===bottle.id && "border-neutral-900 bg-neutral-900 text-white")}>{b.ml} ml</button>)}</div> :
                <VolumeSelection volume={volume} setVolume={setVolume} volumes={[...volumes]}/>}
            </div>}
            {!bottle && product.productGroup.onTap && <p className="text-xs text-neutral-600">{locale==="ru"?"Отливант из оригинального флакона. Не является официальным пробником производителя.":"Duftabfüllung aus einem Originalflakon. Keine offizielle Herstellerprobe."}</p>}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
              <div aria-live="polite"><div className="text-2xl font-semibold tabular-nums">{formatMoney(finalDiscountPrice ?? finalPrice)} €</div>
                {finalDiscountPrice!=null && <del className="text-sm text-neutral-500">{formatMoney(finalPrice)} €</del>}
                {product.productGroup.onTap && <p className="text-xs text-neutral-600">{formatMoney((finalDiscountPrice ?? finalPrice)*1000/(bottle?.ml ?? volume))} €/l</p>}
              </div>
              <Button loading={loading} disabled={bottle ? !bottle.available : !product.available} onClick={onSubmit} className="min-h-12 grow rounded-lg px-5 sm:grow-0">
                {(bottle ? !bottle.available : !product.available) ? (locale==="ru"?"Нет в наличии":"Ausverkauft") : (locale==="ru"?"В корзину":"In den Warenkorb")}
              </Button>
            </div>
            <TaxPriceNotice gross={finalDiscountPrice ?? finalPrice}/>
          </section>
          <div
            style={{ scrollbarWidth: "none" }}
            className={cn("overflow-scroll  overflow-x-hidden")}
          >
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              defaultValue="characteristics"
              className="w-full"
              ref={reviewsRef}
            >
              <TabsList
                className={cn(
                  "grid w-full gap-4 h-24 mb-7",
                  activeIngredients.length
                    ? "grid-cols-2 md:grid-cols-3"
                    : "md:grid-cols-2 grid-cols-3"
                )}
              >
                <TabsTrigger className="h-10" value="characteristics">
                  {t("characteristics")}
                </TabsTrigger>
                <TabsTrigger className="h-10" value="description">
                  {t("description")}
                </TabsTrigger>
                {activeIngredients && (
                  <TabsTrigger className="h-10" value="activeIngredients">
                    {t("activeIngredients")}
                  </TabsTrigger>
                )}
                <TabsTrigger className="h-10 md:hidden" value="comments">
                  {t("comments")}
                </TabsTrigger>
              </TabsList>
              <TabsContent className="w-full" value="characteristics">
                <ProductCharacteristics charactiristics={charactiristics} />
              </TabsContent>
              <TabsContent className="w-full min-h-[200px]" value="description">
                <Text size="md" className="my-4">
                  {description.split(/\n\s*\n/).map((paragraph, idx) => (
                    <p key={idx} className="mb-4 leading-relaxed text-gray-800">
                      {paragraph.trim()}
                    </p>
                  ))}
                </Text>
              </TabsContent>
              <TabsContent
                className="w-full min-h-[200px]"
                value="activeIngredients"
              >
                <Text size="md" className="my-4">
                  {activeIngredients.split(/\n\s*\n/).map((paragraph, idx) => (
                    <p key={idx} className="mb-4 leading-relaxed text-gray-800">
                      {paragraph.trim()}
                    </p>
                  ))}
                </Text>
              </TabsContent>

              <TabsContent className="w-full md:hidden" value="comments">
                <ReviewsComponent product={product} />
              </TabsContent>
            </Tabs>
          </div>

          <Separator />
          <div onClick={handleRatingClick}>
            <Rating
              className="my-5"
              value={averageRating}
              withNumber
              reviewsCount={count}
            />
          </div>

        </div>
      </div>
    </div>
  );
};
