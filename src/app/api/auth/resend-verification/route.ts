import {prisma} from "@/prisma/prisma-client";
import {sendEmail} from "@/src/shared/lib/send-email";
import {UserVerificationTemplate} from "@/src/shared/components/shared/email-templates/user-verification";
import {randomBytes} from "node:crypto";
import {z} from "zod";
import {NextResponse} from "next/server";
const schema=z.object({email:z.string().email().max(254),locale:z.enum(["ru","de"])});
export async function POST(req:Request){
 if(req.headers.get("origin")!==new URL(req.url).origin)return NextResponse.json({error:"FORBIDDEN"},{status:403});
 let body:z.infer<typeof schema>;try{body=schema.parse(await req.json());}catch{return NextResponse.json({error:"INPUT"},{status:400});}
 // Do not reveal account existence or verification state.
 const ok=()=>NextResponse.json({ok:true});
 const email=body.email.trim().toLowerCase();
 try{
  const user=await prisma.user.findUnique({where:{email},select:{id:true,verified:true,email:true,accountConsent:{select:{marketingRequestedAt:true,marketingWithdrawnAt:true,marketingConfirmedAt:true,confirmationSentAt:true}}}});
  if(!user||user.verified)return ok();
  const old=await prisma.verificationCode.findUnique({where:{userId:user.id}});
  if(old&&Date.now()-old.createdAt.getTime()<15*60*1000)return ok();
  const code=(old?.code.startsWith("v2_")?"v2_":"")+randomBytes(32).toString("hex");
  await prisma.verificationCode.upsert({where:{userId:user.id},create:{userId:user.id,code,expiresAt:new Date(Date.now()+24*3600000)},
   update:{code,createdAt:new Date(),expiresAt:new Date(Date.now()+24*3600000)}});
  // Same combined email semantics on resend for new registrations.
  // Existing pre-migration opt-ins keep their separate confirmation flow.
  const marketingOptIn=Boolean(user.accountConsent?.marketingRequestedAt&&!user.accountConsent.marketingWithdrawnAt
   &&!user.accountConsent.marketingConfirmedAt&&!user.accountConsent.confirmationSentAt&&code.startsWith("v2_"));
  await sendEmail(user.email,body.locale==="ru"?"EURO PERFUME — Подтвердите email":"EURO PERFUME — E-Mail bestätigen",
   UserVerificationTemplate({code,locale:body.locale,marketingOptIn}));
  return ok();
 }catch(e){console.error("[RESEND_VERIFICATION]",e);return NextResponse.json({error:"UNAVAILABLE"},{status:503});}
}
