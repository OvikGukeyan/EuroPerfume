"use client";
import React, { FC, useActionState } from "react";
import { RatingSelect, SubmitButtonBar, Title } from ".";
import { Input, Textarea } from "..";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { createReview } from "@/src/app/actions";
import { cn } from "@/src/lib/utils";
import { useTranslations } from "next-intl";

type Props = {
  className?: string;
  productId?: number;
};
export const ReviewForm: FC<Props> = ({ className, productId }) => {
  const t = useTranslations("ReviewForm");

  const [state, formAction] = useActionState(createReview, { success: false });

  return (
    <Card className={cn("p-2 md:p-5", className)}>
      {state.success && <p className="text-green-600">{t("success")}</p>}
      <CardHeader>
        <CardTitle>
          <Title text={t("title")} size="md" className="font-extrabold" />
        </CardTitle>
      </CardHeader>
      <form className="flex flex-col items-start gap-5" action={formAction}>
        <input type="hidden" name="productId" value={productId} />
        <CardContent>
          <RatingSelect />
        </CardContent>
        <CardContent className="w-full">
          <Textarea
            name="comment"
            placeholder={t("commentPlaceholder")}
            required
          />
        </CardContent>

        <CardContent className="w-full">
          <Input name="images" multiple type="file" accept="image/*" />
        </CardContent>

        <CardFooter>
          <SubmitButtonBar />
        </CardFooter>
      </form>
    </Card>
  );
};
