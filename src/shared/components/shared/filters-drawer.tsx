import React, { Suspense } from "react";
import { Filters } from ".";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui";
import { SlidersHorizontal } from "lucide-react";

export const FiltersDrawer = async () => {
  return (
    <div className="sticky top-52 md:top-56 z-20">
      <Suspense>
        <div className="w-[250px] hidden xl:block">
          <Filters />
        </div>

        <Sheet>
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
            <Filters />
          </SheetContent>
        </Sheet>
      </Suspense>
    </div>
  );
};
