import {
  Carusel,
  TopBar,
  ProductsSelection,
  RecentReviews,
  StoriesCarousel,
} from "@/src/shared/components/shared";
import {
  getNewProducts,
  getPopularProducts,
  getSlides,
  getStories,
} from "@/src/shared/lib";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  const slides = await getSlides();
  const stories = await getStories();

  const t = await getTranslations("Home");
  return (
    <div className="bg-gray-50">
      <Carusel slides={slides.filter((s) => s.location === 1)} />
      <TopBar />
      <ProductsSelection
        getFunction={getNewProducts}
        title={t("newProducts")}
        className="col-span-2 lg:col-span-4 my-10"
      />
      <StoriesCarousel items={stories} />
      <ProductsSelection
        getFunction={getPopularProducts}
        title={t("popularProducts")}
        className=" my-10"
      />
      <Carusel slides={slides.filter((s) => s.location === 2)} />

      <RecentReviews />
    </div>
  );
}
