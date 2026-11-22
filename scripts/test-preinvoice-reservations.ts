import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {capturePricing,readPricing,reviseOrderPricing} from "../src/shared/lib/tax";
import {pointRedemptionQuote,refundableSpentPoints,earnedPointsAfterRefund} from "../src/shared/lib/loyalty-arithmetic";
import {couponPolicyFailure} from "../src/shared/lib/europerfume-club";
type FakeItem=Parameters<typeof capturePricing>[0][number];
const item=(productId:number,price:number,quantity=1):FakeItem=>({
 productId,variationId:null,quantity,
 product:{name:"Dummy "+productId,price,discountPrice:null,productGroup:{onTap:false}}
});
const time=new Date("2026-11-22T12:00:00Z");
const first=capturePricing([item(1,60),item(2,50)],"DEU",10,time);
assert.equal(first.subtotalGrossCents,11000);
assert.equal(first.shippingGrossCents,0);
assert.equal(first.discountGrossCents,1100);
assert.equal(first.totalGrossCents,9900);
const quoted=pointRedemptionQuote({balancePoints:2000,eligibleAfterCouponCents:9900});
assert.equal(quoted.spendPoints,1980);
first.loyaltyDiscountCents=quoted.spendPoints;
first.totalGrossCents-=quoted.spendPoints;
assert.equal(readPricing(first)?.totalGrossCents,7920);

// Merchant removes an unavailable product BEFORE invoice: release 900 points.
const edited=reviseOrderPricing([item(1,60)],"DEU",10,time,first);
assert.equal(edited.subtotalGrossCents,6000);
assert.equal(edited.shippingGrossCents,495);
assert.equal(edited.discountGrossCents,600);
assert.equal(edited.loyaltyDiscountCents,1080);
assert.equal(edited.totalGrossCents,4815);
assert.equal(first.loyaltyDiscountCents!-edited.loyaltyDiscountCents!,900);
assert.equal(readPricing(edited)?.totalGrossCents,4815);

// Re-running unchanged edit is a no-op, no second credit.
const repeated=reviseOrderPricing([item(1,60)],"DEU",10,time,edited);
assert.equal(repeated.loyaltyDiscountCents,1080);
assert.equal(repeated.totalGrossCents,4815);
assert.equal(edited.loyaltyDiscountCents!-repeated.loyaltyDiscountCents!,0);

// Increasing the order cannot secretly debit extra points.
const expanded=reviseOrderPricing([item(1,60),item(2,50)],"DEU",10,time,edited);
assert.equal(expanded.loyaltyDiscountCents,1080);
assert.equal(expanded.totalGrossCents,8820);

// Same checks without points: normal edits preserve original accepted prices.
const ordinary=capturePricing([item(1,60),item(2,50)],"DEU",0,time);
const ordinaryEdited=reviseOrderPricing([item(1,60)],"DEU",0,time,ordinary);
assert.equal(ordinaryEdited.totalGrossCents,6495);
assert.equal(ordinaryEdited.loyaltyDiscountCents??0,0);

// Finalize only the net held points. A cash refund returns only the paid invoice's spend.
const reservedAtEnquiry=1980, releasedBeforeInvoice=900, settledAtInvoice=1080;
assert.equal(reservedAtEnquiry-releasedBeforeInvoice,settledAtInvoice);
assert.equal(refundableSpentPoints({originalSpentPoints:settledAtInvoice,originalEligibleChargedCents:5400,cumulativeEligibleRefundCents:2700}),540);
assert.deepEqual(earnedPointsAfterRefund({originalEarnedPoints:216,originalEligibleCents:5400,cumulativeEligibleRefundCents:2700}),{remainingEarnedPoints:108,reversalPoints:108});
assert.equal(refundableSpentPoints({originalSpentPoints:0,originalEligibleChargedCents:5400,cumulativeEligibleRefundCents:5400}),0);

const welcome={kind:"WELCOME",active:true,startsAt:null,endsAt:null,validDaysAfterVerification:60,perUserLimit:1,globalLimit:null,usedCount:0,epoch:1};
const context={now:time,userId:101,verifiedAt:new Date("2026-11-21T10:00:00Z"),priorUses:0,accountOrderCount:0};
assert.equal(couponPolicyFailure(welcome,context),null);
assert.equal(couponPolicyFailure(welcome,{...context,priorUses:1}),"USED");
assert.equal(couponPolicyFailure(welcome,{...context,priorUses:0,accountOrderCount:0}),null,"Cancelled, uninvoiced order releases WELCOME10 for reuse");

const src=(file:string)=>readFileSync(new URL("../"+file,import.meta.url),"utf8");
const actions=src("src/app/actions.ts");
const pre=src("src/shared/server-lib/preinvoice-loyalty.ts");
const edits=src("src/app/api/order-item/[id]/route.ts");
const status=src("src/app/api/order/[id]/route.ts");
const invoice=src("src/shared/server-lib/create-protected-invoice.ts");
const refunds=src("src/app/invoice-correction-actions.ts");
assert.match(actions,/kind:"RESERVE",points:-requestedPoints/);
assert.match(actions,/idempotencyKey:`order:\$\{order.id\}:reserve:v1`/,"Enquiry reservation ID must remain unique");
assert.match(pre,/SELECT id FROM "Order" WHERE id=\$\{orderId\} FOR UPDATE/);
assert.match(pre,/if\(order.invoice\)throw Error\("INVOICE_ALREADY_ISSUED"\)/);
assert.match(pre,/PAYMENT_ALREADY_CONFIRMED/);
assert.match(pre,/RESERVATION_RELEASE/);
assert.match(pre,/RESERVATION_CANCELLED/);
assert.match(pre,/alreadyCancelled:true,returnedPoints:0/);
assert.match(pre,/tx.couponRedemption.delete/);
assert.match(pre,/usedCount:\{decrement:1\}/);
assert.match(pre,/ADDITIONAL_POINTS_REQUIRE_BUYER_APPROVAL/);
assert.match(pre,/reservation-finalized:v1/);
assert.match(pre,/invoice-spend:v1/);
assert.equal((edits.match(/updatePreinvoiceOrder\(tx,order,/g)||[]).length,3);
assert.equal((edits.match(/lockEditableOrder\(tx,/g)||[]).length,3);
assert.match(status,/cancelUnpaidEnquiry\(tx,id\)/);
assert.match(status,/Use status CENCELLED; orders cannot be hard-deleted/);
assert.match(invoice,/settlePointsAtInvoice\(tx,order.id,order.userId,pricing\)/);
assert.match(invoice,/Нельзя выставить счёт по отменённой заявке/);
assert.match(refunds,/const usesNewReservation=entries.some\(e=>e.kind==="RESERVE"\)/);
console.log("Pre-invoice loyalty: 2-item edit, shipping threshold, coupon, 20% points cap, no extra debits, repeat edit, cancellation, WELCOME10, invoice settlement, refund math and code guards PASS (pure/static; no DB writes).");
