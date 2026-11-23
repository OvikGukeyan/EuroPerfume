import {randomBytes} from "node:crypto";
import {prisma} from "@/prisma/prisma-client";
import {sendEmail} from "@/src/shared/lib/send-email";
import {UserVerificationTemplate} from "@/src/shared/components/shared/email-templates/user-verification";
export const runtime="nodejs";
export async function POST(req:Request){
 const origin=new URL(req.url).origin;
 if(req.headers.get("origin")!==origin)return new Response("Forbidden",{status:403});
 let code="",locale:"ru"|"de"="de";
 try{const form=await req.formData();code=String(form.get("code")||"");locale=form.get("locale")==="ru"?"ru":"de";}
 catch{return new Response("Invalid input",{status:400});}
 const redirect=(state:string)=>Response.redirect(new URL(`/${locale}/verify?state=${state}`,origin),303);
 if(!/^[a-f0-9]{64}$/.test(code))return redirect("invalid");
 try{
  const existing=await prisma.verificationCode.findFirst({
   where:{code},include:{user:{select:{id:true,email:true,verified:true,accountConsent:{select:{marketingRequestedAt:true,marketingWithdrawnAt:true,marketingConfirmedAt:true,confirmationSentAt:true}}}}}
  });
  if(!existing)return redirect("invalid");
  if(existing.user.verified)return redirect("already");
  // A single old verification token is usable to renew only its original account.
  // Rate limit by token creation time, independent of email enumeration.
  if(Date.now()-existing.createdAt.getTime()<15*60*1000)return redirect("resent");
  const next=randomBytes(32).toString("hex"),now=new Date();
  const updated=await prisma.verificationCode.updateMany({
   where:{id:existing.id,code,createdAt:{lt:new Date(Date.now()-15*60*1000)}},
   data:{code:next,createdAt:now,expiresAt:new Date(now.getTime()+24*3600000)}
  });
  if(!updated.count)return redirect("resent");
  const marketingOptIn=Boolean(existing.user.accountConsent?.marketingRequestedAt
   &&!existing.user.accountConsent.marketingWithdrawnAt
   &&!existing.user.accountConsent.marketingConfirmedAt
   &&!existing.user.accountConsent.confirmationSentAt);
  await sendEmail(existing.user.email,locale==="ru"?"EURO PERFUME — Подтвердите email":"EURO PERFUME — E-Mail-Adresse bestätigen",
   UserVerificationTemplate({code:next,locale,marketingOptIn}));
  return redirect("resent");
 }catch(error){console.error("[RENEW_VERIFICATION]",error);return redirect("unavailable");}
}