import { prisma } from "@/prisma/prisma-client";
import { Container, ReviewForm, ReviewsList, Title } from "@/src/shared/components";
import { getTranslations } from "next-intl/server";

export default async function Reviews() {
  const reviews = await prisma.review.findMany({
    include: {
      user: true,
    },
  });

  const t = await getTranslations("Reviews");
  return (
    <Container>
      {reviews.length > 0 ? (
        <>
          <Title text={t("title")} size="lg" className="font-extrabold my-10" />
          <ReviewsList reviews={reviews} className="mb-10" />
        </>
      ) : (
        <Title
          text={t("noReviews")}
          size="lg"
          className="font-extrabold my-10"
        />
      )}
       <ReviewForm  />
    </Container>
  );
}
