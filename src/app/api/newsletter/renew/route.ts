import {prisma} from "@/prisma/prisma-client";
import {tokenHash,sendNewsletterConfirmation} from "@/src/shared/server-lib/registration-consent";
export const runtime="nodejs";
export async function POST(req:Request){
 const origin=new URL(req.url).origin;
 if(req.headers.get("origin")!==origin)return new Response("Forbidden",{status:403});
 let token="",locale:"ru"|"de"="de";
 try{const form=await req.formData();token=String(form.get("token")||"");locale=form.get("locale")==="ru"?"ru":"de";}
 catch{return new Response("Invalid input",{status:400});}
 const result=(state:string)=>Response.redirect(new URL(`/${locale}/newsletter?result=${state}`,origin),303);
 if(!/^[a-f0-9]{64}$/.test(token))return result("invalid");
 try{
  const record=await prisma.accountConsent.findUnique({where:{confirmationTokenHash:tokenHash(token)},
   select:{userId:true,marketingRequestedAt:true,marketingConfirmedAt:true,marketingWithdrawnAt:true}});
  if(!record)return result("invalid");
  if(record.marketingConfirmedAt)return result("already");
  if(!record.marketingRequestedAt||record.marketingWithdrawnAt)return result("invalid");
  const user=await prisma.user.findUnique({where:{id:record.userId},select:{verified:true}});
  if(!user?.verified)return result("verify-account");
  const sent=await sendNewsletterConfirmation(record.userId);
  // Existing sender rate limits to 60 seconds. Do not leak delivery status.
  return result(sent?"resent":"wait");
 }catch(e){console.error("[RENEW_NEWSLETTER]",e);return result("unavailable");}
}