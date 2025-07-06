"use client";

import React, { FC } from "react";
import { useFiltersStore } from "../../store/filters";
import { useProductStore } from "../../store/product";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
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

  const scrollToProducts = () => {
    setTimeout(() => {
      const element = document.getElementById("products-section");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const handleNextPageClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollToProducts();
    if (currentPage === pages) return;
    setCurrentPage(currentPage + 1);
  };

  const handlePreviousPageClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollToProducts();
    if (currentPage === 1) return;
    setCurrentPage(currentPage - 1);
  };

  const onPageChange = (
    e: React.MouseEvent<HTMLAnchorElement>,
    page: number
  ) => {
    e.preventDefault();
    scrollToProducts();
    setCurrentPage(page);
  };

  return (
    <div className={cn("max-w-[100%] mx-auto", className)}>
      <Pagination>
        <PaginationContent>
          {/* {[...Array(pages)].map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                isActive={index + 1 === currentPage}
                href={"#"}
                onClick={(e) => onPageChange(e, index + 1)}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))} */}
          {pages > 1 && (
            <>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={handlePreviousPageClick}
                />
              </PaginationItem>
              {/* Always show first page */}
              <PaginationItem>
                <PaginationLink
                  isActive={1 === currentPage}
                  href="#"
                  onClick={(e) => onPageChange(e, 1)}
                >
                  1
                </PaginationLink>
              </PaginationItem>

              {/* Left ellipsis */}
              {currentPage > 3 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {/* Middle page numbers */}
              {Array.from({ length: pages }, (_, i) => i + 1)
                .filter(
                  (page) =>
                    page !== 1 &&
                    page !== pages &&
                    Math.abs(page - currentPage) <= 1
                )
                .map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={page === currentPage}
                      href="#"
                      onClick={(e) => onPageChange(e, page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

              {/* Right ellipsis */}
              {currentPage < pages - 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {/* Always show last page */}
              {pages > 1 && (
                <PaginationItem>
                  <PaginationLink
                    isActive={pages === currentPage}
                    href="#"
                    onClick={(e) => onPageChange(e, pages)}
                  >
                    {pages}
                  </PaginationLink>
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationNext href="#" onClick={handleNextPageClick} />
              </PaginationItem>
            </>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
};
