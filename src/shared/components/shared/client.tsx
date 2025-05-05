import React, { FC } from 'react';
import { cn } from '../../lib/utils';
import { Container, FiltersDrawer, PaginationComponent, ProductsGroupList, Title, TopBar } from '.';

type Props = {
  className?: string;
};

export const Client: FC<Props> = ({ className }) => {
  return (
    <div className={cn('', className)}>
              {/* <Carusel slides={slides} /> */}
              <TopBar />
        
              <Container className="mt-10">
                <Title size="lg" className="font-extrabold" text="All products" />
              </Container>
              <Container className="mt-10 pb-14">
                <div className="flex flex-col xl:flex-row gap-[50px]">
                  <FiltersDrawer />
        
                  <div className="flex-1">
                    <div className="flex flex-col gap-16">
                      {/* <Suspense fallback={<div>Loading...</div>}> */}
                        <ProductsGroupList />
                      {/* </Suspense> */}
                    </div>
                  </div>
                </div>
                <PaginationComponent className="mt-10" />
              </Container>
    </div>
  );
};