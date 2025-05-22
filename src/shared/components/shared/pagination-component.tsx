"use client";

import React, { FC } from "react";
import { useFiltersStore } from "../../store/filters";
import { useProductStore } from "../../store/product";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";
import { cn } from "@/src/lib/utils";


type Props = {
  className?: string;
};

export const PaginationComponent: FC<Props> = ({
  className,
}) => {
  const [currentPage, setCurrentPage] = useFiltersStore(state => [state.currentPage, state.setCurrentPage]);
  const [pages] = useProductStore((state) => [state.pages]);

  const handleNextPageClick = () => {
    if (currentPage === pages) return;
    setCurrentPage(currentPage + 1);
    window.scrollTo(0, 0);
  };

  const handlePreviousPageClick = () => {
    if (currentPage === 1) return;
    setCurrentPage(currentPage - 1);
    window.scrollTo(0, 0);
  };


  const onPageChange = (page: number) => {
    setCurrentPage(page);
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
                isActive={index + 1 === currentPage}
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
