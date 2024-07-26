import { Categories, Container, SortPopup, Title, TopBar, Filters } from "@/components/shared";
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
              {/* <ProductsGroupList />
              <ProductsGroupList /> */}
              List
            </div>


          </div>
        </div>
      </Container>
    </>

  );
}
