"use client";

import React, { FC } from "react";
import {
  CheckoutItem,
  CheckoutItemSkeleton,
  FreeShippingProgress,
  WhiteBlock,
} from "..";
import { CartStateItem } from "@/src/shared/lib/get-cart-details";
import { useTranslations } from "use-intl";

interface Props {
  items: CartStateItem[];
  totalAmount: number;
  removeCartItem: (id: number) => void;
  onClickCountButton: (
    id: number,
    quantity: number,
    type: "plus" | "minus",
    productGroup: number
  ) => void;
  loading?: boolean;
  itemLoading?: boolean;
  className?: string;
}

export const CheckoutCart: FC<Props> = ({
  className,
  items,
  totalAmount,
  removeCartItem,
  onClickCountButton,
  loading,
}) => {
  const t = useTranslations("Checkout.cart");

  return (
    <WhiteBlock
      className={className}
      title={t('stepTitle')}
      // endAdornment={
      //   totalAmount > 0 && (
      //     <button className="flex items-center gap-3 text-gray-400 hover:text-gray-600">
      //       <Trash2 size={16} />
      //       {t('clearCart')}
      //     </button>
      //   )
      // }
    >
      <div className="flex flex-col gap-5">
        {loading
          ? [...Array(4)].map((_, index) => (
              <CheckoutItemSkeleton key={index} />
            ))
          : items.map((item) => (
              <CheckoutItem
                key={item.id}
                id={item.id}
                imageUrl={item.imageUrl as string}
                name={item.name}
                brand={item.brand}
                price={item.price}
                onTap={Boolean(item.productGroup?.onTap)}
                quantity={item.quantity}
                disabled={item.disabled}
                variation={item.variationName}
                onClickCountButton={(type) =>
                  onClickCountButton(item.id, item.quantity, type, item.productGroup?.id || 2)
                }
                onClickRemove={() => removeCartItem(item.id)}
              />
            ))}
      </div>

      {!totalAmount && !loading && (
        <p className="text-center text-gray-400 p-10">{t('emptyText')}</p>
      )}
      <FreeShippingProgress totalAmount={totalAmount} />
    </WhiteBlock>
  );
};
