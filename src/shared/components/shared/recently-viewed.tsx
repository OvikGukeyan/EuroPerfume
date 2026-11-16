"use client";
import React, { FC } from "react";
import { ProductsCarusel } from "..";
import { useRecentlyViewed } from "../../hooks";
import { useTranslations } from "next-intl";

type Props = {
  className?: string;
  excludeId?: number;
};

export const RecentlyViewed: FC<Props> = ({ className, excludeId }) => {
  const recentlyViewed = useRecentlyViewed();
  const otherViewed=recentlyViewed.filter(p=>p.id!==excludeId);
  const t = useTranslations("RecentlyViewed");
  return (
    <>
      {otherViewed.length > 0 && (
        <ProductsCarusel
          className={className}
          items={otherViewed}
          title={t("title")}
        />
      )}
    </>
  );
};
