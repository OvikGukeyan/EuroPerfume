import {prisma} from "@/prisma/prisma-client";
import {OrderStatus, UserRole, type Prisma} from "@prisma/client";
import {getUserSession} from "@/src/shared/server-lib/get-user-session";
import {getTraffic} from "@/src/shared/server-lib/admin-insights-ga4";
import {insightDays,pageNumber,promoKey,scalar,berlinZone} from "@/src/shared/server-lib/admin-insights-metrics";
import {Link} from "@/src/i18n/navigation";
import {redirect} from "next/navigation";

export const dynamic="force-dynamic";
type Params = Record<string,string|string[]|undefined>;
const block="rounded-lg border border-[#e7e3df] bg-white p-4 sm:p-6";
const link="text-[#684e44] underline underline-offset-4 hover:text-black";
const codeAnchor="promo-history";

function HourChart({hours,ru}:{hours:number[];ru:boolean}) {
 const biggest=Math.max(1,...hours);
 const total=hours.reduce((a,b)=>a+b,0);
 return <>
  {!total&&<p className="my-3 text-sm text-neutral-500">{ru?"За выбранный период нет записей.":"Für diesen Zeitraum gibt es keine Einträge."}</p>}
  <div aria-hidden="true" className="mt-4 grid h-32 grid-cols-[repeat(24,minmax(0,1fr))] items-end gap-0.5 sm:gap-1.5">
   {hours.map((n,i)=><div key={i} className="rounded-t-sm bg-[#ad8b7d]" title={String(i).padStart(2,"0")+":00 – "+n} style={{height:n?Math.max(4,(n/biggest)*100)+"%":"1px"}} />)}
  </div>
  <div aria-hidden="true" className="mt-1 flex justify-between text-[10px] text-neutral-600"><span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>23:00</span></div>
  <details className="mt-3 text-sm">
   <summary className="cursor-pointer text-[#684e44]">{ru?"Показать числа по часам":"Stundenwerte anzeigen"}</summary>
   <dl className="mt-3 grid grid-cols-3 gap-x-3 gap-y-1 text-xs sm:grid-cols-6">{hours.map((n,i)=><div key={i} className="flex justify-between gap-1 border-b"><dt>{String(i).padStart(2,"0")}:00</dt><dd>{n}</dd></div>)}</dl>
  </details>
 </>;
}

