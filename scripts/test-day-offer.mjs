import assert from "node:assert/strict";
import { dayOfferActive, offerPrices, berlinOfferTime, linePrice } from "../src/shared/lib/day-offer.ts";
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
