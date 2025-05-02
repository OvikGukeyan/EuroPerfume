"use client";

import { cn } from "@/src/shared/lib/utils";
import { Category, ProductGroup } from "@prisma/client";
import React, { FC, startTransition } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";
import { useFiltersStore } from "@/src/shared/store/filters";
import { useLocale } from "next-intl";
import { useUpdateFiltersQuery } from "../../hooks";

interface Props {
  className?: string;
  items: (Category & { productGroups: ProductGroup[] })[];
}

export const Categories: FC<Props> = ({ items, className }) => {
  const locale = useLocale() as "ru" | "de";

  const updateQuery = useUpdateFiltersQuery();
  const filters = useFiltersStore();

  const onClickCategory = (id: number) => {
    startTransition(() => {
      filters.setCategory(id);
      filters.setProductGroup(null);
      updateQuery({ ...filters, category: id, productGroup: null });
    });
  };

  const onClickProductGroup = (productGroup: ProductGroup) => {
    startTransition(() => {
      filters.setProductGroup(productGroup.id);
      filters.setCategory(productGroup.categoryId);
      updateQuery({
        ...filters,
        productGroup: productGroup.id,
        category: productGroup.categoryId,
      });
    });
  };
  return (
    <NavigationMenu className={cn(className)}>
      <NavigationMenuList className="gap-0 md:gap-5">
        {items.map(({ id, labelRu, labelDe, productGroups }) => (
          <NavigationMenuItem key={id}>
            <NavigationMenuTrigger
              onClick={() => {
                onClickCategory(id);
              }}
              className="text-md font-bold tracking-narrow md:tracking-wider"
            >
              {locale === "ru" ? labelRu : labelDe}
            </NavigationMenuTrigger>
            {productGroups.length > 0 && (
              <NavigationMenuContent className="z-60">
                <div className="flex  items-start min-w-[500px] min-h-[100px] p-5 gap-10">
                  {productGroups.map((productGroup) => (
                    <NavigationMenuLink
                      key={productGroup.id}
                      className="relative cursor-pointer group font-semibold "
                      onClick={() => {
                        onClickProductGroup(productGroup);
                      }}
                    >
                      <p className="text-xl">
                        {locale === "ru"
                          ? productGroup.labelRu
                          : productGroup.labelDe}
                      </p>
                      <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-black transition-all duration-300 group-hover:w-full"></span>
                    </NavigationMenuLink>
                  ))}
                </div>
              </NavigationMenuContent>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
