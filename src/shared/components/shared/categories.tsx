"use client";

import { cn } from "@/src/shared/lib/utils";
import { Category, ProductGroup } from "@prisma/client";
import React, { FC } from "react";
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

interface Props {
  className?: string;
  items: (Category & { productGroups: ProductGroup[] })[];
}

export const Categories: FC<Props> = ({ items, className }) => {
  const [setCategory, setProductGroup] = useFiltersStore((state) => [
    state.setCategory,
    state.setProductGroup,
  ]);
  const locale = useLocale() as 'ru' | 'de';
  return (
    // <div style={{scrollbarWidth: 'none'}} className={cn('flex max-w-full gap-1 bg-gray-50 p-1 rounded-2xl overflow-x-auto whitespace-nowrap no-scrollbar ')}>
    //     {items.map(({id, name}) => (
    //         <a
    //             href={`/#${name}`}
    //             className={cn(
    //                 'flex items-center font-bold h-11 rounded-2xl px-5 ',
    //                 activeIndex === id && 'bg-white shadow-md shadow-gray-200 text-primary')} key={id}>
    //             <button>
    //                 {name}
    //             </button>
    //         </a>
    //     ))}
    // </div>
    <NavigationMenu className={cn(className)}>
      <NavigationMenuList className="gap-0 md:gap-5">
        {items.map(({ id, labelRu,labelDe, productGroups }) => (
          <NavigationMenuItem key={id}>
            <NavigationMenuTrigger
              onClick={() => {
                setCategory(id);
                setProductGroup(null);
              }}
              className="text-md font-bold tracking-narrow md:tracking-wider"
            >
              {locale === 'ru' ? labelRu : labelDe}
            </NavigationMenuTrigger>
            {productGroups.length > 0 && (
              <NavigationMenuContent className="z-60">
                <div 
                className="flex  items-start min-w-[500px] min-h-[100px] p-5 gap-10"
                >
                  {productGroups.map((productGroup) => (
                    <NavigationMenuLink
                      key={productGroup.id}
                      className="relative cursor-pointer group font-semibold "
                      onClick={() => {
                        setProductGroup(productGroup.id);
                        setCategory(productGroup.categoryId);
                      }}
                    >
                      <p className="text-xl">{locale === 'ru' ? productGroup.labelRu : productGroup.labelDe}</p>
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
