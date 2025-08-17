'use client'
import React, {  useState } from "react";
import { Filters } from ".";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui";
import { SlidersHorizontal } from "lucide-react";

export const FiltersDrawer = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="sticky top-52 md:top-56 z-20">
        <div className="w-[250px] hidden xl:block">
          <Filters />
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button className="xl:hidden flex items-center gap-2">
              <SlidersHorizontal size={20} />
              <span >Filter</span>
            </Button>
          </SheetTrigger>

          <SheetContent
            side={"left"}
            className="flex flex-col bg-[#FFF] p-4 xl:hidden overflow-y-auto"
          >
            <Filters onDone={() => setOpen(false)}/>
          </SheetContent>
        </Sheet>
    </div>
  );
};
