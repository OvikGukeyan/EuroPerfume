import React, { Suspense } from "react";
import { Filters } from ".";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui";
import { SlidersHorizontal } from "lucide-react";
import { prisma } from "@/prisma/prisma-client";


export const FiltersDrawer = async () => {
 

  return (
    <div className="sticky top-52 md:top-56 z-20"  >
      <Suspense>
        <div className="w-[250px] hidden xl:block">
          <Filters />
        </div>

        <Sheet >
          <SheetTrigger  asChild >
            <Button  className="xl:hidden flex items-center gap-2">
              <span className="hidden md:block">Filters</span> 
              <SlidersHorizontal size={20} />
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
