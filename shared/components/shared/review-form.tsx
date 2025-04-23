import React, { FC } from "react";
import { cn } from "@/lib/utils";
import { RatingSelect, SubmitButtonBar, Title } from ".";
import { Textarea } from "..";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { createReview } from "@/app/actions";


type Props = {
  className?: string;
  productId?: number;
};
export const ReviewForm: FC<Props> = async ({ className, productId }) => {
 

  return (
    <Card className={cn("p-5", className)}>
      <CardHeader>
        <CardTitle>
          <Title text="Write a review" size="md" className="font-extrabold " />
        </CardTitle>
      </CardHeader>
      <form className="flex flex-col items-start gap-5" action={createReview}>
        <input type="hidden" name="productId" value={productId} />
        <CardContent>
          <RatingSelect />
        </CardContent>
        <CardContent className="w-full">
          <Textarea name="comment" required />
        </CardContent>

        <CardFooter>
          <SubmitButtonBar   />
        </CardFooter>
      </form>
    </Card>
  );
};
