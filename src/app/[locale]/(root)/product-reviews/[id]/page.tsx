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

  const product = await prisma.product.findFirst({
    where: {
      id: productId,
    },
    include: {
      variations: true,
      reviews: {
        include: {
          user: true,
        },
      },
    },
  });

  const t = await getTranslations("Reviews");

  if (!product) return null;
  return (
    <Container>
      <Link href={`/product/${productId}`}>
        <div className="flex gap-10">
          <Image
            src={
              product?.variations?.[0]?.imageUrl || product?.imageUrl?.[0] || ""
            }
            alt={product?.name || ""}
            width={100}
            height={100}
          />

          <Title
            text={product?.name || ""}
            size="lg"
            className="font-extrabold my-10"
          />
        </div>
      </Link>

      {product.reviews.length > 0 ? (
        <>
          <Title text={t("title")} size="lg" className="font-extrabold my-10" />
          <ReviewsList
            reviews={product.reviews}
            className="mb-10"
          />
        </>
      ) : (
        <Title
          text={t("noReviews")}
          size="lg"
          className="font-extrabold my-10"
        />
      )}
      <ReviewForm productId={product.id} />
    </Container>
  );
}
