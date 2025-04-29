"use client";
import React, { FC, useEffect, useState } from "react";
import { Categories, SortPopup, Container, SearchInput } from ".";
import { cn } from "@/src/shared/lib/utils";
import { Category, ProductGroup } from "@prisma/client";
import { useCategories } from "@/src/shared/hooks";

interface Props {
  className?: string;
}

export const TopBar: FC<Props> = ({ className }) => {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { categories } = useCategories();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 900) {
        setShow(false);
      } else {
        setShow(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div
      className={cn(
        `sticky top-16 md:top-24 bg-white md:py-5 shadow-lg shadow-black/5 z-40 transition-transform duration-300
        ${show ? "translate-y-0" : "-translate-y-full"}
        `,
        className
      )}
    >
      <Container
        className="flex flex-col gap-4 md:gap-5 items-center justify-between md:flex-row-reverse 
      
      "
      >
        <div className="flex w-full md:w-auto justify-between gap-5">
          <div className="md:hidden w-full">
            <SearchInput />
          </div>

          <SortPopup />
        </div>

        <Categories className="hidden md:block" items={categories} />
      </Container>
    </div>
  );
};
