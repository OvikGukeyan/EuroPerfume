"use client";
import React, { FC } from "react";
import { cn } from "@/src/lib/utils";
import { Button } from "..";
import { useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";

type Props = {
  disabled?: boolean;
  className?: string;
};

export const SubmitButtonBar: FC<Props> = ({ className, disabled }) => {
   const t = useTranslations("ReviewForm");
  
  const { pending } = useFormStatus();
  return (
    <div className={cn("flex items-center justify-end gap-5", className)}>
      <Button disabled={disabled} loading={pending} size={"lg"}>
        {t("submitButton")}
      </Button>
    </div>
  );
};
