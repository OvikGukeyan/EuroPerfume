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
    <div className={cn(className, " gap-10")}>
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
              className={`grid gap-4 mt-5 ${
                productGroups.length > 4 ? "grid-cols-2" : "grid-cols-1"
              }`}
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
