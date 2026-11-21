import React from "react";
import {z} from "zod";
import {NextResponse} from "next/server";
import {prisma} from "@/prisma/prisma-client";
import {getUserSession} from "@/src/shared/server-lib/get-user-session";
import {marketingOptOutToken} from "@/src/shared/server-lib/marketing-optout";
import {sendEmail} from "@/src/shared/lib/send-email";
import {UserRole} from "@prisma/client";

const payload=z.discriminatedUnion("action",[
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
  if(input.action==="create"){
   const created=await prisma.marketingCampaign.create({data:{
    name:input.name,segment:input.segment,subjectRu:input.subjectRu,subjectDe:input.subjectDe,
    bodyRu:input.bodyRu,bodyDe:input.bodyDe
   }});
   return NextResponse.json({ok:true,id:created.id});
  }
  const campaign=await prisma.marketingCampaign.findUnique({where:{id:input.id}});
  if(!campaign)return NextResponse.json({error:"NOT_FOUND"},{status:404});
  if(input.action==="activate"||input.action==="pause"){
   const status=input.action==="activate"?"ACTIVE":"PAUSED";
   await prisma.marketingCampaign.update({where:{id:campaign.id},data:{status}});
   return NextResponse.json({ok:true,status});
  }
  if(campaign.status!=="ACTIVE")return NextResponse.json({error:"NOT_ACTIVE"},{status:400});
  // Deliberately small manual batches; no background sending or unconsented recipients.
  const users=await prisma.user.findMany({where:{...audience(campaign.segment),
    marketingDeliveries:{none:{campaignId:campaign.id}}
   },select:{id:true,email:true,accountConsent:{select:{locale:true}}},take:5,orderBy:{id:"asc"}});
  if(!users.length){
   await prisma.marketingCampaign.update({where:{id:campaign.id},data:{status:"DONE"}});
   return NextResponse.json({ok:true,sent:0,failed:0,done:true});
  }
  const {randomUUID}=await import("node:crypto");
  await prisma.marketingDelivery.createMany({data:users.map(user=>({id:randomUUID(),campaignId:campaign.id,userId:user.id,status:"QUEUED"})),skipDuplicates:true});
  let sent=0,failed=0;
  for(const user of users){
   // Atomic claim: concurrent admin requests cannot send twice.
   const claimed=await prisma.marketingDelivery.updateMany({where:{campaignId:campaign.id,userId:user.id,status:"QUEUED"},data:{status:"SENDING"}});
   if(!claimed.count)continue;
   try{
    // Check subscription again immediately before delivery.
    const consent=await prisma.accountConsent.findUnique({where:{userId:user.id},select:{locale:true,marketingConfirmedAt:true,marketingWithdrawnAt:true}});
    if(!consent?.marketingConfirmedAt||consent.marketingWithdrawnAt)throw new Error("CONSENT_WITHDRAWN");
    const ru=consent.locale==="ru",locale=ru?"ru":"de";
    const subject=ru?campaign.subjectRu:campaign.subjectDe;
    const body=ru?campaign.bodyRu:campaign.bodyDe;
    const unsubscribeUrl=`${base}/${locale}/newsletter/leave?token=${encodeURIComponent(marketingOptOutToken(user.id))}`;
    const result=await sendEmail(user.email,subject,React.createElement("div",{style:{fontFamily:"Arial,sans-serif",maxWidth:580,margin:"auto",lineHeight:1.7,color:"#242424"}},
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
