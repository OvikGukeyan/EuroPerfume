import {prisma} from "@/prisma/prisma-client";
import {getUserSession} from "@/src/shared/server-lib/get-user-session";
import {Link} from "@/src/i18n/navigation";
import {redirect} from "next/navigation";
import {OrderStatus,UserRole} from "@prisma/client";
import {ShoppingBag,Users,Package,Gift,ChartNoAxesColumn,ArrowUpRight,TicketPercent,Mail} from "lucide-react";

export const dynamic="force-dynamic";

export default async function AdminOverview({params}:{params:Promise<{locale:string}>}){
 const session=await getUserSession();
 if(!session||session.role!==UserRole.ADMIN)redirect("/not-auth");
 const {locale}=await params;
 const ru=locale==="ru";
 const [orderCount,awaitProcessing,shipped,customers,products,promotions,orders,verified,subscribed,pointsOutstanding,recentOrders,recentValue]=await Promise.all([
  prisma.order.count(),
  prisma.order.count({where:{status:{in:[OrderStatus.NEW,OrderStatus.PENDING]}}}),
  prisma.order.count({where:{status:OrderStatus.SUCCEEDED}}),
  prisma.user.count(),
  prisma.product.count(),
  prisma.promotion.count({where:{active:true}}),
  prisma.order.findMany({orderBy:{createdAt:"desc"},take:8,select:{id:true,fullName:true,totalAmount:true,status:true,createdAt:true}}),
  prisma.user.count({where:{verified:{not:null}}}),
  prisma.user.count({where:{verified:{not:null},accountConsent:{is:{marketingConfirmedAt:{not:null},marketingWithdrawnAt:null}}}}),
  prisma.loyaltyWallet.aggregate({_sum:{balancePoints:true}}),
  prisma.order.count({where:{createdAt:{gte:new Date(Date.now()-30*86400000)}}}),
  prisma.order.aggregate({_sum:{totalAmount:true},where:{createdAt:{gte:new Date(Date.now()-30*86400000)},status:{not:OrderStatus.CENCELLED}}})
 ]);
 const numbers=[
  {label:ru?"Всего заказов":"Bestellungen gesamt",value:orderCount,icon:ShoppingBag},
  {label:ru?"Требуют внимания":"Zu bearbeiten",value:awaitProcessing,icon:ChartNoAxesColumn},
  {label:ru?"Отправлены":"Versendet",value:shipped,icon:Package},
  {label:ru?"Зарегистрированы":"Kundenkonten",value:customers,icon:Users},
  {label:ru?"Товары в каталоге":"Produkte im Katalog",value:products,icon:Package},
  {label:ru?"Активные акции":"Aktive Aktionen",value:promotions,icon:Gift},
  {label:ru?"Email подтверждены":"E-Mail bestätigt",value:verified,icon:Users},
  {label:ru?"Разрешены рассылки":"Newsletter-Einwilligung",value:subscribed,icon:Mail},
  {label:ru?"Баллы клиентов":"Kundenpunkte",value:pointsOutstanding._sum.balancePoints||0,icon:Gift},
  {label:ru?"Заказов за 30 дней":"Bestellungen (30 Tage)",value:recentOrders,icon:ShoppingBag},
 ];
 const links=[
  {href:"/orders",label:ru?"Управлять заказами":"Bestellungen verwalten",icon:ShoppingBag},
  {href:"/crm",label:ru?"Клиенты и аналитика":"Kunden und Analyse",icon:Users},
  {href:"/club",label:ru?"Бонусы и отправки":"Treuepunkte und Versand",icon:Gift},
  {href:"/create-promocode",label:ru?"Промокоды":"Gutscheincodes",icon:TicketPercent},
  {href:"/promotions",label:ru?"Акции":"Aktionen",icon:Gift},
  {href:"/campaigns",label:ru?"Рассылки":"Newsletter",icon:Mail},
 ];
 return <main className="mx-auto max-w-[1320px] space-y-8 px-4 py-7 md:px-8">
  <header><p className="text-[11px] uppercase tracking-[.2em] text-[#96786e]">EURO PERFUME · ADMIN</p>
  <h1 className="mt-2 text-3xl font-normal tracking-tight">{ru?"Панель управления":"Übersicht"}</h1>
  <p className="mt-2 max-w-3xl text-sm text-neutral-600">{ru?"Вся работа с магазином Vercel в одном месте. Shopify отдельно. Данные обновляются при открытии страницы.":"Ihr Vercel-Shop auf einen Blick. Shopify bleibt getrennt. Die Kennzahlen werden bei jedem Aufruf aktualisiert."}</p></header>
  <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
   {numbers.map(({label,value,icon:Icon})=><section key={label} className="rounded-lg border border-[#e9e4e0] bg-[#faf9f7] p-4">
    <Icon className="text-[#94796d]" size={19} strokeWidth={1.5}/>
    <p className="mt-3 text-xs leading-5 text-neutral-500">{label}</p>
    <strong className="mt-1 block text-2xl font-medium tabular-nums">{value}</strong>
   </section>)}
  </div>
  <p className="text-sm text-neutral-600">{ru?"Сумма заявок за последние 30 дней (без отменённых, не равно фактической выручке): ":"Bestellwert der letzten 30 Tage (ohne stornierte Bestellungen, kein bestätigter Umsatz): "}<strong className="tabular-nums">{Number(recentValue._sum.totalAmount||0).toFixed(2)} €</strong></p>
  <section><h2 className="mb-3 text-lg font-medium">{ru?"Быстрые действия":"Schnellzugriff"}</h2>
   <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{links.map(({href,label,icon:Icon})=><Link key={href} href={href} className="flex min-h-14 items-center justify-between gap-2 rounded-lg border border-[#e9e4e0] p-3 text-sm hover:bg-[#faf8f6]"><span className="flex items-center gap-2"><Icon className="shrink-0 text-[#93786e]" size={17}/>{label}</span><ArrowUpRight className="shrink-0 text-neutral-400" size={16}/></Link>)}</div>
  </section>
  <section className="rounded-lg border border-[#e9e4e0]">
   <div className="flex items-center justify-between border-b p-4"><h2 className="text-lg font-medium">{ru?"Последние заказы":"Letzte Bestellungen"}</h2><Link href="/orders" className="text-xs underline underline-offset-4">{ru?"Все заказы":"Alle Bestellungen"}</Link></div>
   <div className="overflow-x-auto"><table className="w-full min-w-[520px] text-left text-sm">
    <thead className="bg-[#faf9f7] text-xs text-neutral-500"><tr><th className="p-3">№</th><th className="p-3">{ru?"Дата":"Datum"}</th><th className="p-3">{ru?"Клиент":"Kunde"}</th><th className="p-3">{ru?"Сумма":"Summe"}</th><th className="p-3">{ru?"Статус":"Status"}</th></tr></thead>
    <tbody>{orders.map(o=><tr key={o.id} className="border-t hover:bg-[#fcfbfa]"><td className="p-3"><Link href={`/order/${o.id}`} className="font-medium underline-offset-4 hover:underline">#{o.id}</Link></td><td className="p-3">{o.createdAt.toLocaleDateString(ru?"ru-RU":"de-DE")}</td><td className="p-3">{o.fullName}</td><td className="p-3 tabular-nums">{Number(o.totalAmount).toFixed(2)} €</td><td className="p-3">{o.status}</td></tr>)}</tbody>
   </table></div>
   {orders.length===0&&<p className="p-4 text-sm text-neutral-500">{ru?"Пока нет заказов":"Noch keine Bestellungen"}</p>}
  </section>
  <p className="text-xs text-neutral-500">{ru?"Показатели информационные. Открытие этой страницы не меняет заказы, счета или остатки.":"Die Übersicht ist schreibgeschützt und ändert keine Bestellungen, Rechnungen oder Bestände."}</p>
 </main>;
}
