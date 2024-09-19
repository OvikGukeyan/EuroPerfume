import { Container, Title, TopBar, Filters, ProductsGroupList } from "@/components/shared";
import { prisma } from "@/prisma/prisma-client";
import Image from "next/image";

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

  console.log(categoryes[0].products[0])

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
