import {prisma} from "@/prisma/prisma-client";
import {sendWelcomeOfferIfConsented} from "@/src/shared/server-lib/welcome-offer-mail";
import {NextRequest,NextResponse} from "next/server";

export const dynamic="force-dynamic";
export const runtime="nodejs";
export async function GET(req:NextRequest){
 const locale=req.nextUrl.searchParams.get("locale")==="ru"?"ru":"de";
 const code=req.nextUrl.searchParams.get("code")||"";
 const result=(state:string,includeCode=false)=>{
  const url=new URL(`/${locale}/verify`,req.url);
  url.searchParams.set("state",state);
  if(includeCode)url.searchParams.set("code",code);
  return NextResponse.redirect(url,{headers:{"Cache-Control":"no-store","Referrer-Policy":"no-referrer"}});
 };
 if(!/^(?:v2_)?[a-f0-9]{64}$/.test(code))return result("invalid");
 try{
  const record=await prisma.verificationCode.findFirst({where:{code},include:{user:{select:{verified:true}}}});
  if(!record)return result("invalid");
  // Do not delete a used token: subsequent clicks must show "already verified".
  if(record.user.verified)return result("already");
  if(record.expiresAt<=new Date())return result("expired",true);
  const verification=await prisma.$transaction(async tx=>{
   const existing=await tx.verificationCode.findFirst({where:{code},include:{user:{select:{verified:true}}}});
   if(!existing)return "invalid";
   if(existing.user.verified)return "already";
   if(existing.expiresAt<=new Date())return "expired";
   const verifiedAt=new Date();
   await tx.user.update({where:{id:existing.userId},data:{verified:verifiedAt}});
   // Only registrations in the new ONE-EMAIL workflow qualify here:
   // historical registrations had separate newsletter confirmationSentAt.
   // A voluntary opt-in was stored at signup; the link verifies ownership.
   if(existing.code.startsWith("v2_"))await tx.accountConsent.updateMany({
    where:{userId:existing.userId,marketingRequestedAt:{not:null},marketingConfirmedAt:null,
     marketingWithdrawnAt:null,confirmationSentAt:null},
    data:{marketingConfirmedAt:verifiedAt}
   });
   return existing.userId;
  });
  if(verification==="invalid")return result("invalid");
  if(verification==="already")return result("already");
  if(verification==="expired")return result("expired",true);
  await sendWelcomeOfferIfConsented(verification).catch(e=>console.error("[WELCOME_EMAIL]",e));
  return result("verified");
 }catch(e){console.error("[VERIFY_EMAIL]",e);return result("unavailable");}
}
