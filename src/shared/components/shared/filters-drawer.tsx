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
  const [notes, brands, aromas] = await prisma.$transaction([
    prisma.note.findMany(),
    prisma.brand.findMany(),
    prisma.aroma.findMany(),
  ]);

  return (
    <div className="sticky top-52 md:top-56 z-20"  >
      <Suspense>
        <div className="w-[250px] hidden xl:block">
          <Filters notes={notes} brands={brands} aromas={aromas}/>
        </div>

        <Sheet >
          <SheetTrigger  asChild >
            <Button className="xl:hidden flex items-center gap-2 ">
              <span className="hidden md:block">Filters</span> 
              <SlidersHorizontal size={20} />
            </Button>
          </SheetTrigger>

          <SheetContent
            side={"left"}
            className="flex flex-col bg-[#FFF] p-4 xl:hidden overflow-y-auto"
          >
            <Filters brands={brands} notes={notes} aromas={aromas}/>
          </SheetContent>
        </Sheet>
      </Suspense>
    </div>
  );
};
