
import { CreateProductForm, Title } from "@/shared/components/shared";

export default function Create() {
  

  return (
    <div className=" px-10 mb-10">
      <Title className="mb-5" text="Create new Product" />

      <CreateProductForm  />
    </div>
  );
}
