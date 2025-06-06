
import {
  Container,
  Title,
  ProductsGroupList,
  FiltersDrawer,
  PaginationComponent,
  Carusel,
  TopBar,
} from "@/src/shared/components/shared";
import { getSlides } from "@/src/shared/lib";
import { Suspense } from "react";

export default async function Home() {
  const slides = await getSlides();

  return (
    <>
      <Carusel slides={slides} />
      <TopBar />

      <Container className="mt-10">
        <Title size="lg" className="font-extrabold" text="All products" />
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
    </>
  );
}
