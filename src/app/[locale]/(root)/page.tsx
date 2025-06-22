import {
  Container,
  Title,
  ProductsGroupList,
  FiltersDrawer,
  PaginationComponent,
  Carusel,
  TopBar,
  ProductsSelection,
} from "@/src/shared/components/shared";
import { getSlides } from "@/src/shared/lib";
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
          getFunction={Api.products.getNewProducts}
          title={t("newProducts")}
          className="col-span-2 lg:col-span-4"
        />
      <Container className="mt-10">
        <Title size="lg" className="font-extrabold" text={t("allProducts")} />
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
        <ProductsSelection
          getFunction={Api.products.getPopularProducts}
          title={t("popularProducts")}
          className="col-span-2 lg:col-span-4"
        />

        <PaginationComponent className="mt-10" />
      </Container>
    </>
  );
}
