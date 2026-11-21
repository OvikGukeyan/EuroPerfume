import 'server-only';
import {createHash,randomBytes} from 'node:crypto';
import {prisma} from '@/prisma/prisma-client';
import {sendEmail} from '@/src/shared/lib/send-email';
import {consentCopy,CONSENT_REVISION} from '@/src/shared/lib/registration-consent';
import policies from '@/src/shared/content/legal-policies.json';
export function tokenHash(value:string){return createHash('sha256').update(value).digest('hex');}
export function consentVersion(document:string){return `${CONSENT_REVISION}:${tokenHash(document)}`;}
export async function sendNewsletterConfirmation(userId:number) {
 const user=await prisma.user.findUnique({where:{id:userId},select:{email:true,accountConsent:true}});
 const consent=user?.accountConsent;
 if(!user||!consent||!consent.marketingRequestedAt||consent.marketingWithdrawnAt||consent.marketingConfirmedAt)return false;
 // A client cannot repeatedly generate mail through the account screen.
 if(consent.confirmationSentAt&&Date.now()-consent.confirmationSentAt.getTime()<60000)return false;
 const token=randomBytes(32).toString('hex');const unsubscribeToken=randomBytes(32).toString('hex');
 const claim=await prisma.accountConsent.updateMany({where:{userId,marketingRequestedAt:{not:null},marketingConfirmedAt:null,marketingWithdrawnAt:null,OR:[{confirmationSentAt:null},{confirmationSentAt:{lt:new Date(Date.now()-60000)}}]},data:{confirmationTokenHash:tokenHash(token),confirmationExpiresAt:new Date(Date.now()+48*60*60*1000),confirmationSentAt:new Date(),unsubscribeTokenHash:tokenHash(unsubscribeToken)}});
 if(!claim.count)return false;
 const locale='de';const ru=false;
 // Fixed shop origin: never construct confirmation links from an untrusted Host header.
 const base='https://euro-perfume-inky.vercel.app';
 const confirmUrl=`${base}/${locale}/newsletter?token=${token}`;
 const unsubscribeUrl=`${base}/${locale}/newsletter?unsubscribe=${unsubscribeToken}`;
 const result=await sendEmail(user.email,ru?'EURO PERFUME — подтвердите подписку':'EURO PERFUME — Newsletter-Anmeldung bestätigen',<div style={{fontFamily:'Arial,sans-serif',maxWidth:580,margin:'auto',color:'#252624',lineHeight:1.7}}><p style={{letterSpacing:3}}>EURO PERFUME</p><h1 style={{fontSize:25,fontWeight:400}}>{ru?'Подтвердите подписку':'Bitte bestätige deine Anmeldung'}</h1><p>{consentCopy[locale].marketing}</p><p><a href={confirmUrl}>{ru?'Открыть подтверждение подписки':'Newsletter-Anmeldung bestätigen'}</a></p><p>{ru?'Ссылка действует 48 часов. Подписка активируется только после подтверждения на открывшейся странице. Если вы не запрашивали подписку, проигнорируйте письмо.':'Der Link ist 48 Stunden gültig. Die Anmeldung wird erst nach deiner Bestätigung auf der geöffneten Seite aktiviert. Wenn du diese Anmeldung nicht angefordert hast, ignoriere diese E-Mail.'}</p><p><a href={unsubscribeUrl}>{ru?'Отменить подписку':'Anmeldung widerrufen'}</a> · <a href={`${base}/${locale}/data-protection`}>{ru?'Конфиденциальность':'Datenschutz'}</a> · <a href={`${base}/${locale}/impressum`}>Impressum</a></p></div>);
 await prisma.accountConsent.updateMany({where:{userId,confirmationTokenHash:tokenHash(token)},data:{confirmationSentAt:new Date(),confirmationEmailId:result?.id||null}});
 return true;
}
export function legalConsentData(locale:'ru'|'de',marketing:boolean){return {locale,termsVersion:consentVersion(policies.agb),privacyVersion:consentVersion(policies.privacy),termsText:consentCopy[locale].terms,privacyNotice:consentCopy[locale].privacy,marketingText:consentCopy[locale].marketing,marketingRequestedAt:marketing?new Date():null};}
