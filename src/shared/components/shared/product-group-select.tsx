"use client";

import React, { FC } from "react";
import { cn } from "@/src/lib/utils";
import { Button, CreateGroupForm, Popover } from "..";
import { PopoverContent, PopoverTrigger } from "../ui/popover";
import { FormSelect } from "@/src/shared/components/shared/product-form/form-select";
import { useProductGroup } from "@/src/shared/hooks";
import { Control } from "react-hook-form";
import { CreateProductFormValues } from "@/src/shared/constants";
import { Trash } from "lucide-react";

type Props = {
  control: Control<CreateProductFormValues>;
  categoryId: number;
  className?: string;
};

export const ProductGroupSelect: FC<Props> = ({
  className,
  categoryId,
  control,
}) => {
  const {
    productGroups,
    loading: productGroupsLoading,
    error: productGroupsError,
    createProductGroup,
    deleteProductGroup,
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
        items={productGroups
          .filter((item) => item.categoryId === categoryId)
          .map((item) => ({
            value: item.id.toString(),
            name: item.labelRu,
          }))}
      />

      <div className="w-full flex flex-col md:flex-row gap-5">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Add new</Button>
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

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Delete</Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <ul>
              {productGroups
                .filter((item) => item.categoryId === categoryId)
                .map((item) => (
                  <li
                    className="flex items-center justify-between cursor-pointer mb-2 hover:bg-slate-100 h-8 px-2"
                    key={item.id}
                    onClick={() => deleteProductGroup(item.id)}
                  >
                    <p>{item.labelRu}</p>
                    <Trash size={16} />
                  </li>
                ))}
            </ul>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
