"use client";

import { cn } from "@/src/shared/lib/utils";
import { Category, ProductGroup } from "@prisma/client";
import React, { FC } from "react";

import { useFiltersStore } from "@/src/shared/store/filters";
import { useLocale } from "next-intl";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Separator } from "..";

interface Props {
  className?: string;
  items: (Category & { productGroups: ProductGroup[] })[];
}

export const Categories: FC<Props> = ({ items, className }) => {
  const [setCategory, setProductGroup] = useFiltersStore((state) => [
    state.setCategory,
    state.setProductGroup,
  ]);
  const locale = useLocale() as "ru" | "de";
  return (
    // <NavigationMenu className={cn(className)}>
    //   <NavigationMenuList className="gap-0 md:gap-5">
    //     {items.map(({ id, labelRu, labelDe, productGroups }) => (
    //       <NavigationMenuItem key={id}>
    //         <NavigationMenuTrigger
    //           onClick={() => {
    //             setCategory(id);
    //             setProductGroup(null);
    //           }}
    //           className="text-md font-bold tracking-narrow md:tracking-wider"
    //         >
    //           {locale === "ru" ? labelRu : labelDe}
    //         </NavigationMenuTrigger>
    //         {productGroups.length > 0 && (
    //           <NavigationMenuContent className="z-60 ">
    //             <div className="flex  items-start min-w-[500px] min-h-[100px] p-5 gap-10">
    //               <NavigationMenuLink
    //               className="relative cursor-pointer group font-semibold "
    //                 onClick={() => {
    //                   setProductGroup(null);
    //                   setCategory(id);
    //                 }}
    //               >
    //                 <p className="text-xl">
    //                   {locale === "ru" ? (
    //                     <p>Все</p>
    //                   ) : (
    //                     <p>Ales</p>
    //                   )}
    //                 </p>
    //                 <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-black transition-all duration-300 group-hover:w-full"></span>
    //               </NavigationMenuLink>
    //               {productGroups.map((productGroup) => (
    //                 <NavigationMenuLink
    //                   key={productGroup.id}
    //                   className="relative cursor-pointer group font-semibold "
    //                   onClick={() => {
    //                     setProductGroup(productGroup.id);
    //                     setCategory(productGroup.categoryId);
    //                   }}
    //                 >
    //                   <p className="text-xl">
    //                     {locale === "ru"
    //                       ? productGroup.labelRu
    //                       : productGroup.labelDe}
    //                   </p>
    //                   <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-black transition-all duration-300 group-hover:w-full"></span>
    //                 </NavigationMenuLink>
    //               ))}
    //             </div>
    //           </NavigationMenuContent>
    //         )}
    //       </NavigationMenuItem>
    //     ))}
    //   </NavigationMenuList>
    // </NavigationMenu>
    <div className={cn(className, "flex gap-10")}>
      {items.map(({ id, labelRu, labelDe, productGroups }) => (
        <HoverCard key={id} openDelay={100} closeDelay={100}>
          <HoverCardTrigger
            onClick={() => {
              setCategory(id);
              setProductGroup(null);
            }}
            className="cursor-pointer text-xl font-bold tracking-narrow md:tracking-wider"
          >
            {locale === "ru" ? labelRu : labelDe}
          </HoverCardTrigger>
          <HoverCardContent className="w-screen border-none px-11 py-10 min-h-[320px]">
            <Separator />

            <div
              className="grid grid-flow-col auto-rows-auto gap-x-10 gap-y-5 mt-5"
              style={{ gridTemplateRows: "repeat(5, auto)" }}
            >
              <div className="relative cursor-pointer group font-semibold w-fit">
                <p
                  className="text-xl font-bold tracking-wider cursor-pointer"
                  onClick={() => {
                    setProductGroup(null);
                    setCategory(id);
                  }}
                >
                  {locale === "ru" ? <p>Все</p> : <p>Ales</p>}
                </p>
                <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-black transition-all duration-300 group-hover:w-full"></span>
              </div>

              {productGroups.map((group) => (
                <div
                  className="relative cursor-pointer group font-semibold w-fit"
                  key={group.id}
                >
                  <p
                    onClick={() => {
                      setProductGroup(group.id);
                      setCategory(group.categoryId);
                    }}
                    className="text-xl font-bold tracking-wider cursor-pointer"
                  >
                    {locale === "ru" ? group.labelRu : group.labelDe}
                  </p>
                  <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-black transition-all duration-300 group-hover:w-full"></span>
                </div>
              ))}
            </div>
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  );
};
