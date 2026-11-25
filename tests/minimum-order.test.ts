import assert from "node:assert/strict";
import test from "node:test";
import { capturePricing } from "../src/shared/lib/tax";
import { meetsMinimumOrder, minimumOrderGoodsCents } from "../src/shared/lib/minimum-order";

const date = new Date("2026-11-25T12:00:00Z");
const row = (price: number, discountPrice: number | null = null, onTap = false, quantity = 1) => ({
  productId: 1, variationId: null, quantity,
  product: { name: "Fixture", price, discountPrice, productGroup: { onTap } },
});

test("19.99 is rejected even when shipping takes the total above 20; 20.00 and above qualify", () => {
  const low = [row(19.99)];
  assert.ok(capturePricing(low, "DEU", 0, date).totalGrossCents > 2000);
  assert.equal(meetsMinimumOrder(minimumOrderGoodsCents(low)), false);
  assert.equal(meetsMinimumOrder(minimumOrderGoodsCents([row(20)])), true);
  assert.equal(meetsMinimumOrder(minimumOrderGoodsCents([row(20.01)])), true);
});

test("sale, daily offers, coupons and points do not lower the qualifying merchandise value", () => {
  const sale = [row(20, 17)];
  assert.equal(capturePricing(sale, "DEU", 0, date).subtotalGrossCents, 1700);
  assert.equal(minimumOrderGoodsCents(sale), 2000);
  const daily = [{...row(20), product: {...row(20).product, dayOfferStartsAt:"2026-11-25T00:00:00Z", dayOfferEndsAt:"2026-11-26T00:00:00Z"}}];
  assert.equal(capturePricing(daily, "DEU", 0, date).subtotalGrossCents, 1800);
  assert.equal(minimumOrderGoodsCents(daily), 2000);
  const coupon = capturePricing([row(20)], "DEU", 15, date);
  assert.equal(coupon.subtotalGrossCents - coupon.discountGrossCents - 100, 1600);
  assert.equal(minimumOrderGoodsCents([row(20)]), 2000);
});

test("regular item quantities and the decant atomizer are included, free items add nothing", () => {
  assert.equal(minimumOrderGoodsCents([row(3.8, null, true, 5), row(0)]), 2000);
  assert.equal(minimumOrderGoodsCents([row(6.67, null, false, 3)]), 2001);
  assert.equal(meetsMinimumOrder(minimumOrderGoodsCents([])), false);
});
