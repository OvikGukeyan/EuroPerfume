"use client";

import { formatMoney } from "@/src/shared/lib/money";
import React, { FC } from "react";
import { Button } from "../ui";
import { cn } from "@/src/shared/lib/utils";
import { ShoppingCart } from "lucide-react";
import { CartDrawer } from "./cart-drawer";
import { HeaderCountBadge } from "./header-count-badge";
import { useCartStore } from "@/src/shared/store";
import { useLocale } from "next-intl";

interface Props { className?: string }

export const CartButton: FC<Props> = ({ className }) => {
  const [totalAmount, itemCount] = useCartStore(state => [state.totalAmount, state.items.length]);
  const ru = useLocale() === "ru";

  return <CartDrawer>
    <Button
      type="button"
      variant="ghost"
      aria-label={ru ? `Корзина: ${itemCount} товаров` : `Warenkorb: ${itemCount} Artikel`}
      className={cn("group flex h-11 shrink-0 items-center gap-2 rounded-md px-1.5 hover:bg-neutral-50 md:px-2", className)}
    >
      <span className="hidden whitespace-nowrap text-sm font-medium tabular-nums md:inline">{formatMoney(totalAmount)} €</span>
      <span className="hidden h-5 w-px bg-black/20 md:block" aria-hidden="true" />
      <div className="relative flex h-7 w-7 items-center justify-center">
        <ShoppingCart size={23} strokeWidth={1.8} />
        <HeaderCountBadge count={itemCount} />
      </div>
    </Button>
  </CartDrawer>;
};
