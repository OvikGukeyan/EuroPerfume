import assert from "node:assert/strict";
import test from "node:test";
import { capturePricing, invoiceTax, readPricing, reviseOrderPricing } from "../src/shared/lib/tax";
import { meetsMinimumOrder, minimumOrderGoodsCents } from "../src/shared/lib/minimum-order";

const before = new Date("2026-12-31T22:59:59.999Z");
const after = new Date("2026-12-31T23:00:00.000Z");
const decSupply = new Date("2026-12-31T12:00:00Z");
const janSupply = new Date("2027-01-01T12:00:00Z");
const product = (price: number, options: {
  id?: number; qty?: number; decant?: boolean; sale?: number; day?: boolean
} = {}) => ({
  productId: options.id ?? 1,
  variationId: null,
  quantity: options.qty ?? 1,
  product: {
    name: "Fixture",
    price,
    discountPrice: options.sale ?? null,
    productGroup: { onTap: options.decant ?? false },
    ...(options.day ? { dayOfferStartsAt: before, dayOfferEndsAt: janSupply } : {}),
  },
});

test("merchandise increases at midnight Berlin; German delivery rates and threshold stay the same", () => {
  for (const [at, gross, shipping] of [[before, 2500, 495], [after, 2975, 495]] as const) {
    const priced = capturePricing([product(25)], "DEU", 0, at);
    assert.equal(priced.subtotalGrossCents, gross);
    assert.equal(priced.shippingGrossCents, shipping);
    assert.equal(priced.totalGrossCents, gross + shipping);
    assert.deepEqual(readPricing(priced), priced);
  }
  assert.equal(capturePricing([product(84.03)], "DEU", 0, after).shippingGrossCents, 0);
  assert.equal(capturePricing([product(84.02)], "DEU", 0, after).shippingGrossCents, 495);
});

test("same minimum and eligible coupon percentage apply to January merchandise gross", () => {
  assert.equal(meetsMinimumOrder(minimumOrderGoodsCents([product(16.8)], after.getTime())), false);
  assert.equal(meetsMinimumOrder(minimumOrderGoodsCents([product(16.81)], after.getTime())), true);
  const priced = capturePricing([product(50), product(40, { id: 2, sale: 30 })], "DEU", 10, after);
  assert.deepEqual(priced.lines.map(l => [l.grossCents, l.couponExcluded]), [[5950, false], [3570, true]]);
  assert.equal(priced.discountGrossCents, 595);
  assert.equal(priced.shippingGrossCents, 495);
  assert.equal(priced.totalGrossCents, 9420);
});

test("January invoicing only splits saved gross, including old quotes, without adding a second 19%", () => {
  const dec = capturePricing([product(100)], "DEU", 0, before);
  const jan = capturePricing([product(100)], "DEU", 0, after);
  assert.deepEqual([invoiceTax(dec, decSupply).grossCents, invoiceTax(dec, decSupply).vatCents], [10000, 0]);
  assert.deepEqual([invoiceTax(dec, janSupply).grossCents, invoiceTax(dec, janSupply).vatCents], [10000, 1597]);
  assert.deepEqual([invoiceTax(jan, janSupply).grossCents, invoiceTax(jan, janSupply).vatCents], [11900, 1900]);
});

test("existing enquiry edits preserve the quote's era and decant-volume packaging", () => {
  for (const at of [before, after]) {
    for (const day of [false, true]) {
      const priced = capturePricing([product(2.39, { decant: true, qty: 9, day })], "DEU", 0, at);
      const edited = reviseOrderPricing([product(10, { decant: true, qty: 11 })], "DEU", 0, janSupply, priced);
      const expected = capturePricing([product(2.39, { decant: true, qty: 11, day })], "DEU", 0, at);
      assert.equal(edited.lines[0].grossCents, expected.lines[0].grossCents);
      assert.equal(edited.capturedAt, priced.capturedAt);
      assert.deepEqual(readPricing(edited), edited);
    }
  }
});
