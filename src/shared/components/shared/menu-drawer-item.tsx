"use client";
import React, { FC } from "react";
import { cn } from "@/src/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Category, ProductGroup } from "@prisma/client";
import { useFiltersStore } from "@/src/shared/store/filters";
import { useRouter } from "next/navigation";

type Props = {
  category: Category & { productGroups: ProductGroup[] };
  setOpen: (open: boolean) => void;
  locale: "ru" | "de";
  className?: string;
};

export const MenuDrawerItem: FC<Props> = ({
  className,
  category,
  setOpen,
  locale,
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const [setCategory, setProductGroup] = useFiltersStore((state) => [
    state.setCategory,
    state.setProductGroup,
  ]);

  const handleItemClick = (
    category: Category & { productGroups: ProductGroup[] }
  ) => {

    if (category.productGroups.length === 0 || !category.productGroups) {
      setCategory(category.id);
      setProductGroup(null);
      setOpen(false);
    }
  };
  const handleSubItemClick = (productGroup: ProductGroup) => {
    setProductGroup(productGroup.id);
    setCategory(productGroup.categoryId);
    setOpen(false);
  };


  return (
    <Collapsible
      key={category.id}
      open={isOpen}
      onOpenChange={setIsOpen}
      className={cn(className, "space-y-2")}
    >
      <div className="flex items-center justify-between space-x-4 ">
        <CollapsibleTrigger onClick={() => handleItemClick(category)} asChild>
          <div className="flex items-center gap-2 cursor-pointer">
            <h2 className="text-2xl font-semibold">
              {locale === "ru" ? category.labelRu : category.labelDe}
            </h2>
            {category.productGroups.length > 0 && (
              <>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </>
            )}
          </div>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="pl-5 space-y-2">
        <div
          onClick={() => {
            setCategory(category.id);
            setProductGroup(null);
            setOpen(false);
          }}
          className="px-4 py-2 text-xl cursor-pointer"
        >
          {locale === "ru" ? <p>Показать все</p> : <p>Ales anzeigen</p>}
        </div>
        {category.productGroups.map((productGroup) => (
          <div
            onClick={() => {
              handleSubItemClick(productGroup);
            }}
            key={productGroup.id}
            className="px-4 py-2 text-xl cursor-pointer"
          >
            {locale === "ru" ? productGroup.labelRu : productGroup.labelDe}
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};
