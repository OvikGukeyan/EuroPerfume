import { fullBottleInclude, withBottleOptions } from "../lib/full-bottle";
import "server-only";
import type { Prisma } from "@prisma/client";
import { offerPrices } from "../lib/day-offer";
import { prisma } from "@/prisma/prisma-client";
import type { SelectedProductDTO } from "./get-popular-products";

export interface HomeCatalogPage {
  products: (SelectedProductDTO & { saleBottleOnly?: boolean })[];
  nextCursor: number | null;
}

// A separate read-only feed: existing filters, category URLs and sorting stay unchanged.
export async function getHomeCatalog(cursor?: number, options: { sale?: boolean } = {}): Promise<HomeCatalogPage> {
  const now = new Date();
  const salePrice: Prisma.ProductWhereInput = { OR: [
    { discountPrice: { gt: 0, lt: prisma.product.fields.price } },
    { dayOfferStartsAt: { lte: now }, dayOfferEndsAt: { gt: now } },
  ] };
  const eligible: Prisma.ProductWhereInput = options.sale ? { OR: [
    { AND: [{ available: true }, salePrice] },
    { fullBottles: { some: { available: true, stockPieces: { gt: 0 }, AND: [salePrice] } } },
  ] } : { OR: [{ available: true }, { fullBottles: { some: { available: true, stockPieces: { gt: 0 } } } }] };
  const rows = await prisma.product.findMany({
    where: { bottleParentId: null, AND: [eligible], ...(cursor ? { id: { lt: cursor } } : {}) },
    orderBy: { id: "desc" },
    take: 25,
    include: {
      productGroup: true,
            fullBottles: fullBottleInclude,
      brand: true,
      variations: { where: { available: true }, orderBy: [{ order: "asc" }, { id: "asc" }] },
    },
  });
  const page = rows.slice(0, 24);
  return {
    products: page.map(product => {
      const publicProduct = withBottleOptions(product);
      const ownSale = product.available && offerPrices(product, 2, Boolean(product.productGroup.onTap), now.getTime()).discounted;
      return { ...publicProduct,
        ...(options.sale ? { saleBottleOnly: !ownSale, bottles: publicProduct.bottles.filter(bottle => bottle.available && offerPrices({ ...bottle, price: bottle.regularPrice ?? bottle.price }, 1, false, now.getTime()).discounted) } : {}),
        price: product.price.toNumber(), discountPrice: product.discountPrice?.toNumber() ?? null, reviews: [] };
    }),
    nextCursor: rows.length > 24 ? page[page.length - 1].id : null,
  };
}
