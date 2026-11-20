"use client";
import React, { FC } from "react";
import { cn } from "../../lib/utils";
import { Rating } from "./rating";
import { ArrowRight } from "lucide-react";
import { Link } from "@/src/i18n/navigation";
import { useLocale } from "next-intl";
import { Review, User } from "@prisma/client";
import { SelectedProductDTO } from "../../server-lib/get-popular-products";

type Props = {
  reviews: (Review & { product: SelectedProductDTO; user: User })[];
  className?: string;
};

export const RecentReviewsList: FC<Props> = ({ className, reviews }) => {
  const ru = useLocale() === "ru";
  return <div className={cn("home-reviews-grid", className)}>
    {reviews.map(review => <article className="home-review-card" key={review.id}>
      <div className="home-review-top"><Rating value={review.rating} /><time dateTime={String(review.createdAt)}>{new Date(review.createdAt).toLocaleDateString(ru ? "ru-RU" : "de-DE")}</time></div>
      <Link href={`/product/${review.product.id}`}><h3>{review.product.name}</h3><p className="home-review-brand">{review.product.brand.name}</p></Link>
      <p className="home-review-text">{review.text}</p>
      <Link href={`/product-reviews/${review.product.id}`} className="home-review-more group" aria-label={(ru ? "Читать отзыв полностью: " : "Vollständige Bewertung lesen: ") + review.product.name}><span>{ru ? "Читать отзыв полностью" : "Vollständige Bewertung lesen"}</span><ArrowRight size={15} strokeWidth={1.5} aria-hidden="true" className="shrink-0 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"/></Link>
      <p className="home-review-author">{review.user.fullName?.split(" ")[0] || (ru ? "Покупатель" : "Kunde")}</p>
    </article>)}
  </div>;
};
