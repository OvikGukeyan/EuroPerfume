"use client";
import NativeLink from "next/link";
import { Link } from "@/src/i18n/navigation";
import { cn } from "@/src/shared/lib/utils";
import { Category, ProductGroup } from "@prisma/client";
import React, { FC, useState } from "react";
import { useLocale } from "next-intl";
import { useCategories } from "../../hooks";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";

interface Props { className?: string; items: (Category & { productGroups: ProductGroup[] })[]; }
export const Categories: FC<Props> = ({ items, className }) => {
  const ru = useLocale() === "ru";
  const perfume = items.find(item => item.id === 1);
  const [open, setOpen] = useState(false);
  const itemClass = "inline-flex min-h-12 items-center whitespace-nowrap text-[15px] font-normal tracking-normal text-[#333] decoration-1 underline-offset-8 transition-colors hover:text-[#8d5149] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
  return <nav aria-label={ru ? "Каталог магазина" : "Shop-Kategorien"} className={cn("flex items-center gap-7 lg:gap-10", className)}>
    <HoverCard open={open} onOpenChange={setOpen} openDelay={100} closeDelay={150}>
      <HoverCardTrigger asChild><Link href="/items?category=1" onClick={() => setOpen(false)} className={cn(itemClass, open && "text-[#8d5149] underline")}>{ru ? "Парфюмерия" : "Parfümerie"}</Link></HoverCardTrigger>
      <HoverCardContent align="start" sideOffset={0} className="w-[min(620px,calc(100vw-64px))] rounded-none border-x-0 border-b-0 border-t border-[#eceae7] bg-white px-8 py-7 shadow-lg">
        <div className="grid grid-cols-2 gap-x-10 gap-y-5 text-[15px] text-[#333]">
          <Link href="/items?category=1" onClick={() => setOpen(false)} className="hover:underline underline-offset-4">{ru ? "Вся парфюмерия" : "Alle Parfums"}</Link>
          {perfume?.productGroups.map(group => group.id === 30 ? null : <Link key={group.id} href={`/items?category=1&productGroup=${group.id}`} onClick={() => setOpen(false)} className="hover:underline underline-offset-4">{ru ? group.labelRu : group.labelDe}</Link>)}
        </div>
      </HoverCardContent>
    </HoverCard>
    <Link href="/items?category=1&gender=FEMALE" className={itemClass}>{ru ? "Женские" : "Damen"}</Link>
    <Link href="/items?category=1&gender=MALE" className={itemClass}>{ru ? "Мужские" : "Herren"}</Link>
    <Link href="/items?category=1&gender=UNISEX" className={itemClass}>{ru ? "Унисекс" : "Unisex Düfte"}</Link>
    <NativeLink prefetch={false} href="/discovery/index.html" className={itemClass}>Discovery Box</NativeLink>
    <Link href="/sale" aria-label={ru ? "SALE — Скидки" : "SALE — Reduzierte Artikel"} className="inline-flex items-center rounded-sm bg-[#923a40] px-3 py-1 text-sm font-semibold tracking-[.12em] text-white hover:bg-[#70282e]">SALE</Link>
  </nav>;
};
export function StorefrontNavigation() {
  const { categories } = useCategories();
  return <div className="storefront-header-navigation hidden md:block"><Categories items={categories} /></div>;
}
