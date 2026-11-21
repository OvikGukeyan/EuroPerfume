import {readPricing} from "../src/shared/lib/tax";
import {pointRedemptionQuote,earnedPointsAfterRefund,refundableSpentPoints} from "../src/shared/lib/loyalty-arithmetic";
import assert from "node:assert/strict";
import {couponPolicyFailure,earnablePoints,welcomeExpiresAt,accountOrderEligible,loyaltyAwardAllowed} from "../src/shared/lib/europerfume-club";
const verified=new Date("2026-11-21T10:00:00Z"),now=new Date("2026-11-25T10:00:00Z");
const policy={kind:"WELCOME",active:true,startsAt:null,endsAt:null,validDaysAfterVerification:60,perUserLimit:1,globalLimit:null,usedCount:0,epoch:1};
const ctx={now,userId:42,verifiedAt:verified,priorUses:0,accountOrderCount:0};
assert.equal(couponPolicyFailure(policy,ctx),null);
assert.equal(couponPolicyFailure(policy,{...ctx,priorUses:1}),"USED");
assert.equal(couponPolicyFailure(policy,{...ctx,accountOrderCount:1}),"FIRST_ORDER_ONLY");
assert.equal(couponPolicyFailure(policy,{...ctx,userId:null}),"ACCOUNT_REQUIRED");
assert.equal(couponPolicyFailure(policy,{...ctx,verifiedAt:null}),"EMAIL_UNVERIFIED");
assert.equal(couponPolicyFailure(policy,{...ctx,now:welcomeExpiresAt(verified)}),"EXPIRED");
assert.equal(couponPolicyFailure({...policy,active:false},ctx),"DISABLED");
assert.equal(couponPolicyFailure({...policy,kind:"PER_ACCOUNT",validDaysAfterVerification:null}, {...ctx,accountOrderCount:10}),null);
assert.equal(couponPolicyFailure({...policy,kind:"PER_ACCOUNT",validDaysAfterVerification:null,globalLimit:4,usedCount:4},ctx),"LIMIT_REACHED");
assert.equal(couponPolicyFailure({...policy,endsAt:now},ctx),"EXPIRED");
assert.equal(earnablePoints([{grossCents:1500},{grossCents:3000,couponExcluded:true}],150),67);
assert.equal(earnablePoints([{grossCents:1500,couponExcluded:true}],0),0);
assert.equal(earnablePoints([{grossCents:999}],0),49);
console.log("EURO PERFUME CLUB policy tests passed: welcome, per-account, limits, expiry, redemption, points.");

assert.equal(accountOrderEligible(null,verified,now),false,"old guest orders must never be linked by email");
assert.equal(accountOrderEligible(4,null,now),false,"unverified account is not eligible");
assert.equal(accountOrderEligible(4,now,verified),false,"account order before email verification is not eligible");
assert.equal(accountOrderEligible(4,verified,now),true);
assert.equal(loyaltyAwardAllowed(verified,null,null),false,"label printed is not shipped");
assert.equal(loyaltyAwardAllowed(verified,now,null),true,"paid + carrier confirmed awards");
assert.equal(loyaltyAwardAllowed(verified,now,now),false,"no double granting");

assert.deepEqual(pointRedemptionQuote({balancePoints:1000,eligibleAfterCouponCents:2500}),{spendPoints:500,discountCents:500});
assert.deepEqual(pointRedemptionQuote({balancePoints:200,eligibleAfterCouponCents:2500}),{spendPoints:200,discountCents:200});
assert.deepEqual(pointRedemptionQuote({balancePoints:200,eligibleAfterCouponCents:0}),{spendPoints:0,discountCents:0});
assert.deepEqual(earnedPointsAfterRefund({originalEarnedPoints:250,originalEligibleCents:5000,cumulativeEligibleRefundCents:2000}),{remainingEarnedPoints:150,reversalPoints:100});
assert.deepEqual(earnedPointsAfterRefund({originalEarnedPoints:250,originalEligibleCents:5000,cumulativeEligibleRefundCents:5000}),{remainingEarnedPoints:0,reversalPoints:250});
assert.equal(refundableSpentPoints({originalSpentPoints:500,originalEligibleChargedCents:5000,cumulativeEligibleRefundCents:2000}),200);
assert.equal(refundableSpentPoints({originalSpentPoints:500,originalEligibleChargedCents:5000,cumulativeEligibleRefundCents:5000}),500);
console.log("Loyalty redemption and cumulative partial-refund arithmetic passed (pure tests only).");

const priceWithPoints=readPricing({
 version:1,country:"DEU",capturedAt:"2026-11-21T18:00:00.000Z",
 policy:{mode:"exempt",rateBasisPoints:0},
 subtotalGrossCents:5000,shippingGrossCents:500,discountGrossCents:500,
 loyaltyDiscountCents:900,totalGrossCents:4100,
 lines:[{productId:1,variationId:null,title:"Test item",quantity:1,onTap:false,grossCents:5000,couponExcluded:false}]
});
assert.equal(priceWithPoints?.loyaltyDiscountCents,900);
assert.equal(priceWithPoints?.totalGrossCents,4100);
assert.equal(readPricing({...priceWithPoints,totalGrossCents:5000}),null,"point savings cannot be omitted from stored gross");
assert.deepEqual(earnedPointsAfterRefund({originalEarnedPoints:200,originalEligibleCents:5000,cumulativeEligibleRefundCents:2500}),{remainingEarnedPoints:100,reversalPoints:100});
assert.equal(refundableSpentPoints({originalSpentPoints:900,originalEligibleChargedCents:5000,cumulativeEligibleRefundCents:2500}),450);
console.log("Saved loyalty pricing and proportional refund ledger arithmetic passed.");
