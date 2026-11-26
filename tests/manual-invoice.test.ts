import assert from "node:assert/strict";
import { test } from "node:test";
import { euroInputToCents, manualInvoiceInput, prepareManualPricing } from "../src/shared/lib/manual-invoice";

const catalog = [
  { id: 1, title: "Fixture · Full bottle · 100 ml", onTap: false, price: 50, variations: [{ id: 7, name: "100 ml sealed" }] },
  { id: 2, title: "Fixture · Decant", onTap: true, price: 5, variations: [] },
];
const beforeVat = new Date("2026-11-26T22:00:00Z");
const data = {
  requestId: "a2ed27f0-69a7-4d08-aa60-a9db1cf17aff",
  customer: { name: "Test Fixture", street: "Teststraße", house: "1", zip: "12345", city: "Berlin", country: "DEU", email: "" },
  orderDate: "2026-11-25", supplyDate: "2026-11-26", shippingCents: 495,
  rows: [{ productId: 1, variationId: 7, quantity: 1, grossCents: 5000 }, { productId: 2, variationId: null, quantity: 5, grossCents: 2000 }],
};

test("manual lines use the sold amount and include a precise variant, ml and delivery", () => {
  const input = manualInvoiceInput.parse(data);
  const { pricing, tax } = prepareManualPricing(input, catalog, beforeVat);
  assert.equal(pricing.lines[0].title, "Fixture · Full bottle · 100 ml · 100 ml sealed");
  assert.equal(pricing.lines[1].onTap, true);
  assert.equal(pricing.lines[1].quantity, 5);
  assert.equal(pricing.totalGrossCents, 7495);
  assert.equal(tax.vatCents, 0);
  const later = prepareManualPricing({ ...input, supplyDate: "2027-01-02" }, catalog, new Date("2027-01-03T10:00:00Z"));
  assert.equal(later.tax.rateBasisPoints, 1900);
  assert.equal(later.tax.netCents + later.tax.vatCents, 7495);
});

test("invalid dates, variants and malformed amounts fail before issuance", () => {
  const input = manualInvoiceInput.parse(data);
  assert.throws(() => prepareManualPricing({ ...input, orderDate: "2026-02-30" }, catalog, beforeVat), /ORDER_DATE/);
  assert.throws(() => prepareManualPricing({ ...input, supplyDate: "2026-11-24" }, catalog, beforeVat), /Дата поставки/);
  assert.throws(() => prepareManualPricing({ ...input, rows: [{ ...input.rows[0], variationId: 123 }] }, catalog, beforeVat), /PRODUCT_VARIATION/);
  assert.throws(() => prepareManualPricing({ ...input, rows: [{ ...input.rows[0], variationId: null }] }, catalog, beforeVat), /PRODUCT_VARIATION/);
  assert.equal(manualInvoiceInput.safeParse({ ...data, shippingCents: -1 }).success, false);
  assert.equal(manualInvoiceInput.safeParse({ ...data, customer: { ...data.customer, name: "A\nB" } }).success, false);
  assert.equal(euroInputToCents("15,20"), 1520);
  assert.equal(euroInputToCents("0.09"), 9);
  assert.equal(euroInputToCents("15.209"), NaN);
});
