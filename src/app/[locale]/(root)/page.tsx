import {
  Container,
  Title,
  ProductsGroupList,
  FiltersDrawer,
  PaginationComponent,
  Carusel,
  TopBar,
  ProductsSelection,
  RecentReviews,
} from "@/src/shared/components/shared";
import { getNewProducts, getPopularProducts, getSlides } from "@/src/shared/lib";
import { Api } from "@/src/shared/services/api-client";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

export default async function Home() {
  const slides = await getSlides();

  const t = await getTranslations("Home");
  return (
    <>
      <Carusel slides={slides} />
      <TopBar />
      <ProductsSelection
        getFunction={getNewProducts}
        title={t("newProducts")}
        className="col-span-2 lg:col-span-4"
      />
      <Container className="mt-10">
        <Title size="lg" className="font-extrabold" text={t("allProducts").toUpperCase()} />
      </Container>
      <Container className="mt-10 pb-14">
        <div className="flex flex-col xl:flex-row gap-[50px]">
          <FiltersDrawer />

          <div className="flex-1">
            <div className="flex flex-col gap-16">
              <Suspense fallback={<div>Loading...</div>}>
                <ProductsGroupList />
              </Suspense>
            </div>
          </div>
        </div>
        <PaginationComponent className="mt-10" />
      </Container>
      <ProductsSelection
        getFunction={getPopularProducts}
        title={t("popularProducts")}
        className="mb-5"
      />
      <RecentReviews />
    </>
  );
}
