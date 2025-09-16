'use client';

import React, { FC } from "react";
import { cn } from "@/src/lib/utils";
import { Button, CreateBrandForm, Popover } from "..";
import { PopoverContent, PopoverTrigger } from "../ui/popover";
import { FormSelect } from "@/src/shared/components/shared/product-form/form-select";
import { Control } from "react-hook-form";
import { CreateProductFormValues } from "@/src/shared/constants";
import { useProductMeta } from "../../hooks";

type Props = {
    control: Control<CreateProductFormValues>;
  className?: string;
};

export const BrandSelect: FC<Props> = ({ className, control }) => {
  const {productMeta: {brands}, createBrand, loading: brandsLoading, error: brandsError} = useProductMeta();  
  return (
    <div
      className={cn(
        "flex flex-col gap-5 border rounded-sm p-5 mb-5",
        className
      )}
    >
      <FormSelect title="Бренд" name="brand" control={control} items={brands.map((item) => ({ name: item.name, value: item.id.toString() }))} />

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Add new brand</Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <CreateBrandForm
            onSubmit={createBrand}
            loading={brandsLoading}
            error={brandsError}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
