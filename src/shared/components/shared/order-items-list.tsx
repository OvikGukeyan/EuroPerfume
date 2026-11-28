"use client";
import { offerPrices } from "../../lib/day-offer";
import { findPricingLine, isAromaBoxItem, readPricing } from "../../lib/tax";

import React, { FC } from "react";
import { cn } from "../../lib/utils";
import { CheckoutItem, SearchInput } from ".";
import { OrderDTO } from "../../services/dto/orders.dto";
import { Minus, Plus } from "lucide-react";
import { Button } from "../ui";
import {useRouter} from "next/navigation";
import { useOrderItems } from "../../hooks";
import { Volume, volumes } from "../../constants/perfume";
import { decantAddVolume, isDecantPack, MAX_DECANT_PACK_COUNT } from "../../lib/decant-pack";
import type { ProductDTO } from "../../services/dto/product.dto";
import { useLocale } from "next-intl";

type Props = {
  className?: string;
};

export const OrderItemsList: FC<Props> = ({ className }) => {
  const { order, updateItemQuantity, removeOrderItem, addOrderItem, itemLoading } =
    useOrderItems();
  const onCountClick = async (itemId: number, type: "plus" | "minus") => {
    const delta = type === "plus" ? 1 : -1;

    await updateItemQuantity(itemId, delta);
    router.refresh();
  };
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const router=useRouter();
  const ru=useLocale()==="ru";
  const [selected, setSelected] = React.useState<ProductDTO | null>(null);
  const [size, setSize] = React.useState<Volume>(volumes[0]);
  const [count, setCount] = React.useState(1);
  const quantity = decantAddVolume(size, count);
  const pricing = readPricing(order?.pricingSnapshot);
  return (
    <div className={cn("", className)}>
      <div>
        {order?.items.map((item) => {
          const saved = findPricingLine(pricing, item, isAromaBoxItem(item.name));
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
        <Button onClick={() => {setIsSearchOpen(!isSearchOpen); setSelected(null)}} className="h-12">
          {isSearchOpen ? <Minus size={20} /> : <Plus size={20} />}
        </Button>
        <div className={`${isSearchOpen ? "block" : "hidden"} w-full`}>
          <SearchInput
            adminVariants
            onProductClick={(product) => {
              if (!order || itemLoading) return;
              if (product.productGroup?.onTap) {
                setSelected(product); setSize(volumes[0]); setCount(1);
              } else {
                setSelected(null);
                void addOrderItem(order.id, product, undefined, 1).then(()=>router.refresh());
              }
            }}
          />
          {selected && order && <div className="mt-2 flex flex-wrap items-end gap-3">
            <div className="basis-full text-sm">{selected.brand?.name} · {selected.name}</div>
            <label className="grid gap-1 text-sm">
              {ru ? "Объём атомайзера" : "Größe des Zerstäubers"}
              <select className="h-10 rounded-md border px-2" value={size} onChange={e=>{
                const value=Number(e.target.value); if (isDecantPack(value)) setSize(value);
              }}>
                {volumes.map(volume => <option key={volume} value={volume}>{volume} {ru ? "мл" : "ml"}</option>)}
              </select>
            </label>
            <label className="grid gap-1 text-sm">
              {ru ? "Количество" : "Anzahl"}
              <input className="h-10 w-20 rounded-md border px-2" type="number" inputMode="numeric"
                min={1} max={MAX_DECANT_PACK_COUNT} step={1} value={count || ""} onChange={e=>setCount(Number(e.target.value))}/>
            </label>
            <Button disabled={itemLoading || quantity===null} onClick={()=>{
              if (quantity===null) return;
              void addOrderItem(order.id, selected, undefined, quantity, size).then(()=>router.refresh());
            }}>{ru ? "Добавить" : "Hinzufügen"}</Button>
          </div>}
        </div>
      </div>
    </div>
  );
};
