import {prisma} from "@/prisma/prisma-client";
import {getUserSession} from "@/src/shared/server-lib/get-user-session";
import {UserRole} from "@prisma/client";
import {notFound,redirect} from "next/navigation";
import {Link} from "@/src/i18n/navigation";
import {berlinZone,pageNumber,scalar} from "@/src/shared/server-lib/admin-insights-metrics";

export const dynamic="force-dynamic";
type Search = Record<string,string|string[]|undefined>;

export default async function CampaignDetail({params,searchParams}:{params:Promise<{locale:string;id:string}>;searchParams:Promise<Search>}) {
 const admin=await getUserSession();
 if(!admin||admin.role!==UserRole.ADMIN)redirect("/not-auth");
 const [{locale,id},sp]=await Promise.all([params,searchParams]);
 if(!/^[a-zA-Z0-9_-]{1,80}$/.test(id))notFound();
 const ru=locale==="ru",page=pageNumber(sp.page),filter=scalar(sp.status);
 const statuses=[["SENT",ru?"Принято провайдером":"Angenommen"],["FAILED",ru?"Ошибка":"Fehlgeschlagen"],["QUEUED",ru?"Ожидает":"Wartend"],["SENDING",ru?"В обработке":"In Bearbeitung"]] as const;
 const status=statuses.some(([code])=>code===filter)?filter:"";
 const where={campaignId:id,...(status?{status}:{})};
 const [campaign,counts,rows]=await Promise.all([
  prisma.marketingCampaign.findUnique({where:{id},select:{name:true,status:true}}),
  prisma.marketingDelivery.groupBy({by:["status"],where:{campaignId:id},_count:{_all:true}}),
  prisma.marketingDelivery.findMany({where,orderBy:[{updatedAt:"desc"},{id:"desc"}],skip:(page-1)*30,take:30,select:{id:true,userId:true,status:true,sentAt:true,updatedAt:true,user:{select:{fullName:true}}}})
 ]);
 if(!campaign)notFound();
 const count=(s:string)=>counts.find(x=>x.status===s)?._count._all??0;
 const total=counts.reduce((n,x)=>n+x._count._all,0);
 const visible=status?count(status):total;
 const url=(s:string,n:number)=>({pathname:"/insights/campaign/"+id,query:{...(s?{status:s}:{}),...(n>1?{page:String(n)}:{})}});
 const fmt=(d:Date)=>d.toLocaleString(ru?"ru-RU":"de-DE",{timeZone:berlinZone,dateStyle:"short",timeStyle:"short"});
 return <main className="mx-auto max-w-[950px] space-y-5 px-4 py-7 md:px-8">
  <nav className="flex flex-wrap gap-4 text-sm"><Link href="/insights" className="underline">{ru?"Аналитика":"Analysen"}</Link><Link href="/campaigns" className="underline">{ru?"Рассылки":"Newsletter"}</Link></nav>
  <header><h1 className="text-3xl">{campaign.name}</h1><p className="mt-2 text-sm text-neutral-600">{campaign.status} · {ru?"Вся история. Приём провайдером не подтверждает доставку во входящие.":"Gesamter Zeitraum. Annahme ist kein Zustellnachweis."}</p></header>
  <nav className="flex flex-wrap gap-2">{([["",ru?"Все":"Alle"],...statuses] as const).map(([s,label])=><Link key={s} href={url(s,1)} aria-current={s===status?"page":undefined} className={"rounded-md border px-3 py-2 text-sm "+(s===status?"bg-[#faf4f0] border-[#684e44]":"")}>{label}: {s?count(s):total}</Link>)}</nav>
  <section className="rounded-lg border p-4"><div className="divide-y">{rows.map(row=><div key={row.id} className="grid gap-1 py-2 text-sm sm:grid-cols-3">
   <Link href={"/crm/"+row.userId} className="underline">{row.user.fullName}</Link><span>{statuses.find(([s])=>s===row.status)?.[1]??row.status}</span><span>{fmt(row.sentAt??row.updatedAt)}</span>
  </div>)}</div>{!rows.length&&<p className="py-2 text-sm text-neutral-600">{ru?"Нет записей по этому фильтру.":"Keine Einträge für diesen Filter."}</p>}
    <nav className="mt-3 flex gap-4 text-sm">{page>1&&<Link className="underline" href={url(status,page-1)}>{ru?"Назад":"Zurück"}</Link>}{page*30<visible&&<Link className="underline" href={url(status,page+1)}>{ru?"Далее":"Weiter"}</Link>}</nav>
  </section>
 </main>;
}
