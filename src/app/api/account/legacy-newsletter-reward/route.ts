import {prisma} from "@/prisma/prisma-client";
import {getUserSession} from "@/src/shared/server-lib/get-user-session";
import {sendNewsletterConfirmation} from "@/src/shared/server-lib/registration-consent";
import {grantLegacyNewsletterReward,emailLegacyNewsletterReward} from "@/src/shared/server-lib/legacy-newsletter-reward";
import {legacyRewardEligible} from "@/src/shared/lib/legacy-newsletter-offer";
import {consentCopy} from "@/src/shared/lib/registration-consent";
import {z} from "zod";
export const dynamic="force-dynamic";
export async function POST(request:Request){
 if(request.headers.get("origin")!==new URL(request.url).origin)return Response.json({error:"FORBIDDEN"},{status:403});
 const session=await getUserSession();
 if(!session)return Response.json({error:"LOGIN_REQUIRED"},{status:401});
 let data;try{data=z.object({consent:z.literal(true)}).parse(await request.json());}catch{return Response.json({error:"CONSENT_REQUIRED"},{status:400});}
 const userId=Number(session.id);
 try{
  const user=await prisma.user.findUnique({where:{id:userId},select:{createdAt:true,verified:true,accountConsent:true,legacyNewsletterReward:true}});
  if(!user||!legacyRewardEligible(user.createdAt,user.verified))return Response.json({error:"NOT_ELIGIBLE"},{status:403});
  if(user.legacyNewsletterReward?.code)return Response.json({status:"granted"},{headers:{"Cache-Control":"no-store"}});
  const activeConsent=!!user.accountConsent?.marketingConfirmedAt&&!user.accountConsent?.marketingWithdrawnAt;
  const now=new Date();
  await prisma.$transaction(async tx=>{
   await tx.legacyNewsletterReward.upsert({where:{userId},create:{userId,requestedAt:now},update:{requestedAt:now}});
   if(!user.accountConsent){
    await tx.accountConsent.create({data:{
     userId,locale:"de",termsVersion:"LEGACY_NOT_DOCUMENTED",privacyVersion:"LEGACY_NOT_DOCUMENTED",
     termsText:"Historische AGB-Zustimmung nicht dokumentiert",privacyNotice:"Historischer Datenschutzhinweis nicht dokumentiert",
     acceptedAt:null,marketingText:consentCopy.de.marketing,marketingRequestedAt:now
    }});
   }else if(!activeConsent){
    await tx.accountConsent.update({where:{userId},data:{
     marketingRequestedAt:now,marketingWithdrawnAt:null,marketingConfirmedAt:null,marketingText:consentCopy.de.marketing,locale:"de"
    }});
   }
   if(activeConsent)await grantLegacyNewsletterReward(tx,userId,now);
  });
  if(activeConsent){
   await emailLegacyNewsletterReward(userId);
   return Response.json({status:"granted"},{headers:{"Cache-Control":"private, no-store"}});
  }
  const sent=await sendNewsletterConfirmation(userId);
  return Response.json({status:sent?"confirmation_sent":"pending"},{headers:{"Cache-Control":"private, no-store"}});
 }catch(e){console.error("[LEGACY_NEWSLETTER_REWARD]",e);return Response.json({error:"UNAVAILABLE"},{status:503});}
}
