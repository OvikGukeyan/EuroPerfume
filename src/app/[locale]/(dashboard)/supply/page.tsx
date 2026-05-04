"use client";

import { SearchInput } from "@/src/shared/components";
import { ProductDTO } from "@/src/shared/services/dto/product.dto";
import { StockMovementType, StockUnit } from "@prisma/client";
import { useState } from "react";

export interface CreateSupplyItemInput {
  productId: number;
  variationId?: number;

  quantity: number;
  unit: StockUnit;

  costPrice?: number;
  reason?: string;
}
export interface CreateSupplyInput {
  supplier?: string;
  reference?: string; // invoice / Lieferschein
  comment?: string;
  receivedAt?: Date;

  items: CreateSupplyItemInput[];
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
