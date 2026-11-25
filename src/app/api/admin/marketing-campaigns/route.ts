import React from "react";
import {z} from "zod";
import {NextResponse} from "next/server";
import {prisma} from "@/prisma/prisma-client";
import {getUserSession} from "@/src/shared/server-lib/get-user-session";
import {marketingOptOutToken} from "@/src/shared/server-lib/marketing-optout";
import {sendEmail} from "@/src/shared/lib/send-email";
import {Prisma,UserRole} from "@prisma/client";
import {PallasPromoNewsletter} from "@/src/shared/components/shared/email-templates/pallas-promo-newsletter";
import {
 PALLAS_NEWSLETTER_ID, PALLAS_NEWSLETTER_NAME, PALLAS_NEWSLETTER_SUBJECT,
 PALLAS_NEWSLETTER_APPROVED_AT, PALLAS_NEWSLETTER_MAX_RECIPIENTS
} from "@/src/shared/lib/pallas-promo-newsletter";
import {pallasNewsletterPromoReady} from "@/src/shared/server-lib/pallas-newsletter-promo-ready";

const payload=z.discriminatedUnion("action",[
 z.object({action:z.literal("create_pallas_draft")}).strict(),
 z.object({action:z.literal("create"),name:z.string().trim().min(3).max(100),
  segment:z.enum(["ALL","NO_ORDERS","WITH_ORDERS"]),
  subjectRu:z.string().trim().min(4).max(130),subjectDe:z.string().trim().min(4).max(130),
  bodyRu:z.string().trim().min(10).max(4000),bodyDe:z.string().trim().min(10).max(4000)}),
 z.object({action:z.enum(["activate","pause","send_next"]),id:z.string().uuid()})
]);
const base="https://euro-perfume-inky.vercel.app";
function audience(segment:string){
 return {
  verified:{not:null},
  accountConsent:{is:{marketingConfirmedAt:{not:null},marketingWithdrawnAt:null}},
  ...(segment==="NO_ORDERS"?{orders:{none:{}}}:segment==="WITH_ORDERS"?{orders:{some:{}}}:{})
 } as const;
}
export async function POST(request:Request){
 const admin=await getUserSession();
 if(!admin||admin.role!==UserRole.ADMIN)return NextResponse.json({error:"FORBIDDEN"},{status:403});
 if(request.headers.get("origin")!==new URL(request.url).origin)return NextResponse.json({error:"ORIGIN"},{status:403});
 let input:z.infer<typeof payload>;
 try{input=payload.parse(await request.json());}catch{return NextResponse.json({error:"INPUT"},{status:400});}
 try{
  if(input.action==="create_pallas_draft"){
   const existing=await prisma.marketingCampaign.findUnique({where:{id:PALLAS_NEWSLETTER_ID},select:{id:true}});
   if(existing)return NextResponse.json({ok:true,id:existing.id});
   const cutoff=new Date(PALLAS_NEWSLETTER_APPROVED_AT);
   const recipients=await prisma.user.findMany({
    where:{createdAt:{lte:cutoff},verified:{not:null,lte:cutoff},
     accountConsent:{is:{marketingConfirmedAt:{not:null,lte:cutoff},marketingWithdrawnAt:null}}},
    select:{id:true},orderBy:{id:"asc"},take:PALLAS_NEWSLETTER_MAX_RECIPIENTS+1
   });
   // Never offer to send to a broader audience than the approved cohort.
   if(!recipients.length||recipients.length>PALLAS_NEWSLETTER_MAX_RECIPIENTS)
    return NextResponse.json({error:"PALLAS_AUDIENCE_CHANGED"},{status:409});
   try{
    await prisma.marketingCampaign.create({data:{
     id:PALLAS_NEWSLETTER_ID,name:PALLAS_NEWSLETTER_NAME,segment:"ALL",
     subjectRu:PALLAS_NEWSLETTER_SUBJECT,subjectDe:PALLAS_NEWSLETTER_SUBJECT,
     bodyRu:"Фиксированный шаблон Pallas Athene (RU/DE).",bodyDe:"Festes Pallas-Athene-Template (RU/DE).",
     deliveries:{create:recipients.map(user=>({userId:user.id,status:"QUEUED"}))}
    }});
   }catch(e){
    if(!(e instanceof Prisma.PrismaClientKnownRequestError&&e.code==="P2002"))throw e;
    const created=await prisma.marketingCampaign.findUnique({where:{id:PALLAS_NEWSLETTER_ID},select:{id:true}});
    if(!created)throw e;
   }
   return NextResponse.json({ok:true,id:PALLAS_NEWSLETTER_ID,queued:recipients.length});
  }
  if(input.action==="create"){
   const created=await prisma.marketingCampaign.create({data:{
    name:input.name,segment:input.segment,subjectRu:input.subjectRu,subjectDe:input.subjectDe,
    bodyRu:input.bodyRu,bodyDe:input.bodyDe
   }});
   return NextResponse.json({ok:true,id:created.id});
  }
  const campaign=await prisma.marketingCampaign.findUnique({where:{id:input.id}});
  if(!campaign)return NextResponse.json({error:"NOT_FOUND"},{status:404});
  const pallas=campaign.id===PALLAS_NEWSLETTER_ID;
  if(input.action==="activate"||input.action==="pause"){
   if(pallas&&input.action==="activate"&&(campaign.status==="DONE"||!await pallasNewsletterPromoReady()))
    return NextResponse.json({error:"PALLAS_PROMO_NOT_READY"},{status:409});
   const status=input.action==="activate"?"ACTIVE":"PAUSED";
   await prisma.marketingCampaign.update({where:{id:campaign.id},data:{status}});
   return NextResponse.json({ok:true,status});
  }
  if(campaign.status!=="ACTIVE")return NextResponse.json({error:"NOT_ACTIVE"},{status:400});
  if(pallas&&!await pallasNewsletterPromoReady())
   return NextResponse.json({error:"PALLAS_PROMO_NOT_READY"},{status:409});
  // Deliberately small manual batches; no background sending or unconsented recipients.
  const users=pallas
   ?(await prisma.marketingDelivery.findMany({where:{campaignId:campaign.id,status:"QUEUED"},
      select:{user:{select:{id:true,email:true}}},take:5,orderBy:{userId:"asc"}})).map(row=>row.user)
   :await prisma.user.findMany({where:{...audience(campaign.segment),
    marketingDeliveries:{none:{campaignId:campaign.id}}
   },select:{id:true,email:true},take:5,orderBy:{id:"asc"}});
  if(!users.length){
   if(pallas&&await prisma.marketingDelivery.count({where:{campaignId:campaign.id,status:"SENDING"}}))
    return NextResponse.json({ok:true,sent:0,failed:0,done:false});
   await prisma.marketingCampaign.update({where:{id:campaign.id},data:{status:"DONE"}});
   return NextResponse.json({ok:true,sent:0,failed:0,done:true});
  }
  const {randomUUID}=await import("node:crypto");
  if(!pallas)await prisma.marketingDelivery.createMany({data:users.map(user=>({id:randomUUID(),campaignId:campaign.id,userId:user.id,status:"QUEUED"})),skipDuplicates:true});
  let sent=0,failed=0;
  for(const user of users){
   // Atomic claim: concurrent admin requests cannot send twice.
   const claimed=await prisma.marketingDelivery.updateMany({where:{campaignId:campaign.id,userId:user.id,status:"QUEUED"},data:{status:"SENDING"}});
   if(!claimed.count)continue;
   try{
    // Check subscription again immediately before delivery.
    const current=pallas?await prisma.user.findFirst({where:{id:user.id,...audience("ALL"),
     accountConsent:{is:{marketingConfirmedAt:{not:null,lte:new Date(PALLAS_NEWSLETTER_APPROVED_AT)},marketingWithdrawnAt:null}}},
     select:{email:true}}):null;
    if(pallas){if(!current)throw new Error("CONSENT_WITHDRAWN");}
    else {
     const consent=await prisma.accountConsent.findUnique({where:{userId:user.id},select:{marketingConfirmedAt:true,marketingWithdrawnAt:true}});
     if(!consent?.marketingConfirmedAt||consent.marketingWithdrawnAt)throw new Error("CONSENT_WITHDRAWN");
    }
    const ru=false,locale="de";
    const subject=campaign.subjectDe;
    const body=campaign.bodyDe;
    const unsubscribeUrl=`${base}/${locale}/newsletter/leave?token=${encodeURIComponent(marketingOptOutToken(user.id))}`;
    const result=pallas
     ?await sendEmail(current!.email,PALLAS_NEWSLETTER_SUBJECT,React.createElement(PallasPromoNewsletter,{unsubscribeUrl}))
     :await sendEmail(user.email,subject,React.createElement("div",{style:{fontFamily:"Arial,sans-serif",maxWidth:580,margin:"auto",lineHeight:1.7,color:"#242424"}},
     React.createElement("p",{style:{letterSpacing:"3px"}},"EURO PERFUME"),
     React.createElement("p",{style:{whiteSpace:"pre-line"}},body),
     React.createElement("hr"),
     React.createElement("p",{style:{fontSize:12,color:"#666"}},
       ru?"Вы получили письмо, поскольку подтвердили согласие на рассылку. ":"Du erhältst diese Mail nach bestätigter Newsletter-Einwilligung. ",
       React.createElement("a",{href:unsubscribeUrl},ru?"Отписаться":"Newsletter abbestellen"),
       " · ",React.createElement("a",{href:`${base}/${locale}/data-protection`},ru?"Конфиденциальность":"Datenschutz"),
       " · ",React.createElement("a",{href:`${base}/${locale}/impressum`},"Impressum")
     )));
    await prisma.marketingDelivery.updateMany({where:{campaignId:campaign.id,userId:user.id,status:"SENDING"},data:{status:"SENT",sentAt:new Date(),providerId:result?.id||null}});
    sent++;
   }catch(e){
    failed++;
    await prisma.marketingDelivery.updateMany({where:{campaignId:campaign.id,userId:user.id,status:"SENDING"},data:{status:"FAILED",lastError:String(e instanceof Error?e.message:"SEND_FAILED").slice(0,150)}});
   }
  }
  return NextResponse.json({ok:true,sent,failed,done:false});
 }catch(e){
  const err=e as {code?:string};
  return NextResponse.json({error:err.code==="P2021"?"MIGRATION_REQUIRED":"FAILED"},{status:err.code==="P2021"?503:500});
 }
}
