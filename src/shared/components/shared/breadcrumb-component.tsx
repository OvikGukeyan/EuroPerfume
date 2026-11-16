"use client";

import React, { FC } from "react";
import { useLocale } from "next-intl";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { cn } from "../../lib/utils";
import { Brand, Category, ProductGroup } from "@prisma/client";
import { Link } from "@/src/i18n/navigation";
import { useFiltersStore } from "../../store/filters";

type Props = {
  productBrand?: Brand;
  productName?: string;
  className?: string;
  productCategory?: Category;
  productGroup?: ProductGroup;
};

export const BreadcrumbComponent: FC<Props> = ({
  className,
  productBrand,
  productName,
  productCategory,
  productGroup,
}) => {
  const ru = useLocale() === "ru";
  const { setSelectedBrands, setProductGroup, setCategory } = useFiltersStore();
  const handleBrandClick = () => {
    setProductGroup(null);
    setCategory(null);
    setSelectedBrands(String(productBrand?.id));
  };
  const handleProductGroupClick = () => {
    setSelectedBrands("");
    setCategory(null);
    setProductGroup(productGroup?.id || null);
  };

  const handleCategoryClick = () => {
    setSelectedBrands("");
    setProductGroup(null);
    setCategory(productCategory?.id || 0);
  };
  return (
    <div className={cn("min-w-0 max-w-full border-b border-neutral-200", className)}>
      <Breadcrumb className="overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" tabIndex={0} aria-label={ru ? "Навигация по каталогу" : "Brotkrümelnavigation"}>
        <BreadcrumbList className="w-max flex-nowrap gap-2 whitespace-nowrap py-3 text-[13px] leading-5 text-neutral-600 sm:gap-2">
          <BreadcrumbItem className="shrink-0">
            <BreadcrumbLink asChild>
              <Link className="text-[13px]" href={"/"}>
                {ru ? "Главная" : "Home"}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="shrink-0 text-neutral-400">/</BreadcrumbSeparator>
          <BreadcrumbItem className="shrink-0">
            <BreadcrumbLink asChild onClick={handleCategoryClick}>
              <Link
                className="text-[13px]"
                href={`/items/?category=${productCategory?.id}`}
              >
                {ru ? productCategory?.labelRu : productCategory?.labelDe}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="shrink-0 text-neutral-400">/</BreadcrumbSeparator>
          <BreadcrumbItem className="shrink-0">
            <BreadcrumbLink asChild onClick={handleProductGroupClick}>
              <Link
                className="text-[13px]"
                href={`/items/?productGroup=${productGroup?.id}`}
              >
                {ru ? productGroup?.labelRu : productGroup?.labelDe}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="shrink-0 text-neutral-400">/</BreadcrumbSeparator>

          <BreadcrumbItem className="shrink-0">
            <BreadcrumbLink asChild onClick={handleBrandClick}>
              <Link
                className="text-[13px]"
                href={`/items/?brands=${productBrand?.id}`}
              >
                {productBrand?.name}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="shrink-0 text-neutral-400">/</BreadcrumbSeparator>

          <BreadcrumbItem className="shrink-0">
            <BreadcrumbPage className="text-[13px]">{productName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};
