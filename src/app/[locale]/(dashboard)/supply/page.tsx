"use client";

import { SearchInput } from "@/src/shared/components";
import { useState } from "react";

export default function Supply() {
  const [supplyItems, setSupplyItems] = useState<number[]>([]);

  return (
    <div>
      <SearchInput
        onProductClick={(id: number) => {
          setSupplyItems((prev) => [...prev, id]);
        }}
      />

      <h1>Supply</h1>
      <p>{JSON.stringify(supplyItems, null, 2)}</p>
    </div>
  );
}
