import assert from "node:assert/strict";
import test from "node:test";
import { decantAddVolume, cartPackMl, formatPackQuantity, isDecantPack } from "../src/shared/lib/decant-pack";
import { capturePricing, invoiceTax, readPricing, reviseOrderPricing } from "../src/shared/lib/tax";
import { offerPrices } from "../src/shared/lib/day-offer";
import { minimumOrderGoodsCents } from "../src/shared/lib/minimum-order";
import { promotionQualified } from "../src/shared/lib/promotion-rules";

const p = {name:"Fixture",price:3.90,discountPrice:null,productGroup:{onTap:true}};
const row=(packMl:number,quantity:number)=>({productId:1,variationId:null,packMl,quantity,product:p});
const nov=new Date("2026-11-28T18:00:00Z"), jan=new Date("2027-01-01T12:00:00Z");

test("valid atomizer sizes only; no manual 1, 7, 12, 13 or 21 ml lines", () => {
  for (const ml of [2,3,5,10,20,30]) assert.equal(isDecantPack(ml),true);
  for (const ml of [1,4,7,12,13,21,2.5,"2",null]) assert.equal(isDecantPack(ml),false);
  assert.equal(cartPackMl(4,2),2);
  assert.equal(cartPackMl(12,10),null);
  assert.equal(cartPackMl(13,null),null);
  assert.equal(cartPackMl(5,null),5);
  assert.equal(formatPackQuantity(4,true,2,true),"2 × 2 мл");
  assert.equal(formatPackQuantity(5,true,5),"1 × 5 ml");
  assert.equal(formatPackQuantity(13,true,undefined),"13 ml");
});

test("separate packs and pricing agree before/after VAT, including each atomizer charge", () => {
  for (const at of [nov,jan]){
    const items=[row(5,5),row(2,4)];
    const quoted=capturePricing(items,"DEU",0,at);
    const [oneFive,twoTwo]=quoted.lines;
    const a=offerPrices(p,5,true,at.getTime()), b=offerPrices(p,2,true,at.getTime());
    assert.equal(oneFive.grossCents,Math.round(a.effective*100));
    assert.equal(twoTwo.grossCents,2*Math.round(b.effective*100));
    assert.equal(minimumOrderGoodsCents(items,at.getTime()),quoted.subtotalGrossCents);
    assert.equal(invoiceTax(quoted,at).grossCents,quoted.totalGrossCents);
    assert.deepEqual(readPricing(JSON.parse(JSON.stringify(quoted))),quoted);
    const edited=reviseOrderPricing([row(5,5),row(2,6)],"DEU",0,at,quoted);
    assert.equal(edited.lines[0].grossCents,oneFive.grossCents);
    assert.equal(edited.lines[1].grossCents,3*Math.round(b.effective*100));
  }
});

test("legacy prices still work and small packs cannot imitate the required promotion size", () => {
  const {packMl,...legacy}=row(2,13);
  const old=capturePricing([legacy],"DEU",0,nov);
  assert.equal(old.lines[0].packMl,undefined);
  assert.deepEqual(readPricing(old),old);
  const promo={productIds:[1,2],requiredMl:5,active:true,startsAt:null,endsAt:null};
  assert.equal(promotionQualified(promo,[row(3,6),{...row(5,5),productId:2}]),false);
  assert.equal(promotionQualified(promo,[row(5,5),{...row(5,5),productId:2}]),true);
});

test("quantity can be selected directly before adding a fixed atomizer size", () => {
  assert.equal(decantAddVolume(3,3),9);
  assert.equal(decantAddVolume(5,5),25);
  assert.equal(decantAddVolume(5,1),5);
  assert.equal(decantAddVolume(7,1),null);
  for (const n of [0,-1,1.5,100,"3",null]) assert.equal(decantAddVolume(3,n),null);
});
