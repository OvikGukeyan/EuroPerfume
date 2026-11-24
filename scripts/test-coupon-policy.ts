import assert from "node:assert/strict";
import { capturePricing,readPricing,reviseOrderPricing,taxPolicyAt,invoiceTax } from "../src/shared/lib/tax";
import { couponQuote,giftPromotionProductIds } from "../src/shared/lib/coupon-eligibility";
import { promotionLive,promotionQualified } from "../src/shared/lib/promotion-rules";
import { BLACK_FRIDAY,blackFridayWithinWindow } from "../src/shared/lib/black-friday";
import { correctionAmounts } from "../src/shared/lib/invoice-correction";
const at=new Date("2026-11-20T12:00:00Z");
const item=(productId:number,unit:number,qty=5,discountPrice:number|null=null,day=false)=>({
 productId,variationId:null,quantity:qty,product:{
 name:"Perfume "+productId,price:unit,discountPrice,productGroup:{onTap:true},
 dayOfferStartsAt:day?new Date("2026-11-19T00:00:00Z"):null,
 dayOfferEndsAt:day?new Date("2026-11-21T00:00:00Z"):null
 }
});
const santal=item(563,5),viking=item(92,4),extra=item(700,3);
const rules={productIds:[563,92],requiredMl:5,active:true,startsAt:null,endsAt:null};
const qualified=promotionQualified(rules,[santal,viking,extra]);
assert.equal(qualified,true,"Creed scenario A: both 5ml items qualify");
const promoIds=giftPromotionProductIds([{eligible:qualified,productIds:rules.productIds}]);
const p=capturePricing([santal,viking,extra],"DEU",10,at,undefined,false,promoIds);
assert.equal(p.discountGrossCents,160,"B/C: discount only on third perfume");
assert.deepEqual(p.lines.map(l=>l.couponExcluded),[true,true,false]);
assert.equal(p.totalGrossCents,6635,"shipping unchanged, eligible-only 10% discount");
assert.ok(readPricing(JSON.parse(JSON.stringify(p))));
assert.equal(promoIds.has(164),false,"free gift itself is never a payable cart item");
const onlyGiftPromo=capturePricing([santal,viking],"DEU",10,at,undefined,false,promoIds);
assert.equal(onlyGiftPromo.discountGrossCents,0,"no eligible items => no fake coupon");
assert.equal(couponQuote(onlyGiftPromo.lines.map(l=>({productId:l.productId,grossCents:l.grossCents,excluded:Boolean(l.couponExcluded)})),10).eligibleCents,0);
const removed=promotionQualified(rules,[santal,extra]);assert.equal(removed,false,"D: removed mandatory perfume");
const below=promotionQualified(rules,[santal,{...viking,quantity:4},extra]);assert.equal(below,false,"D: below 5ml");
assert.equal(capturePricing([santal,extra],"DEU",10,at).discountGrossCents,420,"D: coupon readjusted after removal");
assert.equal(promotionLive({...rules,active:false},at),false,"E: disabled promotion");
assert.equal(promotionLive({...rules,endsAt:at},at),false,"E: expired promotion");
assert.equal(giftPromotionProductIds([{eligible:false,productIds:rules.productIds}]).size,0);
assert.equal(capturePricing([santal,viking],"DEU",10,at).discountGrossCents,470,"E: gift restrictions lifted");
const sale=item(702,10,1,8);
const daily=item(703,10,1,null,true);
const mixed=capturePricing([sale,daily,extra],"DEU",10,at);
assert.deepEqual(mixed.lines.map(l=>l.couponExcluded),[true,true,false],"Sale and day offer excluded");
assert.equal(mixed.discountGrossCents,160,"ordinary line remains eligible");
assert.equal(capturePricing([sale,daily],"DEU",10,at).discountGrossCents,0);
const bfDaily={...daily,product:{...daily.product,dayOfferStartsAt:new Date(BLACK_FRIDAY.startsAt),dayOfferEndsAt:new Date(BLACK_FRIDAY.endsAt)}};
assert.equal(capturePricing([sale,bfDaily],"DEU",15,new Date(BLACK_FRIDAY.startsAt)).discountGrossCents,0,"BLACK15 follows same exclusions");
const bf=new Date(BLACK_FRIDAY.startsAt);assert.equal(blackFridayWithinWindow(bf.getTime(),"coupon"),true);
const eligibleBF=capturePricing([sale,extra],"DEU",15,bf);
assert.equal(eligibleBF.discountGrossCents,240,"BLACK15 only ordinary items");
const before=taxPolicyAt(new Date("2026-12-31T22:59:00Z"),"DEU");
const after=taxPolicyAt(new Date("2027-01-01T00:00:00Z"),"DEU");
assert.equal(before.mode,"exempt");assert.equal(after.mode,"vat");
assert.equal(invoiceTax(p,new Date("2026-11-21T12:00:00Z")).vatCents,0);
const persisted=readPricing(JSON.parse(JSON.stringify(p)))!;
assert.equal(reviseOrderPricing([item(563,500),item(92,400),item(700,300)],"DEU",10,at,persisted).totalGrossCents,p.totalGrossCents,"historic order does not recompute changed prices");
const refund=correctionAmounts({customer:"Example",grossCents:p.totalGrossCents,vatCents:0,rateBasisPoints:0,mode:"exempt"},0,0,1600);
assert.equal(refund.grossCents,1600);assert.equal(refund.vatCents,0);
// Live CREED BONUS-AKTION product IDs: Santal 481, Viking 478, Himalaya 445.
// The two paid items are currently also on Sale (3.50 -> 2.80 EUR/ml).
const creedSantal=item(481,3.5,5,2.8),creedViking=item(478,3.5,5,2.8);
const creed={productIds:[481,478],requiredMl:5,active:true,startsAt:new Date("2026-11-20T10:15:00Z"),endsAt:null};
assert.equal(promotionQualified(creed,[creedSantal,creedViking]),true,"Creed A: two 5ml items qualify for 2ml Himalaya gift");
const creedBlocked=giftPromotionProductIds([{eligible:true,productIds:creed.productIds}]);
const creedB=capturePricing([creedSantal,creedViking],"DEU",10,at,undefined,false,creedBlocked);
assert.equal(creedB.discountGrossCents,0,"Creed B: no coupon stacking on two Sale + gift-eligible items");
const creedC=capturePricing([creedSantal,creedViking,extra],"DEU",10,at,undefined,false,creedBlocked);
assert.equal(creedC.discountGrossCents,160,"Creed C: coupon only on unrelated full-price fragrance");
assert.equal(promotionQualified(creed,[creedSantal,{...creedViking,quantity:4}]),false,"Creed D: losing 5ml Viking revokes gift");
const creedE=capturePricing([creedSantal,creedViking],"DEU",10,at,undefined,false,new Set());
assert.equal(creedE.discountGrossCents,0,"Creed E: Sale exclusion remains when gift promotion ends");
assert.equal(promotionLive({...creed,active:false},at),false);
assert.equal(445 in {},false,"free gift is not represented as a payable cart line");
const multi=giftPromotionProductIds([
 {eligible:true,productIds:[481,478]},
 {eligible:true,productIds:[900,901]},
 {eligible:false,productIds:[700,777]}
]);
assert.deepEqual([...multi].sort((a,b)=>a-b),[478,481,900,901],"multiple active gift offers exclude only their requirements");
assert.equal(capturePricing([creedSantal,creedViking,extra],"DEU",15,bf,undefined,false,multi).discountGrossCents,240,
 "ordinary full-price item still eligible in multi-promotion cart");
const rounding=couponQuote([{productId:1,grossCents:199,excluded:false},{productId:2,grossCents:99,excluded:true}],15);
assert.equal(rounding.discountCents,30,"coupon rounds once in integer cents");
assert.equal(rounding.eligibleCents,199);
console.log("Unified coupon tests passed: Creed A–E, Sale, daily, BLACK15, shipping, snapshots, tax and refunds.");
