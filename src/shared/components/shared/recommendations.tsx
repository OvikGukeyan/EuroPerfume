"use client";
import React, { FC } from "react";
import { useRecommendations } from "../../hooks";
import { ProductDTO } from "../../services/dto/product.dto";
import { ProductsCarusel } from "..";
import { RecommendationsParams } from "../../hooks/use-recommendations";
import { useTranslations } from "next-intl";

type Props = {
  className?: string;
  searchParams: RecommendationsParams;
};

export const Recommendations: FC<Props> = ({ className, searchParams }) => {
  const recommendations = useRecommendations(searchParams);
  const t = useTranslations("YouMayLike");
  return (
    <>
      {recommendations.length > 0 && (
        <ProductsCarusel
          className={className}
          items={recommendations}
          title={t("title")}
        />
      )}
    </>
  );
};
