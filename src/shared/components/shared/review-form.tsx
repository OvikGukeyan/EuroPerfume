
import React, { FC } from "react";
import { RatingSelect, SubmitButtonBar, Title } from ".";
import { Textarea } from "..";
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
export const ReviewForm: FC<Props> =  ({ className, productId }) => {
 const t = useTranslations("ReviewForm");

  return (
     <Card className={cn("p-2 md:p-5", className)}>
      <CardHeader>
        <CardTitle>
          <Title text={t("title")} size="md" className="font-extrabold" />
        </CardTitle>
      </CardHeader>
      <form className="flex flex-col items-start gap-5" action={createReview}>
        <input type="hidden" name="productId" value={productId} />
        <CardContent>
          <RatingSelect />
        </CardContent>
        <CardContent className="w-full">
          <Textarea name="comment" placeholder={t("commentPlaceholder")} required />
        </CardContent>

        <CardFooter>
          <SubmitButtonBar  />
        </CardFooter>
      </form>
    </Card>
  );
};
