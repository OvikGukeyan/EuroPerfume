/** Deterministic loyalty arithmetic. These helpers do NOT mutate invoices, orders or wallets.
 * All amounts are integer cents, and 100 points = EUR 1.
 */
export function pointRedemptionQuote(args:{
 balancePoints:number; eligibleAfterCouponCents:number; maxPercent?:number;
}):{spendPoints:number;discountCents:number}{
 const {balancePoints,eligibleAfterCouponCents,maxPercent=20}=args;
 if(!Number.isSafeInteger(balancePoints)||balancePoints<0||!Number.isSafeInteger(eligibleAfterCouponCents)||eligibleAfterCouponCents<0||!Number.isInteger(maxPercent)||maxPercent<0||maxPercent>100)throw Error("INVALID_REDEMPTION");
 // One point is one cent. No shipping, gift products or promotional merchandise is eligible.
 const cap=Math.floor(eligibleAfterCouponCents*maxPercent/100);
 const spendPoints=Math.min(balancePoints,cap);
 return {spendPoints,discountCents:spendPoints};
}

/** Recompute cumulative earning based on the full eligible value retained after all corrections.
 * Calling this for every partial correction must compare with the last applied cumulative
 * earning figure, never blindly subtract the original award again.
 */
export function earnedPointsAfterRefund(args:{
 originalEarnedPoints:number; originalEligibleCents:number; cumulativeEligibleRefundCents:number;
}):{remainingEarnedPoints:number;reversalPoints:number}{
 const {originalEarnedPoints,originalEligibleCents,cumulativeEligibleRefundCents}=args;
 for(const n of [originalEarnedPoints,originalEligibleCents,cumulativeEligibleRefundCents])if(!Number.isSafeInteger(n)||n<0)throw Error("INVALID_REFUND");
 if(cumulativeEligibleRefundCents>originalEligibleCents)throw Error("REFUND_EXCEEDS_PURCHASE");
 // Pro-rata on the original credited earning; avoid repeated rounding losses.
 const remainingEarnedPoints=originalEligibleCents===0?0:
  Math.floor(originalEarnedPoints*(originalEligibleCents-cumulativeEligibleRefundCents)/originalEligibleCents);
 return {remainingEarnedPoints,reversalPoints:originalEarnedPoints-remainingEarnedPoints};
}

/** Maximum points that may be restored across all partial refunds.
 * Integration must use cumulative amounts and an immutable refund event id,
 * so replaying the same correction cannot restore twice.
 */
export function refundableSpentPoints(args:{
 originalSpentPoints:number; originalEligibleChargedCents:number;cumulativeEligibleRefundCents:number;
}):number{
 const {originalSpentPoints,originalEligibleChargedCents,cumulativeEligibleRefundCents}=args;
 for(const n of [originalSpentPoints,originalEligibleChargedCents,cumulativeEligibleRefundCents])if(!Number.isSafeInteger(n)||n<0)throw Error("INVALID_REFUND");
 if(cumulativeEligibleRefundCents>originalEligibleChargedCents)throw Error("REFUND_EXCEEDS_PURCHASE");
 if(originalEligibleChargedCents===0)return 0;
 return Math.min(originalSpentPoints,Math.floor(originalSpentPoints*cumulativeEligibleRefundCents/originalEligibleChargedCents));
}
