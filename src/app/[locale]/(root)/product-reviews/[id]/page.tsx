import { prisma } from "@/prisma/prisma-client";
import {
  Container,
  ReviewForm,
  ReviewsList,
  Title,
} from "@/src/shared/components";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";

export default async function Reviews({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const productId = Number((await params).id);

  const reviews = await prisma.review.findMany({
    where: {
      productId,
    },
    include: {
      user: true,
      product: {
        include: {
          variations: true,
        },
      },
    },
  });

  const t = await getTranslations("Reviews");
  return (
    <Container>
      <Link href={`/product/${productId}`}>
        <div className="flex gap-10">
          <Image
            src={
              reviews[0].product?.imageUrl[0] ||
              reviews[0].product?.variations[0].imageUrl ||
              ""
            }
            alt={reviews[0].product?.name || ""}
            width={100}
            height={100}
          />

          <Title
            text={reviews[0].product?.name || ""}
            size="lg"
            className="font-extrabold my-10"
          />
        </div>
      </Link>

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
      <ReviewForm />
    </Container>
  );
}
