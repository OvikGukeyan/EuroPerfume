import { HomePriceProvider } from "@/src/shared/components/shared/home-price-note";
import "./home.css";
import { HomeCatalog } from "@/src/shared/components/shared/home-catalog";
import { getHomeCatalog } from "@/src/shared/server-lib/get-home-catalog";
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
import { getHeroPromotions } from "@/src/shared/server-lib/get-hero-promotion";
import { getWeekFragrances } from "@/src/shared/server-lib/get-active-day-fragrance";
import { getSlides } from "@/src/shared/server-lib/get-slides";
import { getStories } from "@/src/shared/server-lib/get-stories";
import { Slide, SlideImage } from "@prisma/client";
import { getTranslations } from "next-intl/server";
export const dynamic = "force-dynamic";
export default async function Home() {
  const [slides, stories, catalog, heroPromotions, dayFragrances] = await Promise.all([getSlides(), getStories(), getHomeCatalog(), getHeroPromotions(), getWeekFragrances()]);

  const t = await getTranslations("Home");
  const topSlides = slides.filter((s) => s.location === 1) as (Slide & {
    images: SlideImage[];
  })[];
  const bottomSlides = slides.filter((s) => s.location === 2) as (Slide & {
    images: SlideImage[];
  })[];
  return (
    <HomePriceProvider><div className="storefront-home bg-white">
      <Carusel slides={topSlides} promotions={heroPromotions} dayFragrances={dayFragrances} />
      <TopBar />
      <ProductsSelection
        getFunction={getNewProducts}
        title={t("newProducts")}
        className="col-span-2 lg:col-span-4 my-10"
      />
      <ProductsSelection
        getFunction={getPopularProducts}
        title={t("popularProducts")}
        className="my-10"
      />
      <ProductsSelection
        getFunction={getDiscountedItems}
        title={t("discountedProducts")}
        className="my-10"
      />
      <HomeCatalog initialPage={catalog} />
      <StoriesCarousel items={stories} />
      <Carusel slides={bottomSlides} />
      {/* <ChatBotDrawer /> */}
      <RecentReviews />
    </div></HomePriceProvider>
  );
}
