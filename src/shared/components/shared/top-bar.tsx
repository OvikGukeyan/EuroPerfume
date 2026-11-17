"use client";
import React, { FC } from "react";
import { SortPopup, Container, SearchInput } from ".";
import { cn } from "@/src/shared/lib/utils";
import { useQueryFilters } from "@/src/shared/hooks";
import { useFiltersStore } from "../../store/filters";
import { useRouter } from "@/src/i18n/navigation";
import { ProductDTO } from "../../services/dto/product.dto";

interface Props {
  className?: string;
}

export const TopBar: FC<Props> = ({ className }) => {
  const filters = useFiltersStore();
  useQueryFilters(filters);
  const router = useRouter();


  return (
    <div
      className={cn(
        "sticky top-16 bg-white shadow-lg shadow-black/5 z-40 md:hidden",
        className
      )}
    >
      <Container
        className="flex flex-col gap-4 md:gap-5 items-center justify-between md:flex-row-reverse 
      
      "
      >
        <div className="flex w-full md:w-auto justify-between gap-5">
          <div className="md:hidden w-full">
            <SearchInput onProductClick={(product: ProductDTO) => router.push(`/product/${product.id}`)}/>
          </div>

          <SortPopup />
        </div>


      </Container>
    </div>
  );
};
