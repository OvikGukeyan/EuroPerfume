import "server-only";
import {createHash} from "node:crypto";
import type {Prisma} from "@prisma/client";
import {prisma} from "@/prisma/prisma-client";
import {PALLAS_GIFT, type PallasOfferState,qualifyingGiftAmount} from "../lib/pallas-gift-rules";

type StateRow = {id:string;slots:number;lastSlot:number;seen:boolean};
const id=PALLAS_GIFT.slug;
function absent(error:unknown){
 const e=error as {code?:string;meta?:{code?:string}};
 return e?.code==="P2010"&&e.meta?.code==="42P01";
}
export async function pallasGiftState(accountEmail:string|null):Promise<PallasOfferState>{
 try{
  const rows=await prisma.$queryRaw<StateRow[]>`
   SELECT g.id,g.slots,g."lastSlot",
    EXISTS(SELECT 1 FROM "PallasGiftClaim" c WHERE c."campaignId"=g.id AND (c."buyerKey"=${accountEmail?buyerKey(accountEmail):null} OR c."accountKey"=${accountEmail?buyerKey(accountEmail):null})) AS seen
   FROM "PallasGiftCampaign" g
   JOIN "Product" p ON p.id=g."productId"
   WHERE g.id=${id} AND g.enabled
    AND p.available AND g."startsAt"<=now() AND (g."endsAt" IS NULL OR g."endsAt">now())`;
  const row=rows[0];
  return !row?"off":row.lastSlot>=row.slots?"exhausted":row.seen?"claimed":"eligible";
 }catch(e){if(absent(e))return "off";throw e;}
}

type Quote={subtotalGrossCents:number;discountGrossCents:number;loyaltyDiscountCents?:number};
type Reservation={slot:number;buyerKey:string;accountKey:string|null;promotionId:string};
const buyerKey=(email:string)=>createHash("sha256").update(id+"\0"+email.trim().toLowerCase()).digest("hex");
type Candidate={lastSlot:number;slots:number;promotionId:string;available:boolean};
export async function reservePallasGift(tx:Prisma.TransactionClient,uid:number|null,email:string,pricing:Quote,expected:boolean,enabled:boolean):Promise<Reservation|null>{
 const noGift=()=>{if(expected)throw new Error("PALLAS_GIFT_CHANGED");return null;};
 if(!enabled||!qualifyingGiftAmount(pricing.subtotalGrossCents,pricing.discountGrossCents,pricing.loyaltyDiscountCents??0))return noGift();
 // Serializes each claim including a repeat account and the last available slot.
 const rows=await tx.$queryRaw<Candidate[]>`
  SELECT g."lastSlot",g.slots,g."promotionId",p.available
  FROM "PallasGiftCampaign" g JOIN "Product" p ON p.id=g."productId"
  WHERE g.id=${id} AND g.enabled AND g."startsAt"<=now()
  AND (g."endsAt" IS NULL OR g."endsAt">now()) FOR UPDATE OF g`;
 const g=rows[0];
 if(!g?.available||g.lastSlot>=g.slots)return noGift();
 const account=uid?await tx.user.findUnique({where:{id:uid},select:{verified:true,email:true}}):null;
 const checkoutKey=buyerKey(email), accountKey=account?.verified?buyerKey(account.email):null;
 const previous=await tx.$queryRaw<{found:boolean}[]>`SELECT EXISTS(SELECT 1 FROM "PallasGiftClaim" WHERE "campaignId"=${id} AND ("buyerKey" IN (${checkoutKey},${accountKey}) OR "accountKey" IN (${checkoutKey},${accountKey}))) AS found`;
 if(previous[0]?.found)return noGift();
 const advanced=await tx.$queryRaw<{lastSlot:number}[]>`UPDATE "PallasGiftCampaign" SET "lastSlot"="lastSlot"+1 WHERE id=${id} AND "lastSlot"<slots RETURNING "lastSlot"`;
 if(!advanced[0])return noGift();
 return {slot:advanced[0].lastSlot,buyerKey:checkoutKey,accountKey,promotionId:g.promotionId};
}

export async function linkPallasGift(tx:Prisma.TransactionClient,orderId:number,reservation:Reservation){
 await tx.$executeRaw`INSERT INTO "PallasGiftClaim" ("campaignId","slot","buyerKey","accountKey","orderId","quantity","giftMl") VALUES (${id},${reservation.slot},${reservation.buyerKey},${reservation.accountKey},${orderId},1,${PALLAS_GIFT.ml})`;
}
export async function pallasGiftCampaignPresent(){
 try{const v=await prisma.$queryRaw<{found:boolean}[]>`SELECT EXISTS(SELECT 1 FROM "PallasGiftCampaign" WHERE id=${id} AND enabled AND "startsAt"<=now() AND ("endsAt" IS NULL OR "endsAt">now())) AS found`;return !!v[0]?.found;}
 catch(e){if(absent(e))return false;throw e;}
}
