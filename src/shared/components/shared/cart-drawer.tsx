"use client";

import { formatMoney } from "@/src/shared/lib/money";
import { AromaBoxSummary } from "@/src/shared/components/shared/aroma-box-summary";
import React, { FC } from "react";
import Image from "next/image";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CartDrawerItem, FreeShippingProgress, Title } from ".";
import { useCart } from "@/src/shared/hooks";
import { useLocale, useTranslations } from "use-intl";
import { Link } from "@/src/i18n/navigation";
import { is } from "date-fns/locale";
import { SHOP_SETTINGS } from "@/src/config/shop";

export const CartDrawer: FC<React.PropsWithChildren> = ({ children }) => {
  const {
    totalAmount,
    items,
    updateItemQuantity,
    removeCartItem,
    loading,
    itemLoading,
  } = useCart();
  const [redirecting, setRedirecting] = React.useState(false);

  const onClickCountButton = (
    id: number,
    quantity: number,
    type: "plus" | "minus",
    productGroup: number
  ) => {
    const isDraft = productGroup < 4;
    if (isDraft && quantity < 3 && type === "minus") {
      return;
    }
    const newQuantity = type === "plus" ? quantity + 1 : quantity - 1;
    updateItemQuantity(id, newQuantity);
  };


  const isMinOrderAmount = totalAmount >= SHOP_SETTINGS.MIN_ORDER_EUR;

  const ru=useLocale()==="ru";
  const t = useTranslations("Cart");
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex w-full flex-col gap-0 bg-white px-5 pt-6 pb-0 sm:max-w-[480px]">
        {totalAmount > 0 && (
          <SheetHeader className="border-b border-neutral-200 pb-5 text-left">
            <SheetTitle>{t("title", { count: items.length })}</SheetTitle>
          </SheetHeader>
        )}

        {totalAmount < 1 && (
          <div className="flex flex-col items-center justify-center w-full h-full mx-auto">
            <Image
              src={"/assets/images/empty-box.png"}
              alt="empty-cart"
              width={200}
              height={200}
            />
            <Title
              size="sm"
              text={t("emptyTitle")}
              className="text-center font-bold my-2"
            />
            <p className="text-center text-neutral-500 mb-5">
              {t("emptyText")}
            </p>

            <SheetClose>
              <Button className="w-56 h-12 text-base" size="lg">
                <ArrowLeft className="w-5 mr-2" />
                {t("continueShopping")}
              </Button>
            </SheetClose>
          </div>
        )}

        {totalAmount > 0 && (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              <FreeShippingProgress totalAmount={totalAmount} />
              <AromaBoxSummary items={items} />
              {items.map((item) => (
                <div key={item.id} className="border-b border-neutral-100">
                  <CartDrawerItem
                    id={item.id}
                    imageUrl={item.imageUrl as string}
                    name={item.name}
                    brand={item.brand}
                    price={item.price}
                    quantity={item.quantity}
                    disabled={item.disabled}
                    productGroup={item.productGroup}
                    onClickCountButton={(type) =>
                      onClickCountButton(
                        item.id,
                        item.quantity,
                        type,
                        item.productGroup?.id as number
                      )
                    }
                    variation={item.variationName}
                    onClickRemove={() => removeCartItem(item.id)}
                  />
                </div>
              ))}
            </div>

            <SheetFooter className="-mx-5 border-t border-neutral-200 bg-white px-5 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
              <div className="w-full">
               { !isMinOrderAmount && <div className="mb-4">
                  <p className="text-sm text-red-500">{t("minOrder", { amount: SHOP_SETTINGS.MIN_ORDER_EUR })}</p>
                </div>}
                <div className="flex mb-4">
                  <span className="flex flex-1 text-lg text-neutral-500">
                    <span>{ru?"Стоимость товаров":"Warenwert"}</span>

                  </span>

                  <span className="font-bold text-lg">{formatMoney(totalAmount)} €</span>
                </div>

                <p className="mb-4 text-xs leading-5 text-neutral-500">{ru?"Доставка и скидка рассчитываются при оформлении заказа.":"Versandkosten und Rabatt werden im nächsten Schritt berechnet."}</p>
                <Link href="/checkout">
                  <Button
                    onClick={() => setRedirecting(true)}
                    loading={loading || redirecting || itemLoading}
                    type="submit"
                    className="w-full h-12 rounded-lg bg-neutral-900 text-base text-white hover:bg-neutral-800"
                    disabled={!isMinOrderAmount}
                  >
                    {t("checkout")}
                    <ArrowRight className="w-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
