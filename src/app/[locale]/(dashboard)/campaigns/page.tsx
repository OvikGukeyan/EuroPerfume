import {prisma} from "@/prisma/prisma-client";
import {Prisma,UserRole} from "@prisma/client";
import {getUserSession} from "@/src/shared/server-lib/get-user-session";
import {MarketingConsole} from "@/src/shared/components/shared/marketing-console";
import {redirect} from "next/navigation";
export const dynamic="force-dynamic";
export default async function MarketingPage({params}:{params:Promise<{locale:string}>}){
 const session=await getUserSession();if(!session||session.role!==UserRole.ADMIN)redirect("/not-auth");
 const {locale}=await params,ru=locale==="ru";
 const audience={verified:{not:null},accountConsent:{is:{marketingConfirmedAt:{not:null},marketingWithdrawnAt:null}}} as const;
 const [all,noOrders,withOrders]=await Promise.all([
  prisma.user.count({where:audience}),
  prisma.user.count({where:{...audience,orders:{none:{}}}}),
  prisma.user.count({where:{...audience,orders:{some:{}}}})
 ]);
 let ready=true;
 let campaigns:{id:string;name:string;segment:string;status:string;subjectRu:string;subjectDe:string;sent:number;total:number}[]=[];
 try{
  const rows=await prisma.marketingCampaign.findMany({orderBy:{createdAt:"desc"},take:30,
   select:{id:true,name:true,segment:true,status:true,subjectRu:true,subjectDe:true,_count:{select:{deliveries:true}}}});
  const mapped=await Promise.all(rows.map(async r=>({...r,sent:await prisma.marketingDelivery.count({where:{campaignId:r.id,status:"SENT"}})})));
  campaigns=mapped.map(r=>({id:r.id,name:r.name,segment:r.segment,status:r.status,subjectRu:r.subjectRu,subjectDe:r.subjectDe,sent:r.sent,total:r._count.deliveries}));
 }catch(e){
  if(e instanceof Prisma.PrismaClientKnownRequestError&&(e.code==="P2021"||e.code==="P2022"))ready=false;
  else throw e;
 }
 return <main className="mx-auto max-w-[1350px] px-4 py-6 md:px-8">
  <p className="text-[11px] uppercase tracking-[.2em] text-[#92766e]">EURO PERFUME · CRM</p>
  <h1 className="mt-2 text-[30px] font-normal">{ru?"Рассылки и удержание клиентов":"Newsletter und Kundenbindung"}</h1>
  <p className="mb-7 mt-3 max-w-3xl text-sm leading-6 text-neutral-600">{ru?"Клиенты Shopify не участвуют. Письма можно отправлять только покупателям с подтверждённой подпиской на Vercel. Email гостевых заказов не используются для автоматического маркетинга.":"Keine Shopify-Kunden; nur bestätigte Vercel-Einwilligungen. Gastbestellungs-Adressen werden nicht für automatische Werbung verwendet."}</p>
  <MarketingConsole ready={ready} counts={{all,noOrders,withOrders}} campaigns={campaigns}/>
 </main>;
}
