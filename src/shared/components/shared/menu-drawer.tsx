"use client";
import React, { FC, Suspense, useState } from "react";
import { cn } from "@/src/lib/utils";
import { LanguageSwitcher, MenuDrawerItem, SocialMediaBar } from ".";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button, Separator } from "..";
import { Menu } from "lucide-react";

import { useCategories } from "@/src/shared/hooks";
import { links } from "@/src/shared/services/constants";
import { useLocale } from "next-intl";
import { Link } from "@/src/i18n/navigation";

type Props = {
  className?: string;
};

export const MenuDrawer: FC<Props> = ({ className }) => {
  const { categories } = useCategories();
  const [open, setOpen] = useState(false);
  const locale = useLocale() as "ru" | "de";

  return (
    <div className={cn(className, "sticky top-52 md:top-56 z-20")}>
      <Suspense>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              size={"icon"}
              variant="ghost"
              className="xl:hidden flex flex-col items-center"
            >
              <Menu />
              <span className="text-xs">Menü</span>
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
                  locale={locale}
                  className="mb-4"
                />
              ))}
            </div>
            <Separator />
            <div className="flex flex-col gap-3">
              {links.map((link) => (
                <Link
                  onClick={() => setOpen(false)}
                  href={link.href}
                  key={link.href}
                  className="text-sm font-semibold text-slate-500"
                >
                  {link.label[locale]}
                </Link>
              ))}
            </div>
            <Separator className="my-2" />

            <SocialMediaBar className="mt-2" />

            <div className="flex justify-end items-center mt-2 min-h-[100px] bg-white sticky -bottom-12 left-0">
              <LanguageSwitcher />
            </div>
          </SheetContent>
        </Sheet>
      </Suspense>
    </div>
  );
};
