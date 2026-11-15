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
    <section className={cn("home-section home-reviews", className)}>
      {reviews.length > 0 && (
        <>
          <div className="home-section-heading"><div><p className="home-eyebrow">EURO PERFUME</p><h2>{t("title")}</h2></div></div>
         <RecentReviewsList reviews={reviews} />
        </>
      )}
    </section>
  );
};
