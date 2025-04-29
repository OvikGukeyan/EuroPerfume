"use client";
import React, { FC, Suspense, useState } from "react";
import { cn } from "@/lib/utils";
import { MenuDrawerItem, SocialMediaBar } from ".";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "..";
import { Menu } from "lucide-react";

import { useCategories } from "@/shared/hooks";
import Link from "next/link";
import { links } from "@/shared/services/constants";

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
            className="flex flex-col justify-between bg-[#FFF] px-8 py-12 xl:hidden overflow-y-auto "
          >
            <div>
              {categories.map((category) => (
                <MenuDrawerItem
                  setOpen={setOpen}
                  category={category}
                  key={category.id}
                />
              ))}
            </div>
            <div className="flex flex-col gap-3">
              {links.map((link) => (
                <Link
                  onClick={() => setOpen(false)}
                  href={link.href}
                  key={link.href}
                  className="text-xl font-semibold"
                >
                  {link.label.ru}
                </Link>
              ))}
            </div>
            <SocialMediaBar />
          </SheetContent>
        </Sheet>
      </Suspense>
    </div>
  );
};