export default async function AdminInsights({params,searchParams}:{params:Promise<{locale:string}>;searchParams:Promise<Params>}) {
 const admin=await getUserSession();
 if(!admin||admin.role!==UserRole.ADMIN)redirect("/not-auth");
 const [{locale},sp]=await Promise.all([params,searchParams]);
 const ru=locale==="ru",days=insightDays(sp.days),page=pageNumber(sp.page);
 const since=new Date(Date.now()-days*86400000);
 const q=scalar(sp.promo).trim().slice(0,100);
 const code=q==="legacy15"||/^[A-Za-z0-9_-]+$/.test(q)&&!/^EP15-/i.test(q)?q:"";
 const windowFilter={createdAt:{gte:since},status:{not:OrderStatus.CENCELLED}};
 const orderWhere:Prisma.OrderWhereInput={...windowFilter,promocode:code==="legacy15"?{startsWith:"EP15-",mode:"insensitive"}:code};
 const [traffic,signup,requested,confirmed,withdrawn,pending,accepted,failed,welcome,ordersByCode,campaigns,orderHours,selectedOrders,selectedCount]=await Promise.all([
  getTraffic(days),
  prisma.user.count({where:{role:UserRole.USER,createdAt:{gte:since}}}),
  prisma.accountConsent.count({where:{marketingRequestedAt:{gte:since},user:{role:UserRole.USER}}}),
  prisma.accountConsent.count({where:{marketingConfirmedAt:{gte:since},user:{role:UserRole.USER}}}),
  prisma.accountConsent.count({where:{marketingWithdrawnAt:{gte:since},user:{role:UserRole.USER}}}),
  prisma.accountConsent.count({where:{marketingRequestedAt:{not:null},marketingConfirmedAt:null,marketingWithdrawnAt:null,user:{role:UserRole.USER}}}),
  prisma.marketingDelivery.count({where:{status:"SENT",sentAt:{gte:since}}}),
  prisma.marketingDelivery.count({where:{status:"FAILED",updatedAt:{gte:since}}}),
  prisma.welcomeNotice.count({where:{sentAt:{gte:since}}}),
  prisma.order.groupBy({by:["promocode"],where:{...windowFilter,promocode:{not:null}},_count:{_all:true},_sum:{totalAmount:true}}),
  prisma.marketingCampaign.findMany({orderBy:[{createdAt:"desc"},{id:"desc"}],take:30,select:{id:true,name:true,status:true}}),
  prisma.$queryRaw<{hour:number;count:number}[]>`SELECT EXTRACT(HOUR FROM ("createdAt" AT TIME ZONE 'UTC' AT TIME ZONE 'Europe/Berlin'))::int AS hour, COUNT(*)::int AS count FROM "Order" WHERE "createdAt" >= ${since} AND "status" != 'CENCELLED' GROUP BY 1`,
  code?prisma.order.findMany({where:orderWhere,orderBy:[{createdAt:"desc"},{id:"desc"}],skip:(page-1)*30,take:30,select:{id:true,createdAt:true,status:true,totalAmount:true,userId:true}}):[],
  code?prisma.order.count({where:orderWhere}):0
 ]);
 const campaignStatuses=campaigns.length?await prisma.marketingDelivery.groupBy({by:["campaignId","status"],where:{campaignId:{in:campaigns.map(c=>c.id)}},_count:{_all:true}}):[];
 const sums=new Map<string,{orders:number;amount:number}>();
 for (const row of ordersByCode) {
  if (!row.promocode?.trim()) continue;
  const key=promoKey(row.promocode),prev=sums.get(key)??{orders:0,amount:0};
  sums.set(key,{orders:prev.orders+row._count._all,amount:prev.amount+Number(row._sum.totalAmount??0)});
 }
 const ranked=[...sums].sort((a,b)=>b[1].orders-a[1].orders||a[0].localeCompare(b[0]));
 const hours=Array<number>(24).fill(0);
 for (const row of orderHours) if (row.hour>=0&&row.hour<24) hours[row.hour]=row.count;
 const date=(d:Date)=>d.toLocaleString(ru?"ru-RU":"de-DE",{timeZone:berlinZone,dateStyle:"short",timeStyle:"short"});
 const money=(n:number)=>new Intl.NumberFormat(ru?"ru-RU":"de-DE",{style:"currency",currency:"EUR"}).format(n);
 const periodFilter={days:String(days)};
 const scopedCrm=(status:string)=>({pathname:"/crm",query:{status,days:String(days)}});
 return <main className="mx-auto max-w-[1360px] space-y-6 px-4 py-7 md:px-8">
  <header><p className="text-[11px] uppercase tracking-[.18em] text-[#997d72]">EURO PERFUME · VERCEL</p>
   <h1 className="mt-2 text-3xl font-normal tracking-tight">{ru?"Аналитика магазина":"Shop-Analysen"}</h1>
   <p className="mt-2 text-sm text-neutral-600">{ru?"Подписки, письма, промокоды, посещения и заявки. Данные Shopify не входят.":"Abos, Mailings, Gutscheine, Besuche und Bestellungen. Keine Shopify-Daten."}</p>
   <nav className="mt-4 flex flex-wrap gap-2" aria-label={ru?"Период":"Zeitraum"}>
    {([7,30,90] as const).map(n=><Link key={n} href={{pathname:"/insights",query:{days:String(n),...(code?{promo:code}:{})}}} aria-current={n===days?"page":undefined} className={"rounded-md border px-3 py-2 text-sm "+(n===days?"border-[#684e44] bg-[#faf4f0]":"")}>{n} {ru?"дней":"Tage"}</Link>)}
   </nav>
  </header>
  <section className={block}>
   <h2 className="text-xl">{ru?"Клиенты и согласие на рассылку":"Kunden und Newsletter-Einwilligungen"}</h2>
   <p className="mt-1 text-xs text-neutral-600">{ru?"События за выбранный период; один человек может попадать в разные категории. Ожидающие подтверждения показаны за всё время.":"Ereignisse im gewählten Zeitraum; ein Konto kann in mehreren Gruppen vorkommen. Offene Einwilligungen ohne Zeitfilter."}</p>
   <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-5">
    {[
     [ru?"Регистрации":"Registrierungen",signup,"registered_in"],
     [ru?"Запросили подписку":"Abo angefragt",requested,"requested_in"],
     [ru?"Подтвердили подписку":"Abo bestätigt",confirmed,"confirmed_in"],
     [ru?"Отписались":"Abgemeldet",withdrawn,"withdrawn_in"],
     [ru?"Ждут подтверждения":"Bestätigung offen",pending,"pending_marketing"],
    ].map(([label,n,status])=><Link key={status} href={scopedCrm(String(status))} className="rounded-md border p-3 hover:border-[#ad8b7d] hover:bg-[#faf8f6]"><span className="text-xs text-neutral-600">{label} ↗</span><strong className="block text-2xl tabular-nums">{n}</strong></Link>)}
   </div>
  </section>
  <section className={block}>
   <div className="flex flex-wrap items-baseline justify-between gap-2"><h2 className="text-xl">{ru?"Рассылки и приветственные письма":"Newsletter und Willkommensmails"}</h2><Link href="/campaigns" className={link}>{ru?"Управление рассылками":"Newsletter verwalten"}</Link></div>
   <p className="mt-2 text-sm">{ru?"За выбранный период":"Im ausgewählten Zeitraum"}: <strong>{accepted}</strong> {ru?"принятых провайдером":"vom Anbieter angenommen"}, <strong>{failed}</strong> {ru?"с ошибкой":"fehlgeschlagen"}, <strong>{welcome}</strong> {ru?"приветственных отправок":"Willkommensmails"}.</p>
   <p className="mt-1 text-xs text-neutral-600">{ru?"Принято провайдером не значит доставлено во входящие. Открытия и клики не подтверждены.":"Vom Anbieter angenommen ist kein Zustellnachweis. Öffnungen und Klicks sind nicht bestätigt."}</p>
   <details className="mt-3 text-sm"><summary className="cursor-pointer text-[#684e44]">{ru?"Последние рассылки: статус и попытки за всё время":"Letzte Newsletter: Status und Versandversuche insgesamt"}</summary>
    <div className="mt-2 divide-y">{campaigns.map(c=>{const forStatus=(s:string)=>campaignStatuses.find(x=>x.campaignId===c.id&&x.status===s)?._count._all??0;
     return <div key={c.id} className="flex flex-wrap justify-between gap-2 py-2"><span><Link href={"/insights/campaign/"+c.id} className={link}>{c.name}</Link> <small>({c.status})</small></span><span>{ru?"Принято":"Angenommen"}: {forStatus("SENT")} · {ru?"Ошибки":"Fehler"}: {forStatus("FAILED")} · {ru?"В обработке":"Offen"}: {forStatus("QUEUED")+forStatus("SENDING")}</span></div>;
    })}{!campaigns.length&&<p>{ru?"Кампаний пока нет.":"Noch keine Kampagnen."}</p>}</div>
   </details>
  </section>
  <section id={codeAnchor} className={block+" scroll-mt-20"}>
   <div className="flex flex-wrap items-baseline justify-between gap-2"><h2 className="text-xl">{ru?"Использование промокодов":"Gutschein-Nutzung"}</h2><Link href="/create-promocode" className={link}>{ru?"Управление промокодами":"Gutscheine verwalten"}</Link></div>
   <p className="my-2 text-xs text-neutral-600">{ru?"Неотменённые заявки за период. Суммы включают доставку и не равны полученной выручке. Персональные коды EP15 объединены.":"Nicht stornierte Bestellungen im Zeitraum. Bestellwerte enthalten Versand und sind kein bestätigter Umsatz. Persönliche EP15-Codes sind zusammengefasst."}</p>
   <div className="divide-y">{ranked.map(([key,v])=><div key={key} className="flex flex-wrap justify-between gap-2 py-2 text-sm">
    <Link href={{pathname:"/insights",query:{...periodFilter,promo:key},hash:codeAnchor}} className={link} aria-current={key===code?"true":undefined}>{key==="legacy15"?(ru?"Персональные EP15":"Persönliche EP15"):key}</Link>
    <span className="tabular-nums">{v.orders} · {money(v.amount)}</span>
   </div>)}{!ranked.length&&<p className="py-2 text-sm text-neutral-500">{ru?"За период нет заявок с кодами.":"Keine Bestellungen mit Gutscheinen im Zeitraum."}</p>}</div>
   {code&&<div className="mt-4 rounded-md border p-3 text-sm">
    <h3 className="font-medium">{code==="legacy15"?"EP15":code} · {selectedCount}</h3>
    {selectedOrders.map(o=><div key={o.id} className="mt-2 flex flex-wrap justify-between gap-2 border-t pt-2"><Link href={"/order/"+o.id} className={link}>#{o.id}</Link><span>{date(o.createdAt)} · {money(Number(o.totalAmount))} · {o.status}</span>{o.userId&&<Link href={"/crm/"+o.userId} className={link}>{ru?"Карточка клиента":"Kundenkonto"}</Link>}</div>)}
    {!selectedOrders.length&&<p className="mt-2 text-neutral-500">{ru?"Нет заявок на этой странице.":"Keine Bestellungen auf dieser Seite."}</p>}
    <nav className="mt-2 flex gap-3">
     {page>1&&<Link className={link} href={{pathname:"/insights",query:{...periodFilter,promo:code,page:String(page-1)},hash:codeAnchor}}>{ru?"Назад":"Zurück"}</Link>}
     {page*30<selectedCount&&<Link className={link} href={{pathname:"/insights",query:{...periodFilter,promo:code,page:String(page+1)},hash:codeAnchor}}>{ru?"Далее":"Weiter"}</Link>}
    </nav>
   </div>}
  </section>
  <section className={block}>
   <h2 className="text-xl">{ru?"Посещения по часам":"Besuche nach Uhrzeit"}</h2>
   {traffic.status==="ok"?<>
    <p className="mt-2 text-sm"><strong>{traffic.sessions}</strong> {ru?"начал сеанса по Google Analytics":"Sitzungsstarts laut Google Analytics"} · {traffic.timezone}</p>
    <p className="mt-1 text-xs text-neutral-600">{ru?"Полные прошедшие дни, без сегодняшнего. Учитываются сеансы, зарегистрированные Google Analytics; это не число уникальных пользователей.":"Abgeschlossene Tage ohne heute. Erfasste GA-Sitzungsstarts, keine eindeutigen Besucher."}</p>
    {traffic.partial&&<p className="mt-1 text-xs text-neutral-600">{ru?"Google применил пороги: часть данных скрыта.":"Google hat Schwellenwerte angewandt; Daten können fehlen."}</p>}
    <HourChart hours={traffic.hours} ru={ru}/>
    {!!traffic.sources.length&&<details className="mt-4 text-sm"><summary className="cursor-pointer text-[#684e44]">{ru?"Источники посещений (до 10)":"Besuchsquellen (bis zu 10)"}</summary><dl className="mt-2 divide-y">{traffic.sources.map((s,i)=><div key={i} className="flex justify-between gap-3 py-1"><dt className="break-all">{s.name}</dt><dd>{s.sessions}</dd></div>)}</dl></details>}
   </>:<p className="mt-2 text-sm text-neutral-600">{traffic.status==="not_configured"?(ru?"Тег Google Analytics уже есть на витрине, но панель ещё не получила доступ к отчётам. Неизвестные посещения не показываются как ноль.":"Der GA-Tag ist bereits im Shop eingebunden. Die Verwaltung hat keinen Berichtszugriff. Fehlende Besuchsdaten werden nicht als Null angezeigt."):(ru?"Google Analytics сейчас не вернул отчёт. Попробуй позже или открой GA напрямую.":"Google Analytics hat keinen Bericht geliefert. Später versuchen oder GA direkt öffnen.")}</p>}
   <a className={link+" mt-3 inline-block text-sm"} href="https://analytics.google.com/analytics/web/" target="_blank" rel="noreferrer">Google Analytics ↗</a>
  </section>
  <section className={block}>
   <div className="flex flex-wrap items-baseline justify-between gap-2"><h2 className="text-xl">{ru?"Заявки по часам":"Bestellungen nach Uhrzeit"}</h2><Link href="/orders" className={link}>{ru?"Все заказы":"Alle Bestellungen"}</Link></div>
   <p className="mt-1 text-xs text-neutral-600">Europe/Berlin · {ru?"По неотменённым заявкам, не по посещениям.":"Nicht stornierte Bestellungen, keine Besuche."}</p>
   <HourChart hours={hours} ru={ru}/>
  </section>
 </main>;
}
