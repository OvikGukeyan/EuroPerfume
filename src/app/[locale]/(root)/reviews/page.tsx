import { prisma } from "@/prisma/prisma-client";
import { Container, ReviewForm, ReviewsList, Title } from "@/src/shared/components";

export default async function Reviews() {
  const reviews = await prisma.review.findMany({
    include: {
      user: true,
    },
  });
  return (
    <Container>
      {reviews.length > 0 ? (
        <>
          <Title text="Reviews" size="lg" className="font-extrabold my-10" />
          <ReviewsList reviews={reviews} className="mb-10" />
        </>
      ) : (
        <Title
          text="No reviews yet"
          size="lg"
          className="font-extrabold my-10"
        />
      )}
       <ReviewForm  />
    </Container>
  );
}
