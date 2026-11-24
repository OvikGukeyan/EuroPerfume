import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { recommendedPrice, validGtin, parseReview, exportReview, reviewEnabled, MAX_IMPORT_BYTES } from "../src/shared/lib/supplier-import";
const row = { supplier: "Nunu Trading", sku: "TEST-1", name: "Synthetic test perfume", brand: "Test", cost: "100.00", eans: ["4006381333931"], supplierStock: "> 300", volume: "100", price2027: "162.44" };
test("exact price, half-up and no intermediate rounding", () => {
  assert.equal(recommendedPrice("100"), "162.44");
  assert.equal(recommendedPrice("114.50"), "184.87");
  assert.equal(recommendedPrice("1.01"), "9.30");
  for (const bad of ["-1", "0", "NaN", "Infinity", "1e3", "100,00", "1.00001"]) assert.throws(() => recommendedPrice(bad));
});
test("GTIN validates checksum and preserves leading zeros", () => {
  assert.equal(validGtin("036000291452"), true); assert.equal(validGtin("00036000291452"), true);
  assert.equal(validGtin("4006381333932"), false); assert.equal(validGtin("4.006381333931E12"), false);
});
test("same SKU across suppliers is separate, duplicate within supplier rejected", () => {
  assert.throws(() => parseReview(JSON.stringify([row, row])));
  assert.equal(parseReview(JSON.stringify([row, { ...row, supplier: "perfumes-wholesale.eu" }])).offers.length, 2);
});
test("untrusted published flags cannot bypass draft blockers", () => {
  const { offers, decisions } = parseReview(JSON.stringify([{ ...row, publish: true, blockers: [], ownStockPieces: 999, status: "READY" }]));
  assert.ok(offers[0].blockers.includes("image_rights"));
  const exported = JSON.parse(exportReview(offers, decisions));
  assert.equal(exported.publish, false); assert.equal(exported.status, "DRAFT"); assert.equal(exported.ownStockPieces, 0);
  assert.equal(exported.tax2026.chargedVat, null); assert.equal(exported.offers[0].publish, undefined);
});
test("unknown stock, wrong imported price and missing EAN stay flagged", () => {
  const { offers } = parseReview(JSON.stringify([{ ...row, supplierStock: null, eans: [], price2027: "1.00" }]));
  for (const flag of ["stock_quantity", "stock_date", "price_mismatch", "gtin"]) assert.ok(offers[0].blockers.includes(flag));
  assert.equal(offers[0].calculatedPrice, "162.44"); assert.equal(offers[0].supplierStock, null);
});
test("review roundtrip keeps lower bounds, decisions and notes without publication", () => {
  const parsed = parseReview(JSON.stringify([row]));
  parsed.decisions[parsed.offers[0].key] = { disposition: "pilot", note: "Check package" };
  const back = parseReview(exportReview(parsed.offers, parsed.decisions));
  assert.deepEqual(back, parsed); assert.equal(back.offers[0].supplierStock, "> 300");
});
test("malformed and oversized files fail closed", () => {
  for (const value of ["null", "{}", "[]", "not json", JSON.stringify([{ ...row, cost: 100 }]), JSON.stringify([{ ...row, candidateProductIds: [-1] }])]) assert.throws(() => parseReview(value));
  assert.throws(() => parseReview(" ".repeat(MAX_IMPORT_BYTES + 1)));
});
test("production always disabled, preview needs explicit opt-in", () => {
  assert.equal(reviewEnabled({ VERCEL_ENV: "production", SUPPLIER_IMPORT_REVIEW_ENABLED: "true" }), false);
  assert.equal(reviewEnabled({ VERCEL_ENV: "preview" }), false);
  assert.equal(reviewEnabled({ VERCEL_ENV: "preview", SUPPLIER_IMPORT_REVIEW_ENABLED: "true" }), true);
});
test("route has explicit authorization and sitemap exclusion", () => {
  const page = readFileSync("src/app/[locale]/(dashboard)/supplier-import/page.tsx", "utf8");
  assert.match(page, /session\.role !== "ADMIN"/); assert.match(page, /notFound\(\)/);
  assert.match(readFileSync("next-sitemap.config.cjs", "utf8"), /\/supplier-import/);
});
test("private supplied batch validates and recomputes every price when provided", { skip: !process.env.SUPPLIER_TEST_FILE }, () => {
  const batch = parseReview(readFileSync(process.env.SUPPLIER_TEST_FILE!, "utf8"));
  assert.ok(batch.offers.length > 0);
  assert.equal(batch.offers.filter(o => o.blockers.includes("price_mismatch")).length, 0);
  assert.deepEqual(parseReview(exportReview(batch.offers, batch.decisions)), batch);
});
