"use client";

import { cn } from "@/shared/lib/utils";
import { useCategoryStore } from "@/shared/store";
import { Category, ProductGroup } from "@prisma/client";
import React, { FC } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";

interface Props {
  className?: string;
  items: (Category & { productGroups: ProductGroup[] })[];
}
export const Categories: FC<Props> = ({ items, className }) => {
  const activeIndex = useCategoryStore((state) => state.activeId);

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
      <NavigationMenu className={cn(className,)}>
        <NavigationMenuList className="gap-0 md:gap-5">
          {items.map(({ id, name, productGroups }) => (
            <NavigationMenuItem key={id}>
              <NavigationMenuTrigger className="text-md font-bold tracking-narrow md:tracking-wider">
                {name}
              </NavigationMenuTrigger>
              {productGroups.length > 0 && (
                <NavigationMenuContent className="z-60">
                  <div className=" flex flex-col items-start min-w-[300px] p-5 gap-4">
                    {productGroups.map((productGroup) => (
                      <NavigationMenuLink
                        key={productGroup.id}
                        className="relative cursor-pointer group font-semibold "
                      >
                        {productGroup.name}
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
