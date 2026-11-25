import {qualifyingGiftAmount,PALLAS_GIFT} from "../src/shared/lib/pallas-gift-rules";
import assert from "node:assert/strict";
import { promotionLive,promotionQualified } from "../src/shared/lib/promotion-rules";

const at=new Date("2026-11-16T17:00:00Z");
const promo={active:true,startsAt:null,endsAt:null,productIds:[11,12],requiredMl:5};
const cart=[{productId:11,quantity:5,variationId:null},{productId:12,quantity:5,variationId:null}];
assert.equal(promotionQualified(promo,cart),true,"complete 5+5 qualifies");
assert.equal(promotionQualified(promo,[...cart,{productId:99,quantity:15,variationId:null}]),true,"extra products do not cancel gift");
assert.equal(promotionQualified(promo,[cart[0]]),false,"removing one required item revokes gift");
assert.equal(promotionQualified(promo,[cart[0],{...cart[1],quantity:4}]),false,"decreasing below threshold revokes gift");
assert.equal(promotionQualified(promo,[cart[0],{...cart[1],variationId:42}]),false,"other variations cannot satisfy requirement");
assert.equal(promotionQualified({...promo,productIds:[11,11]},cart),false,"duplicate rules rejected");
assert.equal(promotionLive(promo,at),true,"active promotion");
assert.equal(promotionLive({...promo,active:false},at),false,"inactive rejected");
assert.equal(promotionLive({...promo,startsAt:new Date("2026-11-17T00:00:00Z")},at),false,"not started");
assert.equal(promotionLive({...promo,endsAt:at},at),false,"end time exclusive");
console.log("Promotion eligibility tests passed: mixed cart, removal, volume, variants and time boundaries.");

if(qualifyingGiftAmount(9999,0,0)||!qualifyingGiftAmount(10000,0,0)||qualifyingGiftAmount(11000,1000,1)||!qualifyingGiftAmount(11000,1000,0)||PALLAS_GIFT.slots*PALLAS_GIFT.ml!==50) throw new Error("Pallas gift threshold/property regression");
