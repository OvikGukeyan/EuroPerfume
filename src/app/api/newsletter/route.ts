import {prisma} from '@/prisma/prisma-client';
import {tokenHash} from '@/src/shared/server-lib/registration-consent';
import {sendWelcomeOfferIfConsented} from '@/src/shared/server-lib/welcome-offer-mail';
export const runtime='nodejs';
export async function POST(request:Request){
 if(request.headers.get('origin')!==new URL(request.url).origin)return new Response('Forbidden',{status:403});
 const form=await request.formData();const locale=form.get('locale')==='ru'?'ru':'de';
 const token=String(form.get('token')||'');const action=form.get('action');
 let result='invalid';
 if(/^[a-f0-9]{64}$/.test(token)){
 if(action==='confirm'){
 const hash=tokenHash(token);
 const consent=await prisma.accountConsent.findFirst({where:{confirmationTokenHash:hash,confirmationExpiresAt:{gt:new Date()},marketingRequestedAt:{not:null},marketingConfirmedAt:null,marketingWithdrawnAt:null},select:{userId:true}});
 const updated=await prisma.accountConsent.updateMany({where:{confirmationTokenHash:hash,confirmationExpiresAt:{gt:new Date()},marketingRequestedAt:{not:null},marketingConfirmedAt:null,marketingWithdrawnAt:null},data:{marketingConfirmedAt:new Date(),confirmationTokenHash:null,confirmationExpiresAt:null}});
 if(updated.count){result='confirmed';if(consent)await sendWelcomeOfferIfConsented(consent.userId).catch(e=>console.error('[WELCOME_EMAIL]',e));}
 }else if(action==='unsubscribe'){
 const updated=await prisma.accountConsent.updateMany({where:{unsubscribeTokenHash:tokenHash(token)},data:{marketingWithdrawnAt:new Date(),confirmationTokenHash:null,confirmationExpiresAt:null}});
 if(updated.count)result='unsubscribed';
 }
 }
 return Response.redirect(new URL(`/${locale}/newsletter?result=${result}`,request.url),303);
}
