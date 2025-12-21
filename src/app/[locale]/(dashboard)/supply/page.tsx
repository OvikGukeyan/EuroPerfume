"use client";

import { SearchInput } from "@/src/shared/components";
import { ProductDTO } from "@/src/shared/services/dto/product.dto";
import { StockMovementType } from "@prisma/client";
import { useState } from "react";


type SupplyItem = {
  productId: number;
  quantity: number;
  unit: string;
  unitPrice: number;
  variationId: number;
  type: StockMovementType;
}
export interface CreateSupplyInput {
  reference: string;
  supplier: string;
  comment: string;
  receivedAt: Date;
  supplyItems: SupplyItem[];
}
export default function Supply() {
  const [supplyItems, setSupplyItems] = useState<ProductDTO[]>([]);

  return (
    <div>
      <SearchInput
        onProductClick={(product: ProductDTO) => {
          setSupplyItems((prev) => [...prev, product]);
        }}
      />

      <h1>Supply</h1>
      {
        <div>
          {supplyItems.map((item) => (
            <div key={item.id}>{item.name}</div>
          ))}
        </div>
      }
    </div>
  );
}
