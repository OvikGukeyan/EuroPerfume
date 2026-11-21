export const LEGACY_REWARD_CUTOFF=new Date("2026-11-22T00:00:00.000Z");
export const LEGACY_REWARD_DAYS=30;
export function legacyRewardEligible(createdAt:Date,verifiedAt:Date|null):boolean {
 return createdAt.getTime()<LEGACY_REWARD_CUTOFF.getTime() && verifiedAt!==null;
}
export function legacyRewardExpiry(grantedAt:Date):Date{
 return new Date(grantedAt.getTime()+LEGACY_REWARD_DAYS*86400000);
}
export function legacyRewardUsable(userId:number,holderId:number,grantedAt:Date|null,expiresAt:Date|null,now:Date):boolean{
 return userId===holderId && !!grantedAt && !!expiresAt && now<expiresAt;
}
