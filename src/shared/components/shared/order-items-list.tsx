"use client";

import React, { FC } from "react";
import { cn } from "../../lib/utils";
import { CheckoutItem, SearchInput } from ".";
import { OrderDTO } from "../../services/dto/orders.dto";
import { Minus, Plus } from "lucide-react";
import { Button } from "../ui";

type Props = {
  className?: string;
  order: OrderDTO;
};

export const OrderItemsList: FC<Props> = ({ className, order }) => {
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
            price={Number(item.product.price)}
            quantity={item.quantity}
            disabled={
              order.status === "SUCCEEDED" || order.status === "CENCELLED"
            }
            variation={item.variation?.name}
            onClickCountButton={(type) => () => {}}
            onClickRemove={() => {}}
          />
        ))}
      </div>
      <div className="flex gap-3 my-2">
        <Button onClick={() => setIsSearchOpen(!isSearchOpen)} className="h-12">
          {isSearchOpen ? <Minus size={20} /> : <Plus size={20} />}
        </Button>
        <div className={`${isSearchOpen ? "block" : "hidden"} w-full`}>
          <SearchInput onProductClick={() => {}} />
        </div>
      </div>
    </div>
  );
};
