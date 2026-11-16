import assert from "node:assert/strict";
import { capturePricing, readPricing, reviseOrderPricing, invoiceTax } from "../src/shared/lib/tax";
const start = new Date("2026-11-16T09:00:00Z"), end = new Date("2026-11-17T09:00:00Z");
const product = {name:"Test perfume",price:4,discountPrice:null,brand:{name:"Test"},productGroup:{onTap:true},dayOfferStartsAt:start,dayOfferEndsAt:end};
const item = {productId:1,variationId:null,quantity:5,product};
const pricing = capturePricing([item],"DEU",0,start);
assert.equal(pricing.lines[0].grossCents,1890);
assert.equal(pricing.lines[0].regularGrossCents,2100);
assert.equal(pricing.lines[0].dayOfferPercent,10);
const saved=readPricing(JSON.parse(JSON.stringify(pricing)))!;
assert.ok(saved);
const after=invoiceTax(saved,new Date("2026-11-18T12:00:00Z"));
assert.equal(after.grossCents,saved.totalGrossCents);
assert.equal(saved.lines[0].grossCents,1890); // invoice uses accepted price after expiry
const changed={...item,product:{...product,price:99,dayOfferStartsAt:null,dayOfferEndsAt:null}};
assert.equal(reviseOrderPricing([changed],"DEU",0,start,saved).lines[0].grossCents,1890);
const revised=reviseOrderPricing([{...changed,quantity:10}],"DEU",0,start,saved);
assert.equal(revised.lines[0].grossCents,3690); // original unit price and discount survive an admin edit
assert.equal(revised.lines[0].regularGrossCents,4100);
assert.ok(readPricing(revised));
const expired=capturePricing([item],"DEU",0,end);
assert.equal(expired.lines[0].grossCents,2100);
assert.equal(expired.lines[0].dayOfferPercent,undefined);
console.log("Day-offer enquiry snapshot tests passed: accepted prices, invoice after expiry, admin quantity changes.");
