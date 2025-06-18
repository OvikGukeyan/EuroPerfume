"use client";

import React, { FC } from "react";
import { useFiltersStore } from "../../store/filters";
import { useProductStore } from "../../store/product";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { cn } from "@/src/lib/utils";

type Props = {
  className?: string;
};

export const PaginationComponent: FC<Props> = ({ className }) => {
  const [currentPage, setCurrentPage] = useFiltersStore((state) => [
    state.currentPage,
    state.setCurrentPage,
  ]);
  const [pages] = useProductStore((state) => [state.pages]);

  const handleNextPageClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById("products-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    if (currentPage === pages) return;
    setCurrentPage(currentPage + 1);
  };

  const handlePreviousPageClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById("products-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    if (currentPage === 1) return;
    setCurrentPage(currentPage - 1);
  };

  const onPageChange = (
    e: React.MouseEvent<HTMLAnchorElement>,
    page: number
  ) => {
    e.preventDefault();
    const element = document.getElementById("products-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setCurrentPage(page);
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
                onClick={(e) => onPageChange(e, index + 1)}
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
