import "server-only";
import { prisma } from "@/prisma/prisma-client";
import { calcCartItemTotalPrice } from "@/src/shared/lib/calc-cart-item-total-price";

export async function discoveryCatalog(ids?: number[]) {
  const rows = await prisma.product.findMany({
    where: { available: true, productGroup: { onTap: true }, ...(ids ? { id: { in: ids } } : {}) },
    include: { brand: true, productNotes: { include: { note: true } }, aromas: true },
    orderBy: { id: "asc" },
  });
  return rows.filter(p => Number(p.discountPrice || p.price) > 0).map(p => ({
    id: p.id, name: p.name.trim(), brand: p.brand.name, gender: p.gender,
    image: p.imageUrl[0] || null,
    price: calcCartItemTotalPrice(Number(p.price), 2, true, Number(p.discountPrice) || undefined),
    notes: [...new Set(p.productNotes.map(n => n.note.labelRu).filter(Boolean))],
    notePyramid: p.productNotes.map(n => ({ label: n.note.labelRu, type: n.noteType })),
    families: p.aromas.map(a => a.labelRu), concentration: p.concentration, available: true,
  }));
}
export function validDiscoveryIds(value: unknown): value is number[] {
  return Array.isArray(value) && value.length === 8 && new Set(value).size === 8 && value.every(id => Number.isSafeInteger(id) && id > 0);
}
