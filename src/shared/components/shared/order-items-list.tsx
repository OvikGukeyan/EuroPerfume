"use client";
import { offerPrices } from "../../lib/day-offer";
import { readPricing } from "../../lib/tax";

import React, { FC } from "react";
import { cn } from "../../lib/utils";
import { CheckoutItem, SearchInput } from ".";
import { OrderDTO } from "../../services/dto/orders.dto";
import { Minus, Plus } from "lucide-react";
import { Button } from "../ui";
import {useRouter} from "next/navigation";
import { useOrderItems } from "../../hooks";

type Props = {
  className?: string;
};

export const OrderItemsList: FC<Props> = ({ className }) => {
  const { order, updateItemQuantity, removeOrderItem, addOrderItem, loading } =
    useOrderItems();
  const onCountClick = async (itemId: number, type: "plus" | "minus") => {
    const delta = type === "plus" ? 1 : -1;

    await updateItemQuantity(itemId, delta);
    router.refresh();
  };
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const router=useRouter();
  return (
    <div className={cn("", className)}>
      <div>
        {order?.items.map((item) => {
          const saved = readPricing(order.pricingSnapshot)?.lines.find(line =>
            line.productId === item.productId && line.variationId === item.variationId
            && (line.packMl ?? null) === item.packMl
            && line.title.includes("Aroma Box · ") === item.name.startsWith("Aroma Box · "));
          return <CheckoutItem
            key={item.id}
            id={item.id}
            imageUrl={item.product.imageUrl[0] as string}
            name={item.name}
            brand={item.product.brand}
            onTap={Boolean(item.product.productGroup?.onTap)}
            price={saved ? saved.grossCents / 100 : offerPrices(item.product, item.quantity,
              Boolean(item.product.productGroup?.onTap), Date.now(), false, item.packMl).effective}
            packMl={item.packMl}
            quantity={item.quantity}
            disabled={order.status === "SUCCEEDED" || order.status === "CENCELLED"}
            variation={item.variation?.name}
            onClickCountButton={(type) => onCountClick(item.id, type)}
            onClickRemove={() => {void removeOrderItem(item.id).then(()=>router.refresh())}}
          />;
        })}
      </div>
      <div className="flex gap-3 mt-2">
        <Button onClick={() => setIsSearchOpen(!isSearchOpen)} className="h-12">
          {isSearchOpen ? <Minus size={20} /> : <Plus size={20} />}
        </Button>
        <div className={`${isSearchOpen ? "block" : "hidden"} w-full`}>
          <SearchInput
            adminVariants
            onProductClick={(product) => {void addOrderItem(order?.id || 0, product, undefined, 1).then(()=>router.refresh())}}
          />
        </div>
      </div>
    </div>
  );
};
