import "server-only";
import {Prisma} from "@prisma/client";
import {legacyRewardUsable} from "@/src/shared/lib/legacy-newsletter-offer";
import {couponPolicyFailure} from "@/src/shared/lib/europerfume-club";
import {prisma} from "@/prisma/prisma-client";

type Db=typeof prisma|Prisma.TransactionClient;
export async function findCouponPolicy(db:Db,code:string){
 try{return await db.couponPolicy.findUnique({where:{code}});}
 catch(e){
  if(e instanceof Prisma.PrismaClientKnownRequestError && (e.code==="P2021"||e.code==="P2022")) return null;
  throw e;
 }
}
export async function checkCouponPolicy(db:Db,policy:NonNullable<Awaited<ReturnType<typeof findCouponPolicy>>>,userId:number|null,now:Date){
 const user=userId===null?null:await db.user.findUnique({where:{id:userId},select:{verified:true}});
 const [priorUses,accountOrderCount]=userId===null?[0,0]:await Promise.all([
  db.couponRedemption.count({where:{code:policy.code,epoch:policy.epoch,userId}}),
  policy.kind==="WELCOME"?db.order.count({where:{userId,status:{not:"CENCELLED"}}}):Promise.resolve(0)
 ]);
 const baseFailure=couponPolicyFailure(policy,{now,userId,verifiedAt:user?.verified||null,priorUses,accountOrderCount});
 if(baseFailure)return baseFailure;
 const personal=await db.legacyNewsletterReward.findUnique({where:{code:policy.code}});
 if(personal && (userId===null || !legacyRewardUsable(userId,personal.userId,personal.grantedAt,personal.expiresAt,now)))return "ACCOUNT_REQUIRED";
 return null;
}
export function normalizeCode(code:string){return code.trim().toUpperCase();}
