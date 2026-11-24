import "server-only";
import React from "react";
import {randomBytes} from "node:crypto";
import {prisma} from "@/prisma/prisma-client";
import type {Prisma} from "@prisma/client";
import {sendEmail} from "@/src/shared/lib/send-email";
import {legacyRewardEligible,legacyRewardExpiry} from "@/src/shared/lib/legacy-newsletter-offer";
import {marketingOptOutToken} from "@/src/shared/server-lib/marketing-optout";
const BASE="https://euro-perfume-inky.vercel.app";
export type RewardGrant={code:string;expiresAt:Date}|null;
/** Call only inside the transaction that confirms newsletter consent, or after confirmed pre-existing consent. */
export async function grantLegacyNewsletterReward(tx:Prisma.TransactionClient,userId:number,now=new Date()):Promise<RewardGrant>{
 const user=await tx.user.findUnique({where:{id:userId},select:{createdAt:true,verified:true,accountConsent:{select:{marketingConfirmedAt:true,marketingWithdrawnAt:true}}}});
 if(!user||!legacyRewardEligible(user.createdAt,user.verified)||!user.accountConsent?.marketingConfirmedAt||user.accountConsent.marketingWithdrawnAt)return null;
 // Serialize concurrent requests from different devices; one reward per account.
 await tx.$queryRaw`SELECT "userId" FROM "LegacyNewsletterReward" WHERE "userId"=${userId} FOR UPDATE`;
 const reward=await tx.legacyNewsletterReward.findUnique({where:{userId}});
 if(!reward)return null; // No unsolicited reward creation. User must request the offer.
 if(reward.code && reward.expiresAt)return {code:reward.code,expiresAt:reward.expiresAt};
 const code="EP15-"+randomBytes(8).toString("hex").toUpperCase();
 const expiresAt=legacyRewardExpiry(now);
 // Unique user row and coupon code; atomic with confirmation so no duplicate grants.
 await tx.promoCode.create({data:{code,discount:15,isActive:true,disposable:false,expiresAt}});
 await tx.couponPolicy.create({data:{code,kind:"PER_ACCOUNT",perUserLimit:1,active:true,endsAt:expiresAt}});
 await tx.legacyNewsletterReward.update({where:{userId},data:{code,grantedAt:now,expiresAt}});
 return {code,expiresAt};
}
/** Only after independent double opt-in has been saved and verified. */
export async function emailLegacyNewsletterReward(userId:number):Promise<boolean>{
 const reward=await prisma.legacyNewsletterReward.findUnique({where:{userId},include:{user:{select:{email:true,verified:true,accountConsent:{select:{marketingConfirmedAt:true,marketingWithdrawnAt:true}}}}}});
 if(!reward?.code||!reward.expiresAt||!reward.user.verified||!reward.user.accountConsent?.marketingConfirmedAt||reward.user.accountConsent.marketingWithdrawnAt||reward.emailSentAt||new Date()>=reward.expiresAt)return false;
 try{
  // Build the signed link and message before acquiring the delivery claim.
  // Configuration/rendering failures cannot leave a voucher claimed but unsent.
  const unsubscribe=`${BASE}/de/newsletter/leave?token=${encodeURIComponent(marketingOptOutToken(userId))}`;
  const message=React.createElement("div",{lang:"de",style:{fontFamily:"Arial,sans-serif",lineHeight:1.7,maxWidth:580,margin:"auto",color:"#292524"}},
     React.createElement("p",null,"EURO PERFUME"),
     React.createElement("h1",null,"Dein persönlicher 15 %-Gutschein"),
     React.createElement("p",null,"Vielen Dank für deine bestätigte Newsletter-Anmeldung. Hier ist dein einmalig einlösbarer Gutschein:"),
     React.createElement("p",{style:{fontSize:25,fontWeight:700,letterSpacing:2}},reward.code),
     React.createElement("p",null,"15 % Rabatt auf eine Bestellung, gültig bis ",reward.expiresAt.toLocaleDateString("de-DE",{timeZone:"Europe/Berlin"}),". Ausgenommen sind Sale, Tagesangebote, Artikel aus Geschenkaktionen und Versandkosten. Nicht mit WELCOME10 oder anderen Gutscheinen kombinierbar."),
     React.createElement("p",null,"Dein Gutschein bleibt bis zum Ablauf gültig, auch wenn du den Newsletter abbestellst."),
     React.createElement("p",null,React.createElement("a",{href:`${BASE}/de/profile`},"Zum Kundenkonto")),
     React.createElement("p",{style:{fontSize:12}},React.createElement("a",{href:unsubscribe},"Newsletter abbestellen")," · ",React.createElement("a",{href:`${BASE}/de/impressum`},"Impressum")," · ",React.createElement("a",{href:`${BASE}/de/data-protection`},"Datenschutz"))
    );
  const now=new Date();
  const claimed=await prisma.legacyNewsletterReward.updateMany({
   where:{userId,code:reward.code,expiresAt:{gt:now},emailClaimedAt:null,emailSentAt:null,
    user:{is:{verified:{not:null},accountConsent:{is:{marketingConfirmedAt:{not:null},marketingWithdrawnAt:null}}}}},
   data:{emailClaimedAt:now},
  });
  if(!claimed.count)return false;
  // Keep a claim on ambiguous provider outcomes so retries cannot send duplicates.
  const accepted=await sendEmail(reward.user.email,"EURO PERFUME — Dein persönlicher 15 %-Gutschein",message);
  if(!accepted?.id)throw new Error("Reward email acceptance not confirmed");
  await prisma.legacyNewsletterReward.update({where:{userId},data:{emailSentAt:new Date()}});
  return true;
 }catch(e){console.error("[LEGACY_REWARD_EMAIL]",e);return false;}
}
