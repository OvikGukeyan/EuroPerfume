"use client";

import React, { FC } from "react";
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
    <div className={cn("", className)}>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link className="text-xl" href={"/"}>
                Home
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild onClick={handleCategoryClick}>
              <Link
                className="text-xl"
                href={`/items/?category=${productCategory?.id}`}
              >
                {productCategory?.labelDe}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild onClick={handleProductGroupClick}>
              <Link
                className="text-xl"
                href={`/items/?productGroup=${productGroup?.id}`}
              >
                {productGroup?.labelDe}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbLink asChild onClick={handleBrandClick}>
              <Link
                className="text-xl"
                href={`/items/?brands=${productBrand?.id}`}
              >
                {productBrand?.name}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage className="text-xl">{productName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};
