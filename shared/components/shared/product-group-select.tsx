"use client";

import React, { FC } from "react";
import { cn } from "@/lib/utils";
import { Button, CreateGroupForm, Popover } from "..";
import { PopoverContent, PopoverTrigger } from "../ui/popover";
import { FormSelect } from "@/shared/components/shared/product-form/form-select";
import { useProductGroup } from "@/shared/hooks";
import { Control } from "react-hook-form";
import { CreateProductFormValues } from "@/shared/constants";

type Props = {
  control: Control<CreateProductFormValues>;
  categoryId: number;
  className?: string;
};

export const ProductGroupSelect: FC<Props> = ({ className, categoryId, control }) => {
  const {
    productGroups,
    loading: productGroupsLoading,
    error: productGroupsError,
    createProductGroup,
  } = useProductGroup();

  return (
    <div
      className={cn(
        "flex flex-col gap-5 border rounded-sm p-5 mb-5",
        className
      )}
    >
      <FormSelect
        name="productGroupId"
        control={control}
        items={productGroups.filter((item) => item.categoryId === categoryId)}
      />

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Add new product group</Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <CreateGroupForm
            onSubmit={createProductGroup}
            categoryId={categoryId}
            error={productGroupsError}
            loading={productGroupsLoading}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
