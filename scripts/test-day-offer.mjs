import assert from "node:assert/strict";
import { dayOfferActive, offerPrices, berlinOfferTime, linePrice, catalogGrossPrice, hasPreVatPriceHistory } from "../src/shared/lib/day-offer.ts";
const start=Date.parse("2026-11-16T09:00:00Z"),end=start+86400000;
const offer={dayOfferStartsAt:new Date(start),dayOfferEndsAt:new Date(end)};
assert.equal(dayOfferActive(offer,start-1),false);
assert.equal(dayOfferActive(offer,start),true);
assert.equal(dayOfferActive(offer,end-1),true);
assert.equal(dayOfferActive(offer,end),false);
assert.equal(dayOfferActive({dayOfferStartsAt:"invalid",dayOfferEndsAt:new Date(end)},start),false);
const p={price:4,discountPrice:null,...offer};
for(const [ml,expected] of [[1,4.50],[2,8.10],[3,11.70],[5,18.90],[10,36.90],[20,73.80],[30,110.70]]) {
  assert.equal(offerPrices(p,ml,true,start).effective,expected,ml+" ml");
  assert.equal(offerPrices(p,ml,true,end).effective,linePrice(4,ml,true));
}
assert.equal(offerPrices({price:350,...offer},1,false,start).effective,315);
assert.equal(offerPrices({price:4,discountPrice:3,...offer},5,true,start).effective,16); // better existing sale wins; no stacking
assert.equal(offerPrices({price:4,discountPrice:3,...offer},5,true,start).dayOffer,false);
assert.equal(offerPrices({price:4,...offer},5,true,end).regular,21);
assert.equal(berlinOfferTime("2026-11-17T00:00").toISOString(),"2026-11-16T23:00:00.000Z");
assert.equal(berlinOfferTime("2027-07-17T00:00").toISOString(),"2027-07-16T22:00:00.000Z");
assert.throws(()=>berlinOfferTime("2027-03-28T02:30"));
assert.throws(()=>berlinOfferTime("2027-10-31T02:30"));
assert.throws(()=>berlinOfferTime("2026-02-31T12:00"));
assert.throws(()=>linePrice(4,0,true));
console.log("Day-offer tests passed: start/end, exact 10%, all volumes, bottle, no stacking, Berlin timezone and DST.");

const vatCutover=Date.parse("2026-12-31T23:00:00Z");
assert.equal(catalogGrossPrice(100,vatCutover-1),100);
assert.equal(catalogGrossPrice(100,vatCutover),119);
assert.deepEqual(offerPrices({price:100},1,false,vatCutover),{regular:119,effective:119,discounted:false,dayOffer:false});
assert.deepEqual(offerPrices({price:100,discountPrice:80},1,false,vatCutover),{regular:119,effective:95.2,discounted:true,dayOffer:false});
assert.equal(offerPrices({price:3.9},2,true,vatCutover).effective,10.47); // €8.80 inc. atomizer before cutoff
assert.equal(offerPrices({price:3.9},5,true,vatCutover).effective,24.4); // €20.50 inc. atomizer before cutoff
assert.equal(offerPrices({price:100},1,false,vatCutover,false).effective,100); // legacy snapshot fallback
const acrossVat={price:100,dayOfferStartsAt:new Date(vatCutover-1000),dayOfferEndsAt:new Date(vatCutover+1000)};
assert.equal(offerPrices(acrossVat,1,false,vatCutover-1).effective,90);
assert.equal(offerPrices(acrossVat,1,false,vatCutover).effective,107.1);
assert.equal(hasPreVatPriceHistory(vatCutover-1),false);
assert.equal(hasPreVatPriceHistory(vatCutover),true);
assert.equal(hasPreVatPriceHistory(vatCutover+30*86400000),false);
console.log("Catalog VAT cutover tests passed: exact Berlin boundary, original bottles, decants, sale, day offer and historical opt-out.");
