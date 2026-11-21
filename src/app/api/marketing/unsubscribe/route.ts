import {optOutUserId} from "@/src/shared/server-lib/marketing-optout";
import {prisma} from "@/prisma/prisma-client";
export async function POST(request:Request){
 if(request.headers.get("origin")!==new URL(request.url).origin)return new Response("Forbidden",{status:403});
 const form=await request.formData();
 const token=String(form.get("token")||"");
 const userId=optOutUserId(token);
 const locale=form.get("locale")==="ru"?"ru":"de";
 if(userId!==null){
  await prisma.accountConsent.updateMany({where:{userId},data:{
   marketingWithdrawnAt:new Date(),confirmationTokenHash:null,confirmationExpiresAt:null
  }});
 }
 return Response.redirect(new URL(`/${locale}/newsletter?result=${userId===null?"invalid":"unsubscribed"}`,request.url),303);
}
