"use client";

import React, { FC, useState } from "react";
import { cn } from "@/src/lib/utils";
import { Button, Input, Title } from "..";
import { Label } from "../ui/label";
import { ProductGroupValues } from "@/src/shared/store";

type Props = {
  onSubmit: (data: ProductGroupValues) => void;
  loading?: boolean;
  error: boolean;
  categoryId: number;
  className?: string;
};

export const CreateGroupForm: FC<Props> = ({
  className,
  onSubmit,
  loading,
  categoryId,
  error,
}) => {
  const [name, setName] = useState<string>("");

  const onSubmitClick = () => {
    onSubmit({
      name: name,
      categoryId
    });
    setName("");
  };
  return (
    <div className={cn(" px-10 mb-10", className)}>
      <Title className="mb-5" text="Create new" />

      <form className="flex flex-col items-start gap-5">
        <div>
          <Label className=" text-lg" htmlFor="name">
            Name
          </Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            name="labelRu"
            className="mt-2"
            placeholder="Ru"
          />
        </div>

        {error && <p className="text-red-500 text-sm mt-2">Error</p>}
        <Button
          disabled={name === ""}
          loading={loading}
          onClick={onSubmitClick}
          type="submit"
        >
          Add
        </Button>
      </form>
    </div>
  );
};
