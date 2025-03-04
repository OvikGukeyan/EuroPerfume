"use client";
import React, { FC } from "react";
import { cn } from "@/lib/utils";
import { Button } from "..";
import { useFormStatus } from "react-dom";

type Props = {
  className?: string;
};

export const SubmitButtonBar: FC<Props> = ({ className }) => {
  const { pending } = useFormStatus();
  return (
    <div className={cn("flex items-center justify-end gap-5", className)}>
      <Button loading={pending} size={"lg"}>
        Submit
      </Button>
    </div>
  );
};
