import {
  Container,
  PaginationComponent,
  ProductsGroupList,
  TopBar,
} from "@/src/shared/components";
import { Suspense } from "react";

export default function Items() {
  return (
    <div className="bg-white">
      <TopBar />
      <Container className="pt-4 pb-14 md:pt-8">
        <Suspense fallback={null}>
          <ProductsGroupList />
        </Suspense>
        <PaginationComponent className="mt-10" />
      </Container>
    </div>
  );
}
