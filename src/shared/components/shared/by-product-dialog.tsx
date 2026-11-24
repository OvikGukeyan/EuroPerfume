"use client";
import { offerPrices, type DayOfferWindow } from "../../lib/day-offer";
import { useDayOfferClock } from "../../hooks/use-day-offer";
import { FragranceFormatPicker } from "./fragrance-format-picker";
import { BottleOption, unitPricePerLitre } from "../../lib/full-bottle";
import { TaxPriceNotice } from "./tax-price-notice";
import { Link } from "@/src/i18n/navigation";
import { formatMoney, formatUnitPrice } from "@/src/shared/lib/money";
import { FC, useState } from "react";
import { Button, ChooseVariation, Dialog, Title, VolumeSelection } from "..";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Brand, ProductGroup, ProductVariation } from "@prisma/client";
import Image from "next/image";
import { Volume, volumes } from "../../constants/perfume";
import { useCartStore } from "../../store";
import toast from "react-hot-toast";
import { calcPrice } from "../../lib";
import { useRouter } from "@/src/i18n/navigation";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { ShoppingCart } from "lucide-react";

interface Props {
  dayOffer?: DayOfferWindow;
  preferredBottleId?: number;
  bottles?: BottleOption[];
  available?: boolean;
  id: number;
  imageUrl: string;
  name: string;
  brand: Brand;
  price: number;
  discountPrice?: number;
  productGroup: ProductGroup;
  variations: ProductVariation[];
}
export const ByProductDialog: FC<Props> = ({
  preferredBottleId,
  id,
  bottles = [],
  available = true,
  dayOffer,
  imageUrl,
  name,
  productGroup,
  brand,
  price,
  discountPrice,
  variations,
}) => {
  const router=useRouter();
  const ru=useLocale()==="ru";
  const initialBottleId = bottles.find(b=>b.id===preferredBottleId)?.id ?? (!productGroup.onTap || !available ? (bottles.find(b=>b.available) ?? bottles[0])?.id : undefined) ?? null;
  const [bottleId,setBottleId]=useState<number|null>(initialBottleId);
  const bottle=bottles.find(b=>b.id===bottleId);
  const selectedAvailable=bottle?bottle.available:available;
  const [open,setOpen]=useState(false);
  const [busy,setBusy]=useState(false);
  const [volume, setVolume] = useState<Volume>(volumes[0]);
  const [activeVariationId, setActiveVariationId] = useState<number>(
    variations[0]?.id
  );

  const activeVariation = variations.find(
    (variation) => variation.id === activeVariationId
  );

  const [addCartItem, loading] = useCartStore((state) => [
    state.addCartItem,
    state.loading,
  ]);

  const onSubmit = async (checkout=false) => {
    if(busy || !selectedAvailable)return;
    setBusy(true);
    try {
      await addCartItem({
        productId: bottle?.id ?? id,
        volume: !bottle && productGroup.onTap ? volume : 1,
        variationId: !bottle && activeVariation ? activeVariation.id : undefined,
      });
      setOpen(false);
      toast.success(ru?"Добавлено в корзину":"Zum Warenkorb hinzugefügt");
      if(checkout)router.push("/checkout");
    } catch (error) {
      console.error(error);
      toast.error(ru?"Не удалось добавить товар":"Artikel konnte nicht hinzugefügt werden");
    } finally {setBusy(false);}
  };
  const offerNow = useDayOfferClock([dayOffer, ...bottles]);
  const priced = bottle
    ? offerPrices({ ...bottle, price: bottle.regularPrice ?? bottle.price, discountPrice: bottle.discountPrice }, 1, false, offerNow)
    : offerPrices({ price, discountPrice, ...dayOffer }, productGroup.onTap ? volume : 1, Boolean(productGroup.onTap), offerNow);
  const finalPrice = priced.regular;
  const finalDiscountPrice = priced.discounted ? priced.effective : undefined;

      const t = useTranslations("ByProductDialog");
  return (
    <Dialog open={open} onOpenChange={next=>{if(next)setBottleId(initialBottleId);setOpen(next);}}>
      <DialogTrigger asChild>
        <button type="button" className="compact-product-open w-full">{ru ? "Добавить в корзину" : "In den Warenkorb"}</button>
      </DialogTrigger>
      <DialogContent className="w-[calc(100%-2rem)] max-h-[90dvh] overflow-y-auto rounded-xl sm:max-w-[425px]">
        <DialogHeader className="min-h-8 pr-10 text-left">
            <DialogTitle>{ru ? "Выберите вариант" : "Variante auswählen"}</DialogTitle>
            {/* <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription> */}
          </DialogHeader>
        <div className="flex items-center gap-5 my-5">
          {(bottle ? bottle.image : activeVariation?.imageUrl || imageUrl) ? <Image src={bottle ? bottle.image : activeVariation?.imageUrl || imageUrl} alt={name} width={70} height={70} className="h-[70px] w-[70px] object-contain" /> : <span className="text-xs">{ru ? "Фото уточняется" : "Foto wird ergänzt"}</span>}
          <div className="flex flex-col">
            <Title size="sm" text={brand.name} />
            <Title size="xs" text={name} />
            <p className="text-[20px] ">
              <span className="hidden md:inline">{t("price")}</span>{" "}
              {priced.discounted ? (
                <>
                  <span className="line-through text-base mr-2">
                    {formatMoney(finalPrice)} €
                  </span>
                  <b className="text-red-500">{formatMoney(finalDiscountPrice ?? finalPrice)} €</b>
                </>
              ) : (
                <b>{formatMoney(finalPrice)} €</b>
              )}
            </p>
          </div>
        </div>
        <FragranceFormatPicker bottles={bottles} selected={bottleId} onSelect={setBottleId} decantAvailable={available} hasDecants={Boolean(productGroup.onTap)}/>
        <p className="text-xs text-neutral-600">{ru ? "Артикул" : "Artikelnummer"}: EP-{bottle?.id ?? id}</p>
        {!bottle && productGroup.onTap && (
          <VolumeSelection
            className="mb-4"
            volumes={[...volumes]}
            volume={volume}
            setVolume={setVolume}
          />
        )}

        {!bottle && variations.length > 1 && (
          <ChooseVariation
            setActiveVariationId={setActiveVariationId}
            activeVariationId={activeVariationId}
            className="mb-4 w-full overflow-x-auto"
            items={variations}
          />
        )}
        {(bottle || productGroup.onTap) && <p className="my-3 text-xs text-neutral-600">({formatUnitPrice(unitPricePerLitre(finalDiscountPrice ?? finalPrice,bottle?.ml ?? volume) ?? 0)} € / 1 l)</p>}
        {priced.dayOffer && <p className="mt-1 text-[10px] text-neutral-500">{ru ? "Низшая цена за 30 дней: " : "Niedrigster Preis der letzten 30 Tage: "}{formatMoney(finalPrice)} €</p>}
        <TaxPriceNotice gross={finalDiscountPrice ?? finalPrice}/>
        <p className="mb-4 text-xs text-neutral-600"><Link href="/delivery-and-payment" className="underline">{ru?"Дополнительно доставка":"Zzgl. Versand"}</Link></p>
        <DialogFooter>
          <div className="flex flex-col gap-5 w-full">
            <Button type="button" loading={busy} disabled={loading || !selectedAvailable} onClick={()=>onSubmit()} className="h-12 rounded-lg bg-neutral-900 hover:bg-neutral-800">{t("addToCart")}</Button>
            <Button type="button" disabled={loading || busy || !selectedAvailable} variant="outline" onClick={()=>onSubmit(true)} className="h-12 rounded-lg">{t("checkout")}</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
