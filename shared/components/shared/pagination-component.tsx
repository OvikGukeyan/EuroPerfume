"use client";

import React, { FC } from "react";
import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";
import { useFilters, useQueryFilters } from "@/shared/hooks";

type Props = {
  className?: string;
  countOfPages: number;
  
};

export const PaginationComponent: FC<Props> = ({
  className,
  countOfPages = 5,
  
}) => {
 


  const filters = useFilters();

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
            <PaginationPrevious href="#" />
          </PaginationItem>
          {[...Array(countOfPages)].map((_, index) => (
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
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
