import {prisma} from "@/prisma/prisma-client";
import {AdminCouponConsole} from "@/src/shared/components/shared/admin-coupon-console";
import {getUserSession} from "@/src/shared/server-lib/get-user-session";
import {UserRole,Prisma} from "@prisma/client";
import {redirect} from "next/navigation";
export const dynamic="force-dynamic";
export default async function CreatePromocode({params}:{params:Promise<{locale:string}>}){
 const session=await getUserSession();if(!session||session.role!==UserRole.ADMIN)redirect("/not-auth");
 const {locale}=await params,ru=locale==="ru";
 const codes=await prisma.promoCode.findMany({orderBy:{createdAt:"desc"}});
 let policies:Awaited<ReturnType<typeof prisma.couponPolicy.findMany>>=[];
 let ready=true;
 try{policies=await prisma.couponPolicy.findMany();}catch(e){
  if(e instanceof Prisma.PrismaClientKnownRequestError&&(e.code==="P2021"||e.code==="P2022"))ready=false;else throw e;
 }
 const byCode=new Map(policies.map(p=>[p.code,p]));
 const rows=codes.map(c=>{
  const p=byCode.get(c.code);
  return {code:c.code,discount:c.discount,active:c.isActive&&(!p||p.active),
   expiresAt:c.expiresAt?.toISOString()||null,disposable:c.disposable,
   kind:p?.kind||null,usedCount:p?.usedCount||0,epoch:p?.epoch||1,
   globalLimit:p?.globalLimit||null,perUserLimit:p?.perUserLimit||null,
   validDays:p?.validDaysAfterVerification||null};
 });
 return <main className="mx-auto max-w-[1360px] px-4 py-6 md:px-8">
  <p className="text-[11px] uppercase tracking-[.2em] text-[#92796e]">EURO PERFUME · CRM</p>
  <h1 className="mt-2 text-[30px] font-normal">{ru?"Промокоды и кампании":"Gutscheincodes und Kampagnen"}</h1>
  <p className="mb-7 mt-2 max-w-3xl text-sm leading-6 text-neutral-600">{ru?"Создавай общие коды для печатных карточек, ограничивай использование по аккаунтам и повторно запускай акции без удаления старой истории.":"Gemeinsame Codes für gedruckte Karten, Einlösungen je Konto und neue Aktionsperioden ohne Datenverlust."}</p>
  <AdminCouponConsole rows={rows} ready={ready}/>
 </main>;
}
