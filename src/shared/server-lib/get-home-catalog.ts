import "server-only";
import { prisma } from "@/prisma/prisma-client";
import type { SelectedProductDTO } from "./get-popular-products";

export interface HomeCatalogPage {
  products: SelectedProductDTO[];
  nextCursor: number | null;
}

// A separate read-only feed: existing filters, category URLs and sorting stay unchanged.
export async function getHomeCatalog(cursor?: number): Promise<HomeCatalogPage> {
  const rows = await prisma.product.findMany({
    where: { available: true, ...(cursor ? { id: { lt: cursor } } : {}) },
    orderBy: { id: "desc" },
    take: 25,
    include: {
      productGroup: true,
      brand: true,
      variations: { where: { available: true }, orderBy: [{ order: "asc" }, { id: "asc" }] },
    },
  });
  const page = rows.slice(0, 24);
  return {
    products: page.map(product => ({ ...product, price: product.price.toNumber(), discountPrice: product.discountPrice?.toNumber() ?? null, reviews: [] })),
    nextCursor: rows.length > 24 ? page[page.length - 1].id : null,
  };
}
