import assert from "node:assert/strict";
import { BLACK_FRIDAY, blackFridayBannerVisible, blackFridayActive, isBlackFridayCode } from "../src/shared/lib/black-friday";
import { couponQuote } from "../src/shared/lib/coupon-eligibility";
import { capturePricing, readPricing, reviseOrderPricing } from "../src/shared/lib/tax";
const start=Date.parse(BLACK_FRIDAY.startsAt), end=Date.parse(BLACK_FRIDAY.endsAt);
assert.equal(end-start,86400000);
assert.equal(new Date(start).toISOString(),"2026-11-26T23:00:00.000Z");
for(const [time,active] of [[start-1,false],[start,true],[end-1,true],[end,false],[end+1,false]] as const) assert.equal(blackFridayActive(time),active);
const bannerStart = Date.parse(BLACK_FRIDAY.bannerStartsAt);
assert.equal(new Date(bannerStart).toISOString(), "2026-11-26T17:00:00.000Z");
for (const [time, visible] of [[bannerStart - 1, false], [bannerStart, true], [start - 1, true], [end - 1, true], [end, false]] as const) assert.equal(blackFridayBannerVisible(time), visible);
assert.equal(blackFridayActive(bannerStart), false);
assert.ok(isBlackFridayCode(" black15 "));
const line=(id:number,price:number,sale:number|null=null,onTap=false,quantity=1)=>({productId:id,variationId:null,quantity,product:{name:"Test",price,discountPrice:sale,productGroup:{onTap}}});
const at=new Date(start);
const mixed=[line(1,40),line(2,50,30)];
const p=capturePricing(mixed,"DEU",15,at,undefined,true);
assert.equal(p.subtotalGrossCents,7000);
assert.equal(p.discountGrossCents,600);
assert.equal(p.totalGrossCents,6895);
assert.ok(readPricing(p));
assert.equal(capturePricing([line(1,50,30)],"DEU",15,at,undefined,true).discountGrossCents,0);
const daily={...line(3,20),product:{...line(3,20).product,dayOfferStartsAt:BLACK_FRIDAY.startsAt,dayOfferEndsAt:BLACK_FRIDAY.endsAt}};
const dayMixed=capturePricing([line(1,40),daily],"DEU",15,at,undefined,true);
assert.equal(dayMixed.discountGrossCents,600);
assert.equal(dayMixed.lines[1].grossCents,1800);
assert.equal(capturePricing([line(1,100)],"DEU",15,at,undefined,true).totalGrossCents,8500);
assert.equal(capturePricing([line(1,40)],"FRA",15,at,undefined,true).totalGrossCents,4849);
assert.equal(capturePricing([line(1,4,null,true,5)],"DEU",15,at,undefined,true).discountGrossCents,315);
const revised=reviseOrderPricing(mixed,"DEU",15,at,p);
assert.equal(revised.totalGrossCents,p.totalGrossCents);
assert.ok(readPricing(revised));
const bf = (items: Parameters<typeof capturePricing>[0], country="DEU", giftIds=new Set<number>()) =>
  capturePricing(items,country,15,at,undefined,false,giftIds,BLACK_FRIDAY.code);
for (const [base, pct, expected] of [[19.99,5,100],[20,5,100],[49.99,5,250],[50,10,500],[79.99,10,800],[80,15,1200],[100,15,1500]] as const) {
  const cent = Math.round(base*100);
  assert.equal(bf([line(1,base)]).discountGrossCents,expected);
  for(const supplied of [0,5,10,15,100]) {
    const quote=couponQuote([{productId:1,grossCents:cent,excluded:false}],supplied,"BLACK15",start);
    assert.equal(quote.percentage,pct);
    assert.equal(quote.discountCents,expected);
  }
}
assert.equal(bf([line(1,49.99)],"FRA").discountGrossCents,250);
assert.equal(bf([line(1,50),line(2,40,20)]).discountGrossCents,500);
assert.equal(bf([line(1,70),line(2,40,20)]).discountGrossCents,700);
assert.equal(bf([line(1,80),line(2,40,20)]).discountGrossCents,1200);
assert.equal(bf([line(1,70),daily]).discountGrossCents,700);
assert.equal(bf([line(1,80),daily]).discountGrossCents,1200);
assert.equal(bf([line(1,70),line(2,20)],"DEU",new Set([2])).discountGrossCents,700);
assert.equal(bf([line(1,80),line(2,20)],"DEU",new Set([2])).discountGrossCents,1200);
assert.equal(bf([line(1,90,80),daily]).discountGrossCents,0);
assert.equal(bf([line(1,70),line(2,10)]).discountGrossCents,1200);
const fixed=[{productId:1,grossCents:7000,excluded:false}];
assert.equal(couponQuote(fixed,15,"BLACK15",start-1).discountCents,0);
assert.equal(couponQuote(fixed,15,"BLACK15",end).discountCents,0);
assert.equal(couponQuote(fixed,15,"BRANCH15",start).discountCents,1050);
assert.equal(couponQuote(fixed,10,"WELCOME10",start).discountCents,700);
console.log("BLACK15: Berlin window, 5/10/15 boundaries, caller-supplied percentage ignored, excluded lines, shipping and saved pricing passed.");
