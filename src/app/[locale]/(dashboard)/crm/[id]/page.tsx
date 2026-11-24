import {prisma} from "@/prisma/prisma-client";
import {getUserSession} from "@/src/shared/server-lib/get-user-session";
import {UserRole} from "@prisma/client";
import {notFound,redirect} from "next/navigation";
import {Link} from "@/src/i18n/navigation";
import {berlinZone} from "@/src/shared/server-lib/admin-insights-metrics";

export const dynamic="force-dynamic";

export default async function CustomerDetail({params}:{params:Promise<{locale:string;id:string}>}) {
 const session=await getUserSession();
 if(!session||session.role!==UserRole.ADMIN)redirect("/not-auth");
 const {locale,id}=await params;
 const ru=locale==="ru",userId=Number(id);
 if(!/^[1-9]\d{0,9}$/.test(id)||userId>2147483647)notFound();
 const u=await prisma.user.findUnique({where:{id:userId},select:{
  fullName:true,email:true,createdAt:true,verified:true,
  accountConsent:{select:{marketingRequestedAt:true,marketingConfirmedAt:true,marketingWithdrawnAt:true,confirmationSentAt:true}},
  welcomeNotice:{select:{sentAt:true}},
  legacyNewsletterReward:{select:{grantedAt:true,emailSentAt:true}},
  orders:{orderBy:[{createdAt:"desc"},{id:"desc"}],take:20,select:{id:true,createdAt:true,totalAmount:true,status:true,promocode:true}},
  _count:{select:{orders:true}},
 }});
 if(!u)notFound();
 const fmt=(d:Date|null|undefined)=>d?.toLocaleString(ru?"ru-RU":"de-DE",{timeZone:berlinZone,dateStyle:"short",timeStyle:"short"})??"—";
 const euro=(n:number)=>new Intl.NumberFormat(ru?"ru-RU":"de-DE",{style:"currency",currency:"EUR"}).format(n);
 return <main className="mx-auto max-w-[900px] space-y-6 px-4 py-7 md:px-8">
  <nav className="flex flex-wrap gap-4 text-sm"><Link href="/crm" className="underline">{ru?"Клиенты":"Kunden"}</Link><Link href="/insights" className="underline">{ru?"Аналитика":"Analysen"}</Link></nav>
  <header><h1 className="text-3xl">{u.fullName}</h1><p className="mt-1 break-all text-sm text-neutral-600">{u.email} · #{userId}</p></header>
  <section className="rounded-lg border p-4 md:p-6">
   <h2 className="text-xl">{ru?"Аккаунт и рассылка":"Konto und Newsletter"}</h2>
   <dl className="mt-3 divide-y text-sm">{[
    [ru?"Аккаунт создан":"Konto erstellt",u.createdAt],
    [ru?"Email подтверждён":"E-Mail verifiziert",u.verified],
    [ru?"Подписка запрошена":"Abo angefragt",u.accountConsent?.marketingRequestedAt],
    [ru?"Провайдер принял письмо для подтверждения":"Bestätigung vom Anbieter angenommen",u.accountConsent?.confirmationSentAt],
    [ru?"Подписка подтверждена":"Abo bestätigt",u.accountConsent?.marketingConfirmedAt],
    [ru?"Отписка":"Abmeldung",u.accountConsent?.marketingWithdrawnAt],
    [ru?"Провайдер принял приветственное письмо":"Willkommensmail vom Anbieter angenommen",u.welcomeNotice?.sentAt],
    [ru?"Персональный купон выдан":"Persönlicher Gutschein zugewiesen",u.legacyNewsletterReward?.grantedAt],
    [ru?"Провайдер принял письмо с купоном":"Gutschein-Mail vom Anbieter angenommen",u.legacyNewsletterReward?.emailSentAt],
   ].map(([label,when])=><div key={String(label)} className="flex flex-wrap justify-between gap-2 py-2"><dt>{label as string}</dt><dd>{fmt(when as Date|null|undefined)}</dd></div>)}</dl>
   <p className="mt-3 text-xs text-neutral-600">{ru?"Данные о приёме письма не подтверждают доставку во входящие. Время по Берлину.":"Annahme ist keine Bestätigung der Zustellung im Posteingang. Berliner Zeit."}</p>
  </section>
  <section className="rounded-lg border p-4 md:p-6">
   <h2 className="text-xl">{ru?"Заказы аккаунта":"Bestellungen dieses Kontos"} · {u._count.orders}</h2>
   <p className="mt-1 text-xs text-neutral-600">{ru?"Последние 20. Гостевые заказы по совпадению email не связываются.":"Letzte 20. Gastbestellungen werden nicht über die E-Mail-Adresse zugeordnet."}</p>
   <div className="mt-3 divide-y">{u.orders.map(o=><div key={o.id} className="flex flex-wrap gap-x-5 gap-y-1 py-2 text-sm"><Link href={"/order/"+o.id} className="underline">#{o.id}</Link><span>{fmt(o.createdAt)}</span><span>{euro(Number(o.totalAmount))}</span><span>{o.status}</span>{o.promocode&&<span>{o.promocode.trim().toUpperCase().startsWith("EP15-")?"EP15":o.promocode}</span>}</div>)}</div>
   {!u.orders.length&&<p className="mt-2 text-sm text-neutral-600">{ru?"Пока нет заказов.":"Noch keine Bestellungen."}</p>}
  </section>
 </main>;
}
