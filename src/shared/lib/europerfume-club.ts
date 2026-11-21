/** Pure policy rules. Campaigns are independent from Shopify. */
export type CouponPolicyValue={
 kind:string;active:boolean;startsAt:Date|null;endsAt:Date|null;
 validDaysAfterVerification:number|null;perUserLimit:number;globalLimit:number|null;usedCount:number;epoch:number;
};
export type CouponPolicyContext={
 now:Date; userId:number|null; verifiedAt:Date|null; priorUses:number;
 accountOrderCount:number;
};
export type CouponFailure="ACCOUNT_REQUIRED"|"EMAIL_UNVERIFIED"|"EXPIRED"|"USED"|"LIMIT_REACHED"|"FIRST_ORDER_ONLY"|"DISABLED"|null;
export function couponPolicyFailure(policy:CouponPolicyValue,c:CouponPolicyContext):CouponFailure {
 if(!policy.active)return "DISABLED";
 if(policy.startsAt&&c.now<policy.startsAt || policy.endsAt&&c.now>=policy.endsAt)return "EXPIRED";
 if(c.userId===null)return "ACCOUNT_REQUIRED";
 if(!c.verifiedAt)return "EMAIL_UNVERIFIED";
 if(policy.globalLimit!==null && policy.usedCount>=policy.globalLimit)return "LIMIT_REACHED";
 if(c.priorUses>=policy.perUserLimit)return "USED";
 if(policy.kind==="WELCOME"){
   if(c.accountOrderCount!==0)return "FIRST_ORDER_ONLY";
   if(policy.validDaysAfterVerification!==null && c.now.getTime()>=c.verifiedAt.getTime()+policy.validDaysAfterVerification*86400000)return "EXPIRED";
 }
 return null;
}
export function welcomeExpiresAt(verifiedAt:Date,days=60):Date {
 return new Date(verifiedAt.getTime()+days*86400000);
}
/** Points count only full-price merchandise after coupon reductions. Never award on shipping. */
export function earnablePoints(lines:readonly {grossCents:number;couponExcluded?:boolean}[],discountCents:number):number{
 const eligible=lines.filter(x=>!x.couponExcluded).reduce((s,x)=>s+x.grossCents,0);
 return Math.floor(Math.max(0,eligible-discountCents)*5/100);
}

/** Order qualifies only if it was placed while signed into an already verified account. */
export function accountOrderEligible(userId:number|null,verifiedAt:Date|null,orderCreatedAt:Date):boolean{
 return userId!==null && verifiedAt!==null && orderCreatedAt.getTime()>=verifiedAt.getTime();
}
export function loyaltyAwardAllowed(paidAt:Date|null,shippedAt:Date|null,awardedAt:Date|null):boolean{
 return Boolean(paidAt && shippedAt && !awardedAt);
}
