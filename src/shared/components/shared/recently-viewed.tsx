"use client";
import React, { FC } from "react";
import { ProductsCarusel } from "..";
import { useRecentlyViewed } from "../../hooks";
import { useTranslations } from "next-intl";

type Props = {
  className?: string;
};

export const RecentlyViewed: FC<Props> = ({ className }) => {
  const recentlyViewed = useRecentlyViewed();
  const t = useTranslations("RecentlyViewed");
  return (
    <>
      {recentlyViewed.length > 0 && (
        <ProductsCarusel
          className={className}
          items={recentlyViewed}
          title={t("title")}
        />
      )}
    </>
  );
};
