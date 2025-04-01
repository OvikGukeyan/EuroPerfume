import {
  Container,
  Title,
  ProductsGroupList,
  FiltersDrawer,
  PaginationComponent,
  Carusel,
  TopBar,
} from "@/shared/components/shared";
import { getSlides } from "@/shared/lib";

import { findProducts, GetSearchParams } from "@/shared/lib/find-products";
import { ProductDTO } from "@/shared/services/dto/product.dto";
import { Product, ProductVariation } from "@prisma/client";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<GetSearchParams>;
}) {
  const params = await searchParams;
  const { categoryes, totalPages } = await findProducts(params);
  const slides = await getSlides();
  return (
    <>
      <Carusel slides={slides} />
      <TopBar
        // categories={categoryes.filter(
        //   (category) => category.products.length > 0
        // )}
        categories={categoryes}
      />

      <Container className="mt-10">
        <Title size="lg" className="font-extrabold" text="All products" />
      </Container>
      <Container className="mt-10 pb-14">
        <div className="flex flex-col xl:flex-row gap-[50px]">
          <FiltersDrawer />

          <div className="flex-1">
            <div className="flex flex-col gap-16">
              {categoryes.map(
                (category) =>
                    <ProductsGroupList
                      key={category.id}
                      title={category.name}
                      categoryId={category.id}
                      items={category.productGroups.flatMap((productGroup) => productGroup.products) as ProductDTO[]}
                    />
              )}
            </div>
          </div>
        </div>
        <PaginationComponent className="mt-10" countOfPages={totalPages} />
      </Container>
    </>
  );
}
