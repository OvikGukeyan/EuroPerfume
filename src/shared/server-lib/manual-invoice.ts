import "server-only";
import { createHash } from "node:crypto";
import { Prisma } from "@prisma/client";
import prisma from "@/prisma/prisma-client";
import { requireInvoiceAdmin } from "./invoice-corrections";
import { issueOrderInvoice } from "./create-protected-invoice";
import { MANUAL_ORDER_PREFIX, manualInvoiceInput, prepareManualPricing, type ManualInvoiceCatalogItem } from "../lib/manual-invoice";

const catalogFields = {
  id: true, name: true, volume: true, price: true,
  brand: { select: { name: true } },
  productGroup: { select: { onTap: true } },
  variations: { select: { id: true, name: true }, orderBy: { order: "asc" } },
} satisfies Prisma.ProductSelect;
type CatalogRow = Prisma.ProductGetPayload<{ select: typeof catalogFields }>;
function toCatalogItem(p: CatalogRow): ManualInvoiceCatalogItem {
  const onTap = Boolean(p.productGroup.onTap);
  return {
    id: p.id, onTap, price: Number(p.price), variations: p.variations,
    title: [p.brand.name, p.name, !onTap && p.volume ? p.volume : ""].filter(Boolean).join(" · "),
  };
}

export async function lookupManualInvoiceProducts(rawQuery: string) {
  await requireInvoiceAdmin();
  const query = typeof rawQuery === "string" ? rawQuery.trim().slice(0, 100) : "";
  if (!query || (query.length < 2 && !/^\d$/.test(query))) return [];
  const rows = await prisma.product.findMany({
    where: {
      OR: [
        ...( /^\d+$/.test(query) && Number(query) <= 2_147_483_647 ? [{ id: Number(query) }] : []),
        ...[
          {
            AND: query.split(/\s+/).slice(0, 6).map(term => ({
              OR: [
                { name: { contains: term, mode: "insensitive" as const } },
                { brand: { name: { contains: term, mode: "insensitive" as const } } },
                { volume: { contains: term, mode: "insensitive" as const } },
              ],
            })),
          },
        ],
      ],
    },
    select: {
      ...catalogFields, imageUrl: true,
      variations: { ...catalogFields.variations, select: { ...catalogFields.variations.select, imageUrl: true } },
    },
    take: 25, orderBy: [{ name: "asc" }, { id: "asc" }],
  });
  return rows.map(row => {
    const imageUrl = [...row.imageUrl, ...row.variations.map(variation => variation.imageUrl)]
      .find(src => src.startsWith("https://") || (src.startsWith("/") && !src.startsWith("//"))) ?? null;
    const { id, onTap, price, title, variations } = toCatalogItem(row);
    return { id, onTap, price, title, variations: variations.map(({ id, name }) => ({ id, name })), imageUrl };
  });
}

export async function issueManualInvoice(raw: unknown) {
  const adminId = await requireInvoiceAdmin();
  const input = manualInvoiceInput.parse(raw);
  const key = MANUAL_ORDER_PREFIX + adminId + ":" + input.requestId + ":";
  const digest = createHash("sha256").update(JSON.stringify(input)).digest("hex");
  const token = key + digest;
  return prisma.$transaction(async tx => {
    // Serialize retries of this command; a rollback releases the lock without issuing a number.
    await tx.$queryRaw`SELECT 1 AS locked FROM pg_advisory_xact_lock(hashtextextended(${key}, 0))`;
    const prior = await tx.order.findFirst({
      where: { token: { startsWith: key } },
      select: { id: true, token: true, invoice: { select: { invoiceNumber: true } } },
    });
    if (prior) {
      if (prior.token !== token || !prior.invoice) throw new Error("REQUEST_ALREADY_EXISTS");
      return { invoiceNumber: prior.invoice.invoiceNumber, invoiceUrl: "/api/invoices/" + prior.id };
    }
    const catalog = await tx.product.findMany({ where: { id: { in: input.rows.map(row => row.productId) } }, select: catalogFields });
    const { orderDate, pricing } = prepareManualPricing(input, catalog.map(toCatalogItem), new Date());
    const c = input.customer;
    const order = await tx.order.create({
      data: {
        token,
        status: "PENDING",
        createdAt: orderDate,
        totalAmount: new Prisma.Decimal(pricing.totalGrossCents).div(100),
        pricingSnapshot: pricing,
        fullName: c.name, address: c.street, houseNumber: c.house, zip: c.zip, city: c.city, country: c.country,
        deliveryFullNmae: c.name, deliveryAddress: c.street, deliveryHouseNumber: c.house,
        deliveryZip: c.zip, deliveryCity: c.city, deliveryCountry: c.country,
        shippingMethod: "BILLING_ADDRESS", contactForm: "WA",
        email: c.email, phone: "",
        items: { create: pricing.lines.map(line => ({
          productId: line.productId, variationId: line.variationId, name: line.title, quantity: line.quantity,
        })) },
      },
      select: { id: true },
    });
    const result = await issueOrderInvoice(tx, order.id, input.supplyDate);
    if (!result.ok) throw new Error("INVALID_TOTAL");
    return { invoiceNumber: result.invoiceNumber, invoiceUrl: result.invoiceUrl };
  }, { timeout: 20000 });
}
