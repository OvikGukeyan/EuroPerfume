import {prisma} from "@/prisma/prisma-client";
import {getUserSession} from "@/src/shared/server-lib/get-user-session";
import {redirect} from "next/navigation";
import {Link} from "@/src/i18n/navigation";
import {UserRole} from "@prisma/client";
import {Users, MailCheck, UserCheck, ShoppingBag, TicketPercent, Gift, ChartNoAxesColumn} from "lucide-react";

export const dynamic="force-dynamic";
export default async function CustomerCrm({params,searchParams}:{
 params:Promise<{locale:string}>;searchParams:Promise<{q?:string;subscribed?:string;page?:string}>
}){
 const admin=await getUserSession();if(!admin||admin.role!==UserRole.ADMIN)redirect("/not-auth");
 const {locale}=await params;const ru=locale==="ru";const sp=await searchParams;
 const q=(sp.q||"").trim().slice(0,100),subscribed=sp.subscribed==="1";
 const page=Math.max(1,Math.min(10000,Number(sp.page)||1));
 const where={
  ...(q?{OR:[{email:{contains:q,mode:"insensitive" as const}},{fullName:{contains:q,mode:"insensitive" as const}}]}:{}),
  ...(subscribed?{accountConsent:{is:{marketingConfirmedAt:{not:null},marketingWithdrawnAt:null}}}:{})
 };
 const [registered,verified,subscribers,registeredOrders,guestOrders,users,totalFiltered] = await Promise.all([
  prisma.user.count(),prisma.user.count({where:{verified:{not:null}}}),
  prisma.accountConsent.count({where:{marketingConfirmedAt:{not:null},marketingWithdrawnAt:null}}),
  prisma.order.count({where:{userId:{not:null}}}),
  prisma.order.count({where:{userId:null}}),
  prisma.user.findMany({where,orderBy:{createdAt:"desc"},skip:(page-1)*30,take:30,
   select:{id:true,fullName:true,email:true,verified:true,createdAt:true,
    _count:{select:{orders:true}},accountConsent:{select:{marketingConfirmedAt:true,marketingWithdrawnAt:true}}}}),
  prisma.user.count({where})
 ]);
 const stat=[
  {icon:Users,name:ru?"Регистраций":"Registrierungen",n:registered},
  {icon:UserCheck,name:ru?"Email подтверждено":"E-Mail bestätigt",n:verified},
  {icon:MailCheck,name:ru?"Согласие на рассылку":"Newsletter erlaubt",n:subscribers},
  {icon:ShoppingBag,name:ru?"Заказов из аккаунтов":"Account-Bestellungen",n:registeredOrders}
 ];
 return <main className="mx-auto max-w-[1350px] px-4 py-6 md:px-8">
  <p className="text-[11px] uppercase tracking-[.18em] text-[#957971]">EURO PERFUME · CRM</p>
  <h1 className="mt-2 text-[28px] font-normal tracking-tight">{ru?"Клиенты и аналитика":"Kunden und Analysen"}</h1>
  <p className="mt-2 max-w-3xl text-sm leading-6 text-[#646464]">{ru?"Это только Vercel: аккаунты Shopify не учитываются. Гостевые заказы никогда не привязываются к аккаунту по email. Для рассылок доступны только подтверждённые подписки.":"Nur Vercel, keine Shopify-Konten. Gastbestellungen werden niemals anhand der E-Mail-Adresse verknüpft. Newsletter nur bei bestätigter Einwilligung."}</p>
  <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
  {stat.map(({icon:Icon,name,n})=><div key={name} className="rounded-lg border border-[#e9e5e2] bg-[#fcfbfa] p-4">
   <Icon size={19} strokeWidth={1.5} className="text-[#896b63]"/>
   <p className="mt-2 text-xs text-neutral-600">{name}</p>
   <strong className="mt-1 block text-3xl font-medium tabular-nums">{n}</strong>
  </div>)}</div>
  <nav className="mt-6 flex flex-wrap gap-2">
   {[{href:"/create-promocode",label:ru?"Промокоды":"Gutscheincodes",icon:TicketPercent},
     {href:"/club",label:ru?"Бонусная программа":"Bonusprogramm",icon:Gift},
     {href:"/orders",label:ru?"Заказы":"Bestellungen",icon:ShoppingBag}]
    .map(({href,label,icon:Icon})=><Link key={href} href={href} className="inline-flex items-center gap-2 rounded-md border border-[#ddd] px-4 py-2 text-sm hover:bg-neutral-50"><Icon size={15}/>{label}</Link>)}
  </nav>
  <section className="mt-8 rounded-lg border border-[#e5e5e5] bg-white">
   <div className="flex flex-wrap items-center justify-between gap-3 border-b p-4">
    <div><h2 className="text-lg font-medium">{ru?"Зарегистрированные клиенты":"Registrierte Kunden"}</h2><p className="text-xs text-neutral-500">{ru?"Гостевых заказов отдельно":"Separate Gastbestellungen"}: {guestOrders} · {ru?"найдено аккаунтов":"Konten gefunden"}: {totalFiltered}</p></div>
    <form className="flex flex-wrap items-center gap-2">
     <input name="q" defaultValue={q} placeholder={ru?"Имя или email":"Name oder E-Mail"} className="min-h-10 w-52 rounded-md border px-3 text-sm"/>
     <label className="flex items-center gap-2 text-xs"><input type="checkbox" name="subscribed" value="1" defaultChecked={subscribed}/>{ru?"Подписаны":"Abonniert"}</label>
     <button className="min-h-10 rounded-md bg-neutral-900 px-3 text-xs text-white">{ru?"Найти":"Suchen"}</button>
    </form>
   </div>
   <div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><thead className="bg-[#fafafa] text-xs text-neutral-600"><tr><th className="p-3">{ru?"Клиент":"Kunde"}</th><th className="p-3">Email</th><th className="p-3">{ru?"Подтверждение":"Bestätigung"}</th><th className="p-3">{ru?"Рассылка":"Newsletter"}</th><th className="p-3">{ru?"Заказы":"Bestellungen"}</th><th className="p-3">{ru?"Регистрация":"Registriert"}</th></tr></thead>
    <tbody>{users.map(u=><tr key={u.id} className="border-t">
     <td className="p-3 font-medium">{u.fullName}</td>
     <td className="p-3">{u.email}</td>
     <td className="p-3">{u.verified?(ru?"Да":"Ja"):(ru?"Нет":"Nein")}</td>
     <td className="p-3">{u.accountConsent?.marketingConfirmedAt&&!u.accountConsent.marketingWithdrawnAt?<span className="text-[#266b4c]">{ru?"Разрешена":"Erlaubt"}</span>:<span className="text-[#888]">{ru?"Нет согласия":"Keine Einwilligung"}</span>}</td>
     <td className="p-3 tabular-nums">{u._count.orders}</td>
     <td className="p-3">{u.createdAt.toLocaleDateString(ru?"ru-RU":"de-DE")}</td>
    </tr>)}</tbody>
   </table></div>
   <div className="flex items-center justify-between border-t p-3 text-xs">
    <span>{page} / {Math.max(1,Math.ceil(totalFiltered/30))}</span>
    <div className="flex gap-3">
     {page>1&&<a href={`?q=${encodeURIComponent(q)}&subscribed=${subscribed?"1":"0"}&page=${page-1}`} className="underline">{ru?"Назад":"Zurück"}</a>}
     {page*30<totalFiltered&&<a href={`?q=${encodeURIComponent(q)}&subscribed=${subscribed?"1":"0"}&page=${page+1}`} className="underline">{ru?"Далее":"Weiter"}</a>}
    </div>
   </div>
  </section>
  <p className="mt-4 text-xs text-neutral-500">{ru?"Email-адреса предназначены для обслуживания аккаунта; рекламные письма разрешены только при действующем согласии. Автоматическая массовая отправка здесь не включена.":"Kunden-E-Mails nur nach bestätigter Einwilligung für Marketing verwenden. Massenversand ist hier nicht aktiviert."}</p>
 </main>;
}
