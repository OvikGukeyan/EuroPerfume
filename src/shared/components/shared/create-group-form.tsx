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
  const [labelDe, setLabelDe] = useState<string>("");
  const [labelRu, setLabelRu] = useState<string>("");

  const onSubmitClick =  () => {
    onSubmit({
      labelDe: labelDe,
      labelRu: labelRu,
      categoryId,
    });
    setLabelDe("");
    setLabelRu("");
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
            value={labelRu}
            onChange={(e) => setLabelRu(e.target.value)}
            required
            name="labelRu"
            className="mt-2"
            placeholder="Ru"
          />

          <Input
            value={labelDe}
            onChange={(e) => setLabelDe(e.target.value)}
            required
            name="labelRu"
            className="mt-2"
            placeholder="De"
          />
        </div>

        {error && <p className="text-red-500 text-sm mt-2">Error</p>}
        <Button
          disabled={labelRu === "" || labelDe === ""}
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
