import { prisma } from "@/prisma/prisma-client";
import {
  Container,
  ReviewForm,
  ReviewsList,
  Title,
} from "@/src/shared/components";
import { reviewExtended } from "@/src/shared/components/shared/reviews-list";
import { getTranslations } from "next-intl/server";

export default async function Reviews() {
  const reviews = await prisma.review.findMany({
    include: {
      user: true,
      reply: true,
      product: {
        include: {
          variations: true,
          
        },
      },
    },
  });
  
  const t = await getTranslations("Reviews");
  return (
    <Container className="px-1 md:px-4">
      {reviews.length > 0 ? (
        <>
          <Title text={t("title")} size="lg" className="font-extrabold my-10" />
          <ReviewsList reviews={reviews as reviewExtended[]} className="mb-10" />
        </>
      ) : (
        <Title
          text={t("noReviews")}
          size="lg"
          className="font-extrabold my-10"
        />
      )}
      <ReviewForm />

    </Container>
  );
}
