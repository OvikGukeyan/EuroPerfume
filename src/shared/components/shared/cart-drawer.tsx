"use client";

import { PromotionCartGroup } from "./promotion-cart-group";
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
import { ArrowLeft, ArrowRight, ShieldCheck, Truck, ShoppingBag } from "lucide-react";
import { CartDrawerItem, FreeShippingProgress, Title } from ".";
import { useCart } from "@/src/shared/hooks";
import { useLocale, useTranslations } from "use-intl";
import { Link } from "@/src/i18n/navigation";
import { SHOP_SETTINGS } from "@/src/config/shop";

export const CartDrawer: FC<React.PropsWithChildren> = ({ children }) => {
  const {
    totalAmount,
    items,
    promotions,
    updateItemQuantity,
    removeCartItem,
    loading,
    itemLoading,
  } = useCart();
  const [redirecting, setRedirecting] = React.useState(false);
  const [open,setOpen]=React.useState(false);
  React.useEffect(()=>{
    const handler=()=>setOpen(true);
    document.addEventListener("europerfume:open-cart",handler);
    return ()=>document.removeEventListener("europerfume:open-cart",handler);
  },[]);

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

  const claimedIds=new Set(promotions.flatMap(p=>p.productIds));
  const regularItems=items.filter(item=>!claimedIds.has(item.productId));
  const ru=useLocale()==="ru";
  const t = useTranslations("Cart");
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex w-full flex-col gap-0 bg-white px-5 pb-0 pt-6 sm:max-w-[520px]">
        {totalAmount > 0 && (
          <SheetHeader className="border-b border-[#e7e7e7] pb-5 text-left">
            <SheetTitle className="flex items-center gap-2 text-xl font-semibold tracking-tight"><ShoppingBag className="h-5 w-5"/> {t("title", { count: items.length })}</SheetTitle>
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
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pt-3">
              <div className="mb-4 rounded-md border border-[#e1e9e5] bg-[#f4f9f7] px-4 py-2"><FreeShippingProgress totalAmount={totalAmount}/></div>
              <AromaBoxSummary items={items} />
              {promotions.map(p=><PromotionCartGroup key={p.id} promotion={p} items={items} onRemove={removeCartItem} renderItem={item=>(
                                  <CartDrawerItem
                    id={item.id}
                    imageUrl={item.imageUrl as string}
                    name={item.name + (item.dayOffer ? (ru ? " · Товар дня −10%" : " · Tagesangebot −10%") : "")}
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
              )}/>)}
              {regularItems.map(item=><div key={item.id} className="border-b border-[#ececec]">
                                  <CartDrawerItem
                    id={item.id}
                    imageUrl={item.imageUrl as string}
                    name={item.name + (item.dayOffer ? (ru ? " · Товар дня −10%" : " · Tagesangebot −10%") : "")}
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
              </div>)}
            </div>

            <SheetFooter className="-mx-5 border-t border-[#e6e6e6] bg-[#fafafa] px-5 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
              <div className="w-full">
               { !isMinOrderAmount && <div className="mb-4">
                  <p className="text-sm text-red-500">{t("minOrder", { amount: SHOP_SETTINGS.MIN_ORDER_EUR })}</p>
                </div>}
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm text-[#555]">
                    <span>{ru?"Стоимость товаров":"Warenwert"}</span>

                  </span>

                  <span className="text-xl font-semibold tabular-nums text-[#222]">{formatMoney(totalAmount)} €</span>
                </div>

                <p className="mb-4 text-xs leading-5 text-[#666]">{ru?"Доставка и скидка рассчитываются при оформлении заказа.":"Versandkosten und Rabatt werden im nächsten Schritt berechnet."}</p>
                <Link href="/checkout">
                  <Button
                    onClick={() => setRedirecting(true)}
                    loading={loading || redirecting || itemLoading}
                    type="submit"
                    className="h-13 min-h-13 w-full rounded-sm bg-[#20252d] text-sm font-semibold uppercase tracking-[.055em] text-white hover:bg-[#343a44]"
                    disabled={!isMinOrderAmount}
                  >
                    {t("checkout")}
                    <ArrowRight className="w-5 ml-2" />
                  </Button>
                </Link>
                <p className="mt-3 flex items-center justify-center gap-2 text-center text-[11px] leading-5 text-[#777]"><ShieldCheck size={14}/>{ru?"Оформление заявки без онлайн-оплаты":"Bestellanfrage ohne Online-Zahlung"}</p>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
