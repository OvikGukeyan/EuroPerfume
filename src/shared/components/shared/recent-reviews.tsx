import React, { FC, use } from "react";
import { RecentReviewsList, Title } from "..";
import { useTranslations } from "next-intl";
import { cn } from "../../lib/utils";
import { getRecentReviews } from "../../server-lib/get-recent-reviews";

interface Props {
  className?: string;
}

export const RecentReviews: FC<Props> = ({ className }) => {
  const reviews = use(getRecentReviews());
  const t = useTranslations("RecentReviews");
  return (
    <div className={cn(className)}>
      {reviews.length > 0 && (
        <>
          <div className="flex items-center justify-center gap-4 w-full">
            <div className="h-1 w-12 bg-black"></div>
            <Title
              className="text-2xl sm:text-3xl  md:text-5xl   font-extrabold text-center my-10"
              text={t("title").toUpperCase()}
            />
            <div className="h-1 w-12 bg-black"></div>
          </div>
         <RecentReviewsList reviews={reviews} />
        </>
      )}
    </div>
  );
};
