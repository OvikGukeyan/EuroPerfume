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
import Link from "next/link";
import { Category, ProductGroup } from "@prisma/client";

type Props = {
  productName?: string;
  className?: string;
  productCategory?: Category;
  productGroup?: ProductGroup;
};


export const BreadcrumbComponent: FC<Props> = ({ className, productName, productCategory, productGroup }) => {
  return (
    <div className={cn("", className)}>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <a className="text-xl" href={"/"}>Home</a>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <a className="text-xl" href={`/items/?category=${productCategory?.id}`}>{productCategory?.labelDe}</a>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <a className="text-xl" href={`/items/?productGroup=${productGroup?.id}`}>{productGroup?.labelDe}</a>
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
