"use client";
import React, { FC, useEffect, useState } from "react";
import { Categories, SortPopup, Container, SearchInput } from ".";
import { cn } from "@/shared/lib/utils";
import { Category } from "@prisma/client";

interface Props {
  className?: string;
  categories: Category[];
}

export const TopBar: FC<Props> = ({ className, categories }) => {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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
        className="flex flex-col gap-2 md:gap-5 items-center justify-between md:flex-row 
      
      "
      >
        <Categories items={categories} />

        <div className="flex w-full md:w-auto justify-between gap-5">
          <div className="md:hidden w-full">
            <SearchInput />
          </div>

          <SortPopup />
        </div>
      </Container>
    </div>
  );
};
