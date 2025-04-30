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

type Props = {
  category: Category & { productGroups: ProductGroup[] };
  setOpen: (open: boolean) => void;
  className?: string;
};

export const MenuDrawerItem: FC<Props> = ({ className, category, setOpen }) => {
  const [isOpen, setIsOpen] = React.useState(true);
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
      className={cn(className, "w-2/3 space-y-2")}
    >
      <div className="flex items-center justify-between space-x-4 ">
        <CollapsibleTrigger onClick={() => handleItemClick(category)} asChild>
          <div className="flex items-center gap-2 cursor-pointer">
            <h2 className="text-2xl font-semibold">{category.labelRu}</h2>
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
        {category.productGroups.map((productGroup) => (
          <div
            onClick={() => {
              handleSubItemClick(productGroup);
            }}
            key={productGroup.id}
            className="px-4 py-2 text-xl cursor-pointer"
          >
            {productGroup.labelRu}
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};
