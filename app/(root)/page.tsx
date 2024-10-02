import { Container, Title, TopBar, Filters, ProductsGroupList } from "@/shared/components/shared";
import { prisma } from "@/prisma/prisma-client";

export default async function Home() {
  const categoryes = await prisma.category.findMany({
    include: {
      products: {
        include: {
          ingredients: true,
          items: true
        }
      }
    }
  });


  return (
    <>
      <Container className="mt-10">
        <Title size="lg" className="font-extrabold" text='All pizzas' />
      </Container>
      <TopBar categories={categoryes.filter((category) => category.products.length > 0)}/>
      <Container className="mt-10 pb-14">
        <div className='flex gap-[60px]'>
          <div className="w-[250px]">
            <Filters />
          </div>

          <div className="flex-1">
            <div className="flex flex-col gap-16">
              {
                categoryes.map((categoryes) => (
                  categoryes.products.length && (
                    <ProductsGroupList
                      key={categoryes.id}
                      title={categoryes.name}
                      categoryId={categoryes.id}
                      items={categoryes.products}
                    />
                  )
                ))
              }

            </div>


          </div>
        </div>
      </Container>
    </>

  );
}
