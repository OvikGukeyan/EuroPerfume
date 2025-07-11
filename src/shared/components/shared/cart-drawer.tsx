"use client";

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
import Link from "next/link";
import { Button } from "../ui";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CartDrawerItem, FreeShippingProgress, Title } from ".";
import { useCart } from "@/src/shared/hooks";
import { useTranslations } from "use-intl";

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
    type: "plus" | "minus"
  ) => {
    const newQuantity = type === "plus" ? quantity + 1 : quantity - 1;
    updateItemQuantity(id, newQuantity);
  };

  const t = useTranslations("Cart");
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex flex-col justify-between pb-0 bg-[#F4F1EE]">
        {totalAmount > 0 && (
          <SheetHeader>
            <SheetTitle>
            {t('title', { count: items.length })}
            
            </SheetTitle>
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
            <div className="-mx-6 mt-5 overflow-auto scrollbar flex-1">
              <FreeShippingProgress totalAmount={totalAmount} />
              {items.map((item) => (
                <div key={item.id} className="mb-2">
                  <CartDrawerItem
                    id={item.id}
                    imageUrl={item.imageUrl as string}
                    name={item.name}
                    price={item.price}
                    quantity={item.quantity}
                    disabled={item.disabled}
                    productGroup={item.productGroup}
                    onClickCountButton={(type) =>
                      onClickCountButton(item.id, item.quantity, type)
                    }
                    variation={item.variationName}
                    onClickRemove={() => removeCartItem(item.id)}
                  />
                </div>
              ))}
            </div>

            <SheetFooter className="-mx-6 bg-white p-8">
              <div className="w-full">
                <div className="flex mb-4">
                  <span className="flex flex-1 text-lg text-neutral-500">
                    <span>{t("total")}</span>
                    <div className="flex-1 border-b border-dashed border-b-neutral-200 relative -top-1 mx-2" />
                  </span>

                  <span className="font-bold text-lg">{totalAmount} €</span>
                </div>

                <Link href="/checkout">
                  <Button
                    onClick={() => setRedirecting(true)}
                    loading={loading || redirecting || itemLoading}
                    type="submit"
                    className="w-full h-12 text-base"
                    variant='tertiary'
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
