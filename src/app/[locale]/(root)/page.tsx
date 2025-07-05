import {
  Carusel,
  TopBar,
  ProductsSelection,
  RecentReviews,
  Stories,
} from "@/src/shared/components/shared";
import { getNewProducts, getPopularProducts, getSlides, getStories } from "@/src/shared/lib";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  const slides = await getSlides();
  const stories = await getStories();
  const t = await getTranslations("Home");
  return (
    <>
      <Carusel slides={slides} />
      <TopBar />
      <ProductsSelection
        getFunction={getNewProducts}
        title={t("newProducts")}
        className="col-span-2 lg:col-span-4 my-10"
      />
      <Stories items={stories} />
      <ProductsSelection
        getFunction={getPopularProducts}
        title={t("popularProducts")}
        className=" my-10"
      />
      <RecentReviews />
    </>
  );
}
