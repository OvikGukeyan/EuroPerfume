import assert from "node:assert/strict";
import { test } from "node:test";
import { planPilot, type CatalogIdentity } from "../src/shared/lib/supplier-pilot-plan";
const candidate = { supplier: "Nunu Trading", sku: "SYNTHETIC", brand: "Example", fragrance: "Example scent", segment: "niche", brandReviewed: true, volumeMl: 100, concentration: "EAU_DE_PARFUM", cost: "100", eans: ["4006381333931"], parentId: 1 };
const catalog: CatalogIdentity[] = [{ id: 1, brand: "Example", fragrance: " Example scent ", concentration: "EAU_DE_PARFUM", onTap: true, bottleParentId: null, volumeMl: null }];
test("attach proposal preserves parent and never converts supplier stock into owned stock", () => {
  const before = structuredClone(catalog);
  const plan = planPilot([{ ...candidate, ownStockPieces: 900, publish: true }], catalog);
  assert.deepEqual(catalog, before);
  assert.equal(plan.publish, false); assert.equal(plan.modifiesExistingProducts, false);
  assert.equal(plan.tax2026.chargedVat, null);
  const p = plan.proposals[0];
  assert.equal(p.action, "attach_full_bottle"); assert.equal(p.ownStockPieces, 0);
  assert.equal(p.recommendedGross2027, "162.44"); assert.equal(p.paymentBeforeConfirmation, false);
  assert.equal(p.deliveryText.ru, "Срок подтверждается после заявки");
});
test("existing bottle cannot be duplicated or repriced by the plan", () => {
  const plan = planPilot([candidate], [...catalog, { ...catalog[0], id: 2, onTap: false, bottleParentId: 1, volumeMl: 100 }]);
  assert.equal(plan.proposals[0].action, "review_existing");
  assert.ok(plan.proposals[0].blockers.includes("existing_bottle_preserve_price_and_stock"));
});
test("concentration, brand and wrong parent mismatches fail closed", () => {
  for (const change of [{ concentration: "EXTRAIT" }, { brand: "Other" }, { parentId: 99 }]) assert.throws(() => planPilot([{ ...candidate, ...change }], catalog));
});
test("standalone requires no matching catalog identity, including hidden decants", () => {
  assert.equal(planPilot([{ ...candidate, parentId: null }], []).proposals[0].action, "standalone_full_bottle");
  assert.equal(planPilot([{ ...candidate, parentId: null }], catalog).proposals[0].action, "review_existing");
});
test("duplicate offers, equivalent variants and unreviewed brands rejected", () => {
  assert.throws(() => planPilot([candidate, candidate], catalog));
  assert.throws(() => planPilot([candidate, { ...candidate, supplier: "perfumes-wholesale.eu", sku: "OTHER" }], catalog));
  assert.throws(() => planPilot([{ ...candidate, brandReviewed: false }], catalog));
  assert.throws(() => planPilot([{ ...candidate, eans: ["4006381333932"] }], catalog));
});
