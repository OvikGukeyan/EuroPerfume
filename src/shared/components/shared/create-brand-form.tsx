"use client";

import React, { FC, useState } from "react";
import { cn } from "@/lib/utils";
import { Button, Input, Title } from "..";
import { Label } from "../ui/label";

type Props = {
  onSubmit: (data: { name: string }) => void;
  loading?: boolean;
  error: boolean;
  className?: string;
};

export const CreateBrandForm: FC<Props> = ({
  className,
  onSubmit,
  loading,
  error,
}) => {
  const [name, setName] = useState<string>("");

  const onSubmitClick = () => {
    onSubmit({
      name: name,
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
