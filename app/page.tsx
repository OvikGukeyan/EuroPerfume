import { Categories, Container, SortPopup, Title, TopBar, Filters, ProductsGroupList } from "@/components/shared";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Container className="mt-10">
        <Title size="lg" className="font-extrabold" text='All pizzas' />
      </Container>
      <TopBar />
      <Container className="mt-10 pb-14">
        <div className='flex gap-[60px]'>
          <div className="w-[250px]">
            <Filters />
          </div>

          <div className="flex-1">
            <div className="flex flex-col gap-16">
              <ProductsGroupList title={"Pizzas"} items={[
                {
                  id: 1,
                  name: 'Margherita',
                  imageUrl: '/pizza.jpg',
                  items: [{ price: 9.99 }]
                },
                {
                  id: 2,
                  name: 'Pepperoni',
                  imageUrl: '/pizza.jpg',
                  items: [{ price: 12.99 }]
                },
                {
                  id: 3,
                  name: 'BBQ Chicken',
                  imageUrl: '/pizza.jpg',
                  items: [{ price: 14.99 }]
                },
                {
                  id: 4,
                  name: 'Vegetarian',
                  imageUrl: '/pizza.jpg',
                  items: [{ price: 11.99 }]
                },
                {
                  id: 5,
                  name: 'Hawaiian',
                  imageUrl: '/pizza.jpg',
                  items: [{ price: 13.99 }]
                }
              ]} categoryId={1} />

              <ProductsGroupList title={"Combo"} items={[
                {
                  id: 1,
                  name: 'Margherita',
                  imageUrl: '/pizza.jpg',
                  items: [{ price: 9.99 }]
                },
                {
                  id: 2,
                  name: 'Pepperoni',
                  imageUrl: '/pizza.jpg',
                  items: [{ price: 12.99 }]
                },
                {
                  id: 3,
                  name: 'BBQ Chicken',
                  imageUrl: '/pizza.jpg',
                  items: [{ price: 14.99 }]
                },
                {
                  id: 4,
                  name: 'Vegetarian',
                  imageUrl: '/pizza.jpg',
                  items: [{ price: 11.99 }]
                },
                {
                  id: 5,
                  name: 'Hawaiian',
                  imageUrl: '/pizza.jpg',
                  items: [{ price: 13.99 }]
                }
              ]} categoryId={2} />

            </div>


          </div>
        </div>
      </Container>
    </>

  );
}
