"use client";

import React, { FC } from "react";
import { cn } from "../../lib/utils";
import { CheckoutItem, SearchInput } from ".";
import { OrderDTO } from "../../services/dto/orders.dto";
import { Minus, Plus } from "lucide-react";
import { Button } from "../ui";
import { useOrderItems } from "../../hooks";
import { calcCartItemTotalPrice } from "../../lib";
import { add } from "date-fns";

type Props = {
  className?: string;
};

export const OrderItemsList: FC<Props> = ({ className }) => {
  const { order, updateItemQuantity, removeOrderItem, addOrderItem, loading } = useOrderItems();
  const onCountClick = async (itemId: number, type: "plus" | "minus") => {
    const delta = type === "plus" ? 1 : -1;

    const res = await updateItemQuantity(itemId, delta);
    console.log(res);
  };
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  return (
    <div className={cn("", className)}>
      <div>
        {order?.items.map((item) => (
          <CheckoutItem
            key={item.id}
            id={item.id}
            imageUrl={item.product.imageUrl[0] as string}
            name={item.name}
            brand={item.product.brand}
            onTap={Boolean(item.product.productGroup?.onTap)}
            price={calcCartItemTotalPrice(
              Number(item.product.price),
              item.quantity,
              Boolean(item.product.productGroup?.onTap),
              Number(item.product.discountPrice)
            )}
            quantity={item.quantity}
            disabled={
              order.status === "SUCCEEDED" || order.status === "CENCELLED"
            }
            variation={item.variation?.name}
            onClickCountButton={(type) => onCountClick(item.id, type)}
            onClickRemove={() => removeOrderItem(item.id)}
          />
        ))}
      </div>
      <div className="flex gap-3 mt-2">
        <Button onClick={() => setIsSearchOpen(!isSearchOpen)} className="h-12">
          {isSearchOpen ? <Minus size={20} /> : <Plus size={20} />}
        </Button>
        <div className={`${isSearchOpen ? "block" : "hidden"} w-full`}>
          {/* <SearchInput onProductClick={() => addOrderItem()} /> */}
        </div>
      </div>
    </div>
  );
};
