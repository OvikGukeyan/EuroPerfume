import React, { Suspense } from "react";
import { Filters } from ".";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui";
import { Filter } from "lucide-react";

export const FiltersDrawer = () => {
  return (
    <div>
      <Suspense>
        <div className="w-[250px] hidden xl:block">
          <Filters />
        </div>

        <Sheet>
          <SheetTrigger  asChild>
            <Button className="xl:hidden flex items-center gap-2">
              Filters
              <Filter />
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
