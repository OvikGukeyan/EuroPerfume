"use client";
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
import Link from "next/link";
import { useTranslations } from "next-intl";

interface Props {
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
  id,
  imageUrl,
  name,
  productGroup,
  brand,
  price,
  discountPrice,
  variations,
}) => {
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

  const onSubmit = async (e: React.MouseEvent) => {
    try {
      await addCartItem({
        productId: id,
        volume: productGroup.onTap ? volume : 1,
        variationId: activeVariation ? activeVariation.id : undefined,
      });
      toast.success(name + " added to cart");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };
  const finalPrice = productGroup.onTap ? calcPrice(volume, price) : price;
  const finalDiscountPrice =
    discountPrice && productGroup.onTap
      ? calcPrice(volume, discountPrice)
      : discountPrice;

      const t = useTranslations("ByProductDialog");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full" variant="outline">
          {t("by")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {/* <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader> */}
        <div className="flex items-center gap-5 my-5">
          <Image src={imageUrl} alt={name} width={70} height={70} />
          <div className="flex flex-col">
            <Title size="sm" text={brand.name} />
            <Title size="xs" text={name} />
            <p className="text-[20px] ">
              <span className="hidden md:inline">{t("price")}</span>{" "}
              {discountPrice ? (
                <>
                  <span className="line-through text-base mr-2">
                    {finalPrice} €
                  </span>
                  <b className="text-red-500">{finalDiscountPrice} €</b>
                </>
              ) : (
                <b>{finalPrice} €</b>
              )}
            </p>
          </div>
        </div>
        {productGroup.onTap && (
          <VolumeSelection
            className="mb-4"
            volumes={[...volumes]}
            volume={volume}
            setVolume={setVolume}
          />
        )}

        {variations.length > 1 && (
          <ChooseVariation
            setActiveVariationId={setActiveVariationId}
            activeVariationId={activeVariationId}
            className="mb-4"
            items={variations}
          />
        )}
        <DialogFooter>
          <div className="flex flex-col gap-5 w-full">
            <DialogClose asChild>
              <Button onClick={(e) => onSubmit(e)} variant="outline">
                {t("addToCart")}
              </Button>
            </DialogClose>
            <Link className="w-full" href="/checkout">
              <Button
                className="w-full"
                onClick={(e) => onSubmit(e)}
                type="submit"
              >
                {t("checkout")}
              </Button>
            </Link>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
