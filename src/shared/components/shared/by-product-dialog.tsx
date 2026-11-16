"use client";
import { FragranceFormatPicker } from "./fragrance-format-picker";
import { BottleOption, unitPricePerLitre } from "../../lib/full-bottle";
import { TaxPriceNotice } from "./tax-price-notice";
import { Link } from "@/src/i18n/navigation";
import { formatMoney } from "@/src/shared/lib/money";
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
  const initialBottleId = preferredBottleId ?? (!available ? bottles.find(b=>b.available)?.id : undefined) ?? null;
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
  const finalPrice = bottle ? bottle.price : productGroup.onTap ? calcPrice(volume, price) : price;
  const finalDiscountPrice =
    bottle ? null : discountPrice && productGroup.onTap
      ? calcPrice(volume, discountPrice)
      : discountPrice;

      const t = useTranslations("ByProductDialog");
  return (
    <Dialog open={open} onOpenChange={next=>{if(next)setBottleId(initialBottleId);setOpen(next);}}>
      <DialogTrigger asChild>
        <Button  className="w-full bg-white border border-neutral-200 text-black flex gap-3 hover:bg-neutral-50" >
            <ShoppingCart size={16}/>
          {t("by")}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[calc(100%-2rem)] max-h-[90dvh] overflow-y-auto rounded-xl sm:max-w-[425px]">
        <DialogHeader className="min-h-8 pr-10 text-left">
            <DialogTitle>{t("title")}</DialogTitle>
            {/* <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription> */}
          </DialogHeader>
        <div className="flex items-center gap-5 my-5">
          <Image src={bottle?.image || imageUrl} alt={name} width={70} height={70} />
          <div className="flex flex-col">
            <Title size="sm" text={brand.name} />
            <Title size="xs" text={name} />
            <p className="text-[20px] ">
              <span className="hidden md:inline">{t("price")}</span>{" "}
              {!bottle && discountPrice ? (
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
        <FragranceFormatPicker bottles={bottles} selected={bottleId} onSelect={setBottleId} decantAvailable={available}/>
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
        {(bottle || productGroup.onTap) && <p className="my-3 text-xs text-neutral-600">{bottle?.ml ?? volume} ml ({formatMoney(unitPricePerLitre(finalDiscountPrice ?? finalPrice,bottle?.ml ?? volume) ?? 0)} € / 1 l)</p>}
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
