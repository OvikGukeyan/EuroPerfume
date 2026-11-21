import "server-only";
import React from "react";
import {prisma} from "@/prisma/prisma-client";
import {Prisma} from "@prisma/client";
import {sendEmail} from "@/src/shared/lib/send-email";
import {welcomeExpiresAt} from "@/src/shared/lib/europerfume-club";
import {marketingOptOutToken} from "@/src/shared/server-lib/marketing-optout";
const base="https://euro-perfume-inky.vercel.app";
/** Optional one-off offer only for double-opt-in subscribers. Non-subscribers see it in their account. */
export async function sendWelcomeOfferIfConsented(userId:number):Promise<boolean>{
 const user=await prisma.user.findUnique({where:{id:userId},select:{id:true,email:true,fullName:true,verified:true,
  accountConsent:{select:{locale:true,marketingConfirmedAt:true,marketingWithdrawnAt:true}}}});
 if(!user?.verified||!user.accountConsent?.marketingConfirmedAt||user.accountConsent.marketingWithdrawnAt)return false;
 const promo=await prisma.promoCode.findFirst({where:{code:{equals:"WELCOME10",mode:"insensitive"}}});
 if(!promo?.isActive||promo.discount!==10)return false;
 let policy;
 try{policy=await prisma.couponPolicy.findUnique({where:{code:promo.code}});}
 catch(e){if(e instanceof Prisma.PrismaClientKnownRequestError&&(e.code==="P2021"||e.code==="P2022"))return false;throw e;}
 if(!policy?.active||policy.kind!=="WELCOME")return false;
 const expiry=welcomeExpiresAt(user.verified,policy.validDaysAfterVerification||60);
 if(new Date()>=expiry)return false;
 const prior=await prisma.order.count({where:{userId}});
 if(prior)return false;
 try{await prisma.welcomeNotice.create({data:{userId}});}
 catch(e){if(e instanceof Prisma.PrismaClientKnownRequestError&&(e.code==="P2002"||e.code==="P2021"))return false;throw e;}
 const ru=user.accountConsent.locale==="ru",locale=ru?"ru":"de";
 const url=`${base}/${locale}/newsletter/leave?token=${encodeURIComponent(marketingOptOutToken(userId))}`;
 try{
  await sendEmail(user.email,ru?"EURO PERFUME — ваш приветственный подарок":"EURO PERFUME — dein Willkommensvorteil",
  <div style={{fontFamily:"Arial,sans-serif",maxWidth:560,margin:"auto",color:"#262626",lineHeight:1.7}}>
   <p style={{letterSpacing:3,fontSize:14}}>EURO PERFUME</p>
   <h1 style={{fontSize:26,fontWeight:400}}>{ru?"Спасибо за регистрацию!":"Vielen Dank für deine Registrierung!"}</h1>
   <p>{ru?"Ваш email подтверждён. Для первой покупки в вашем аккаунте доступен приветственный промокод:":"Deine E-Mail-Adresse ist bestätigt. Für deine erste Bestellung wartet dieser Gutscheincode auf dich:"}</p>
   <p style={{display:"inline-block",border:"1px solid #cfc3bf",padding:"12px 24px",fontSize:26,fontWeight:500,letterSpacing:2}}>WELCOME10</p>
   <p>{ru?"10% на первую покупку. Код действует один раз и не распространяется на Sale, Товар дня или товары подарочных акций. Доставка не включена.":"10 % auf deinen ersten Einkauf. Einmalig, nicht auf Sale, Tagesangebote und Artikel mit Aktionsgeschenk; kein Rabatt auf Versand."}</p>
   <p>{ru?"Действует до: ":"Gültig bis: "}{expiry.toLocaleDateString(ru?"ru-RU":"de-DE",{timeZone:"Europe/Berlin"})}</p>
   <p><a href={`${base}/${locale}/profile`}>{ru?"Открыть личный кабинет":"Zum Kundenkonto"}</a></p>
   <hr/><p style={{fontSize:12,color:"#666"}}>{ru?"Это письмо с приветственным предложением отправлено после подтверждения согласия на рассылку.":"Diese Willkommensaktion wurde nach bestätigter Newsletter-Einwilligung versendet."} <a href={url}>{ru?"Отписаться от рекламы":"Newsletter abbestellen"}</a> · <a href={`${base}/${locale}/data-protection`}>{ru?"Конфиденциальность":"Datenschutz"}</a> · <a href={`${base}/${locale}/impressum`}>Impressum</a></p>
  </div>);
  await prisma.welcomeNotice.update({where:{userId},data:{sentAt:new Date()}});
  return true;
 }catch(e){console.error("[WELCOME_COUPON_EMAIL]",e);return false;}
}
