"use client";

import React, { FC, useState } from "react";
import { cn } from "@/lib/utils";
import { Button, Input, Title } from "..";
import { Label } from "../ui/label";
import { createSlide } from "@/app/actions";

type Props = {
  onSubmit: (data: {name: string}) => void;
  loading?: boolean;
  error: boolean;
  className?: string;
};

export const CreateBrandForm: FC<Props> = ({ className, onSubmit, loading, error }) => {
  
const [brandName, setBrandName] = useState<string>("");

  const onClickSubmit = () => {
    onSubmit({name: brandName});
  }
  return (
    <div className={cn(" px-10 mb-10", className)}>
      <Title className="mb-5" text="Create new Brand" />

      <form className="flex flex-col items-start gap-5" action={createSlide}>
        <div>
          <Label className=" text-lg" htmlFor="name">
            Name
          </Label>
          <Input
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            required
            name="labelRu"
            className="mt-2"
            placeholder="Ru"
          />
        </div>

       
{error && <p className="text-red-500 text-sm mt-2">Error</p>}
        <Button  disabled={brandName === "" } loading={loading} onClick={onClickSubmit}>Add</Button>
      </form>
    </div>
  );
};
