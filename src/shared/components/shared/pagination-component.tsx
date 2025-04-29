"use client";

import React, { FC } from "react";
import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";
import { useQueryFilters } from "@/shared/hooks";
import { useFiltersStore } from "@/shared/store/filters";
import { useProductStore } from "@/shared/store/product";

type Props = {
  className?: string;
};

export const PaginationComponent: FC<Props> = ({
  className,
}) => {
  const filters = useFiltersStore();
  const [pages] = useProductStore((state) => [state.pages]);

  const handleNextPageClick = () => {
    if (filters.currentPage === pages) return;
    filters.setCurrentPage(filters.currentPage + 1);
    window.scrollTo(0, 0);
  };

  const handlePreviousPageClick = () => {
    if (filters.currentPage === 1) return;
    filters.setCurrentPage(filters.currentPage - 1);
    window.scrollTo(0, 0);
  };

  useQueryFilters(filters);
  const onPageChange = (page: number) => {
    filters.setCurrentPage(page);
    window.scrollTo(0, 0);
  };
  return (
    <div className={cn("", className)}>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" onClick={handlePreviousPageClick} />
          </PaginationItem>
          {[...Array(pages)].map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                isActive={index + 1 === filters.currentPage}
                href={"#"}
                onClick={() => onPageChange(index + 1)}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext href="#" onClick={handleNextPageClick} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
