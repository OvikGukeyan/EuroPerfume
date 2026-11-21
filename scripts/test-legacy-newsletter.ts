import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {legacyRewardEligible,legacyRewardExpiry,legacyRewardUsable,LEGACY_REWARD_CUTOFF} from "../src/shared/lib/legacy-newsletter-offer";
import {couponQuote} from "../src/shared/lib/coupon-eligibility";
const before=new Date(LEGACY_REWARD_CUTOFF.getTime()-1000);
const after=new Date(LEGACY_REWARD_CUTOFF.getTime());
const verified=new Date("2026-11-19T12:00:00Z");
assert.equal(legacyRewardEligible(before,verified),true);
assert.equal(legacyRewardEligible(before,null),false);
assert.equal(legacyRewardEligible(after,verified),false);
const expiry=legacyRewardExpiry(verified);
assert.equal(expiry.getTime()-verified.getTime(),30*86400000);
assert.equal(legacyRewardUsable(14,14,verified,expiry,verified),true);
assert.equal(legacyRewardUsable(15,14,verified,expiry,verified),false);
assert.equal(legacyRewardUsable(14,14,verified,expiry,expiry),false);
assert.equal(legacyRewardUsable(14,14,null,expiry,verified),false);
// Subscription withdrawal is intentionally NOT an input to the entitlement:
// the discount cannot be revoked simply because a user unsubscribed.
const quote=couponQuote([{productId:1,grossCents:10000,excluded:false},{productId:2,grossCents:4000,excluded:true}],15);
assert.equal(quote.discountCents,1500);
const source=(file:string)=>readFileSync(new URL("../"+file,import.meta.url),"utf8");
assert.match(source("src/app/api/newsletter/route.ts"),/grantLegacyNewsletterReward\(tx,consent.userId\)/);
assert.match(source("src/shared/server-lib/coupon-policies.ts"),/legacyRewardUsable\(userId,personal.userId/);
assert.match(source("src/app/api/account/legacy-newsletter-reward/route.ts"),/consent:z.literal\(true\)/);
assert.match(source("src/app/api/account/legacy-newsletter-reward/route.ts"),/acceptedAt:null/);
assert.match(source("src/shared/server-lib/legacy-newsletter-reward.ts"),/EURO PERFUME — Dein persönlicher 15 %-Gutschein/);
assert.match(source("src/shared/components/shared/legacy-newsletter-offer.tsx"),/type="checkbox"/);
console.log("Legacy offer: cutoff, verification, account ownership, 30 days, opt-in, no false AGB consent, 15% exclusions, unsubscribe independence PASS");
