"use client";
import React, { FC } from "react";
import { ProductsCarusel } from "..";
import { useRecentlyViewed } from "../../hooks";

type Props = {
  className?: string;
};

export const RecentlyViewed: FC<Props> = ({ className }) => {
  const recentlyViewed = useRecentlyViewed();
  return (
    <>
      {recentlyViewed.length > 0 && (
        <ProductsCarusel
          className={className}
          items={recentlyViewed}
          title="Recently Viewed"
        />
      )}
    </>
  );
};
