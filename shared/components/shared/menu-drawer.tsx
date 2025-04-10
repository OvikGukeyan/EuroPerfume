"use client";
import React, { FC, Suspense, useState } from "react";
import { cn } from "@/lib/utils";
import { MenuDrawerItem } from ".";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "..";
import { Menu } from "lucide-react";

import { useCategories } from "@/shared/hooks";

type Props = {
  className?: string;
};

export const MenuDrawer: FC<Props> = ({ className }) => {
  const { categories } = useCategories();
  const [open, setOpen] = useState(false);
  return (
    <div className={cn(className, "sticky top-52 md:top-56 z-20")}>
      <Suspense>
   
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              size={"icon"}
              variant="ghost"
              className="xl:hidden flex items-center gap-2 "
            >
              <Menu />
            </Button>
          </SheetTrigger>

          <SheetContent
            side={"left"}
            className="flex flex-col bg-[#FFF] px-4 py-12 xl:hidden overflow-y-auto"
          >
            {categories.map((category) => (
              <MenuDrawerItem setOpen={setOpen} category={category} key={category.id} />
            ))}
          </SheetContent>
        </Sheet>
      </Suspense>
    </div>
  );
};
