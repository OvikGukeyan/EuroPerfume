import {
  Container,
  Title,
  ProductsGroupList,
  FiltersDrawer,
  Stories,
  PaginationComponent,
} from "@/shared/components/shared";

import { findProducts, GetSearchParams } from "@/shared/lib/find-products";

export default async function Home({
  searchParams,
}: {
  searchParams: GetSearchParams;
}) {
  const {categoryes, totalPages} = await findProducts(searchParams);

  return (
    <>
      <Container className="mt-10">
        <Title size="lg" className="font-extrabold" text="All perfumes" />
      </Container>
      {/* <TopBar categories={categoryes.filter((category) => category.products.length > 0)} /> */}
      {/* <Stories /> */}
      <Container className="mt-10 pb-14">
        <div className="flex flex-col xl:flex-row gap-[50px]">
          <FiltersDrawer />

          <div className="flex-1">
            <div className="flex flex-col gap-16">
              {categoryes.map(
                (categoryes) =>
                  categoryes.products.length && (
                    <ProductsGroupList
                      key={categoryes.id}
                      title={categoryes.name}
                      categoryId={categoryes.id}
                      items={categoryes.products}
                    />
                  )
              )}
            </div>
          </div>
        </div>
       <PaginationComponent  countOfPages={totalPages}/>
      </Container>
    </>
  );
}
