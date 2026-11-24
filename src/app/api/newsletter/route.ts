import {prisma} from '@/prisma/prisma-client';
import {tokenHash} from '@/src/shared/server-lib/registration-consent';
import {grantLegacyNewsletterReward,emailLegacyNewsletterReward} from "@/src/shared/server-lib/legacy-newsletter-reward";
import {sendWelcomeOfferIfConsented} from '@/src/shared/server-lib/welcome-offer-mail';
export const runtime='nodejs';
export async function POST(request:Request){
 const origin=request.headers.get('origin');
 const allowed=new Set(['https://euro-perfume-inky.vercel.app','https://europerfume.eu','https://www.europerfume.eu']);
 const site=request.headers.get('sec-fetch-site');
 if(site==='cross-site'||(origin!==null&&origin!=='null'&&origin!==new URL(request.url).origin&&!allowed.has(origin)))return new Response('Forbidden',{status:403});
 let locale='de',token='',result='invalid';
 try {
 const form=await request.formData();locale=form.get('locale')==='ru'?'ru':'de';
 token=String(form.get('token')||'');const action=form.get('action');
 if(/^[a-f0-9]{64}$/.test(token)){
 if(action==='confirm'){
 const hash=tokenHash(token);
 const confirmation=await prisma.$transaction(async tx=>{
  const consent=await tx.accountConsent.findFirst({where:{confirmationTokenHash:hash,confirmationExpiresAt:{gt:new Date()},marketingRequestedAt:{not:null},marketingConfirmedAt:null,marketingWithdrawnAt:null},select:{userId:true}});
  if(!consent)return null;
  const changed=await tx.accountConsent.updateMany({where:{userId:consent.userId,confirmationTokenHash:hash,confirmationExpiresAt:{gt:new Date()},marketingConfirmedAt:null,marketingWithdrawnAt:null},data:{marketingConfirmedAt:new Date(),confirmationExpiresAt:null}});
  if(!changed.count)return null;
  const reward=await grantLegacyNewsletterReward(tx,consent.userId);
  return {userId:consent.userId,reward:Boolean(reward)};
 },{maxWait:15000,timeout:20000});
 if(confirmation){
  result='confirmed';
  if(confirmation.reward)await emailLegacyNewsletterReward(confirmation.userId).catch(e=>console.error("[LEGACY_REWARD_EMAIL]",e));
  else await sendWelcomeOfferIfConsented(confirmation.userId).catch(e=>console.error("[WELCOME_EMAIL]",e));
 }else{
  // Distinguish used links from expired links without consuming another token.
  const prior=await prisma.accountConsent.findUnique({where:{confirmationTokenHash:hash},
   select:{marketingConfirmedAt:true,confirmationExpiresAt:true}});
  result=prior?.marketingConfirmedAt?'already':prior?.confirmationExpiresAt&&prior.confirmationExpiresAt<=new Date()?'expired':'invalid';
 }
 }else if(action==='unsubscribe'){
 const updated=await prisma.accountConsent.updateMany({where:{unsubscribeTokenHash:tokenHash(token)},data:{marketingWithdrawnAt:new Date(),confirmationTokenHash:null,confirmationExpiresAt:null}});
 if(updated.count)result='unsubscribed';
 }
 }
 } catch(e) {
  console.error('[NEWSLETTER_CONFIRM]',e instanceof Error?e.name:'Unknown error');
  result='unavailable';
 }
 const params=new URLSearchParams({result});
 if(result==='expired'&&/^[a-f0-9]{64}$/.test(token))params.set('token',token);
 return new Response(null,{status:303,headers:{Location:`/${locale}/newsletter?${params}`, 'Cache-Control':'no-store','Referrer-Policy':'no-referrer'}});
}
