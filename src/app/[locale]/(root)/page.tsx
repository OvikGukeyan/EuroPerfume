import {
  Carusel,
  TopBar,
  ProductsSelection,
  StoriesCarousel,
  ChatBotDrawer,
} from "@/src/shared/components/shared";
import { RecentReviews } from "@/src/shared/components/shared/recent-reviews";
import { getDiscountedItems } from "@/src/shared/server-lib/get-discouted-items";
import { getNewProducts } from "@/src/shared/server-lib/get-new-products";
import { getPopularProducts } from "@/src/shared/server-lib/get-popular-products";
import { getSlides } from "@/src/shared/server-lib/get-slides";
import { getStories } from "@/src/shared/server-lib/get-stories";
import { Slide, SlideImage } from "@prisma/client";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  const slides = await getSlides();
  const stories = await getStories();

  const t = await getTranslations("Home");
  const topSlides = slides.filter((s) => s.location === 1) as (Slide & {
    images: SlideImage[];
  })[];
  const bottomSlides = slides.filter((s) => s.location === 2) as (Slide & {
    images: SlideImage[];
  })[];
  return (
    <div className="bg-gray-50">
      <Carusel slides={topSlides} />
      <TopBar />
      <ProductsSelection
        getFunction={getNewProducts}
        title={t("newProducts")}
        className="col-span-2 lg:col-span-4 my-10"
      />
      <ProductsSelection
        getFunction={getDiscountedItems}
        title={t("discountedProducts")}
        className=" my-10"
      />
      <StoriesCarousel items={stories} />
      <ProductsSelection
        getFunction={getPopularProducts}
        title={t("popularProducts")}
        className=" my-10"
      />
      <Carusel slides={bottomSlides} />
      {/* <ChatBotDrawer /> */}
      <RecentReviews />
    </div>
  );
}
