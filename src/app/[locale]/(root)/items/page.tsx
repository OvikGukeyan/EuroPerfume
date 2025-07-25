import {
  Container,
  FiltersDrawer,
  PaginationComponent,
  ProductsGroupList,
  TopBar,
} from "@/src/shared/components";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

export default async function Items() {
  const t = await getTranslations("Home");

  return (
    <div className="bg-gray-50">
      <TopBar />

      
      <Container className="mt-10 pb-14">
        <div className="flex flex-col xl:flex-row gap-[50px]">
          <FiltersDrawer />

          <div className="flex-1">
            <Suspense fallback={<div>Loading...</div>}>
              <ProductsGroupList />
            </Suspense>
          </div>
        </div>
        <PaginationComponent className="mt-10" />
      </Container>
    </div>
  );
}
