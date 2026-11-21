import {prisma} from "@/prisma/prisma-client";
import {Prisma,UserRole} from "@prisma/client";
import {getUserSession} from "@/src/shared/server-lib/get-user-session";
import {redirect} from "next/navigation";
import {Link} from "@/src/i18n/navigation";
import NextLink from "next/link";
import {Users,UserCheck,MailCheck,Gift,Search,TicketPercent,Mail,ShieldCheck} from "lucide-react";

export const dynamic="force-dynamic";
type SearchParams={q?:string;status?:string;page?:string};
export default async function CustomerCrm({params,searchParams}:{params:Promise<{locale:string}>;searchParams:Promise<SearchParams>}){
 const admin=await getUserSession();
 if(!admin||admin.role!==UserRole.ADMIN)redirect("/not-auth");
 const {locale}=await params,ru=locale==="ru";
 const sp=await searchParams;
 const q=(sp.q||"").trim().slice(0,100);
 const status=["all","verified","unverified","subscribed","no_consent","with_points"].includes(sp.status||"")?sp.status||"all":"all";
 const page=Math.max(1,Math.min(10000,parseInt(sp.page||"1",10)||1));
 const where:Prisma.UserWhereInput={
  ...(q?{OR:[{email:{contains:q,mode:"insensitive"}},{fullName:{contains:q,mode:"insensitive"}}]}:{}),
  ...(status==="verified"?{verified:{not:null}}:{}),
  ...(status==="unverified"?{verified:null}:{}),
  ...(status==="subscribed"?{verified:{not:null},accountConsent:{is:{marketingConfirmedAt:{not:null},marketingWithdrawnAt:null}}}:{}),
  ...(status==="no_consent"?{AND:[{OR:[{accountConsent:{is:null}},{accountConsent:{is:{marketingConfirmedAt:null}}},{accountConsent:{is:{marketingWithdrawnAt:{not:null}}}}]}]}:{}),
  ...(status==="with_points"?{loyaltyWallet:{is:{balancePoints:{gt:0}}}}:{})
 };
 const [registered,verified,subscribers,pending,walletSummary,users,total]=await Promise.all([
  prisma.user.count(),
  prisma.user.count({where:{verified:{not:null}}}),
  prisma.user.count({where:{verified:{not:null},accountConsent:{is:{marketingConfirmedAt:{not:null},marketingWithdrawnAt:null}}}}),
  prisma.user.count({where:{verified:null}}),
  prisma.loyaltyWallet.aggregate({_sum:{balancePoints:true}}),
  prisma.user.findMany({where,orderBy:{createdAt:"desc"},skip:(page-1)*30,take:30,
   select:{id:true,fullName:true,email:true,verified:true,createdAt:true,
    loyaltyWallet:{select:{balancePoints:true}},
    accountConsent:{select:{marketingConfirmedAt:true,marketingWithdrawnAt:true,marketingRequestedAt:true}}}}),
  prisma.user.count({where})
 ]);
 const [offersRequested,offersGranted,offersSent,offersUsed]=await Promise.all([
  prisma.legacyNewsletterReward.count(),
  prisma.legacyNewsletterReward.count({where:{grantedAt:{not:null}}}),
  prisma.legacyNewsletterReward.count({where:{emailSentAt:{not:null}}}),
  prisma.couponRedemption.count({where:{code:{startsWith:"EP15-"}}})
 ]);
  const items=[
  {icon:Users,label:ru?"Зарегистрировано":"Registriert",value:registered},
  {icon:UserCheck,label:ru?"Email подтверждён":"E-Mail bestätigt",value:verified},
  {icon:MailCheck,label:ru?"Согласие на рекламу":"Newsletter-Einwilligung",value:subscribers},
  {icon:Gift,label:ru?"Остаток баллов":"Punkte-Saldo",value:walletSummary._sum.balancePoints||0}
 ];
 const statuses=[["all",ru?"Все аккаунты":"Alle Konten"],["verified",ru?"Подтверждены":"Bestätigt"],["unverified",ru?"Не подтверждены":"Unbestätigt"],["subscribed",ru?"Разрешена рассылка":"Newsletter erlaubt"],["no_consent",ru?"Нет согласия":"Ohne Einwilligung"],["with_points",ru?"С бонусами":"Mit Punkten"]] as const;
 return <main className="mx-auto max-w-[1400px] space-y-6 px-4 py-7 md:px-8">
  <header><p className="text-[11px] uppercase tracking-[.18em] text-[#997d72]">EURO PERFUME · CRM</p>
   <h1 className="mt-2 text-3xl font-normal tracking-tight">{ru?"Клиенты и бонусы":"Kunden und Punkte"}</h1>
   <p className="mt-2 max-w-4xl text-sm leading-6 text-neutral-600">{ru?"Здесь видны только нужные для работы сведения: имя, email, подтверждение, разрешение на рассылку и бонусный баланс. Личные адреса, пароли и содержимое заказов не показываются. Shopify не подключён.":"Nur notwendige Daten: Name, E-Mail, Verifizierung, Newsletter-Einwilligung und Punktestand. Keine Adressen, Passwörter oder Bestellpositionen. Shopify bleibt unabhängig."}</p>
  </header>
  <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
   {items.map(({icon:Icon,label,value})=><section key={label} className="rounded-lg border border-[#e7e3df] bg-[#faf9f7] p-4"><Icon size={19} strokeWidth={1.5} className="text-[#90766d]"/><p className="mt-3 text-xs text-neutral-600">{label}</p><strong className="mt-1 block text-2xl font-medium tabular-nums">{value}</strong></section>)}
  </div>
  <section className="rounded-lg border border-[#e7e3df] bg-[#faf9f7] p-4">
   <h2 className="text-sm font-medium">{ru?"Акция для старых аккаунтов · 15%":"15 %-Aktion für Bestandskonten"}</h2>
   <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4 text-xs">
    <div><p className="text-neutral-500">{ru?"Запросили подписку":"Anmeldung angefragt"}</p><strong className="text-xl tabular-nums">{offersRequested}</strong></div>
    <div><p className="text-neutral-500">{ru?"Получили купон":"Gutschein erhalten"}</p><strong className="text-xl tabular-nums">{offersGranted}</strong></div>
    <div><p className="text-neutral-500">{ru?"Письмо отправлено":"Gutschein-E-Mail gesendet"}</p><strong className="text-xl tabular-nums">{offersSent}</strong></div>
    <div><p className="text-neutral-500">{ru?"Использовали скидку":"Eingelöst"}</p><strong className="text-xl tabular-nums">{offersUsed}</strong></div>
   </div>
  </section>
  <nav className="flex flex-wrap gap-2">
   <Link href="/club" className="inline-flex min-h-10 items-center gap-2 rounded-md border px-3 text-sm"><Gift size={16}/>{ru?"Бонусные начисления":"Punkte verwalten"}</Link>
   <Link href="/create-promocode" className="inline-flex min-h-10 items-center gap-2 rounded-md border px-3 text-sm"><TicketPercent size={16}/>{ru?"Промокоды":"Gutscheine"}</Link>
   <Link href="/campaigns" className="inline-flex min-h-10 items-center gap-2 rounded-md border px-3 text-sm"><Mail size={16}/>{ru?"Рассылки":"Newsletter"}</Link>
   <NextLink href="/api/admin/crm-export" prefetch={false} className="inline-flex min-h-10 items-center gap-2 rounded-md border px-3 text-sm"><ShieldCheck size={16}/>{ru?"Скачать email с согласием":"Einwilligungen exportieren"}</NextLink>
  </nav>
  <div className="rounded-lg border border-[#e7e3df] bg-white">
   <div className="flex flex-col gap-3 border-b p-4 md:flex-row md:items-end md:justify-between">
    <div><h2 className="text-lg font-medium">{ru?"Зарегистрированные клиенты":"Kundenkonten"}</h2><p className="mt-1 text-xs text-neutral-500">{ru?"Не подтверждены":"Unbestätigt"}: {pending} · {ru?"Найдено":"Gefunden"}: {total}</p></div>
    <form className="flex flex-wrap items-end gap-2">
     <label className="grid gap-1 text-xs text-neutral-600">{ru?"Поиск имени или email":"Name oder E-Mail suchen"}
      <input name="q" defaultValue={q} placeholder="Email" className="h-10 w-52 rounded-md border px-3 text-sm"/></label>
     <label className="grid gap-1 text-xs text-neutral-600">{ru?"Статус":"Status"}
      <select name="status" defaultValue={status} className="h-10 max-w-56 rounded-md border bg-white px-2 text-sm">{statuses.map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>
     <button type="submit" className="inline-flex h-10 items-center gap-2 rounded-md bg-[#262424] px-4 text-sm text-white"><Search size={15}/>{ru?"Найти":"Suchen"}</button>
    </form>
   </div>
   <div className="overflow-x-auto">
    <table className="w-full min-w-[790px] text-left text-sm">
     <thead className="bg-[#faf9f7] text-xs text-neutral-600"><tr>
      <th className="p-3">{ru?"Имя":"Name"}</th><th className="p-3">Email</th>
      <th className="p-3">{ru?"Аккаунт":"Konto"}</th><th className="p-3">{ru?"Рассылка":"Newsletter"}</th>
      <th className="p-3">{ru?"Баллы":"Punkte"}</th><th className="p-3">{ru?"Регистрация":"Registriert"}</th>
     </tr></thead>
     <tbody>{users.map(u=>{const subscribed=Boolean(u.verified&&u.accountConsent?.marketingConfirmedAt&&!u.accountConsent?.marketingWithdrawnAt);
      return <tr key={u.id} className="border-t hover:bg-[#fcfbfa]">
       <td className="p-3 font-medium">{u.fullName}</td>
       <td className="p-3"><span className="select-all">{u.email}</span></td>
       <td className="p-3">{u.verified?<span className="text-[#257049]">{ru?"Подтверждён":"Bestätigt"}</span>:<span className="text-[#9a6625]">{ru?"Ожидает email":"E-Mail offen"}</span>}</td>
       <td className="p-3">{subscribed?<span className="text-[#257049]">{ru?"Разрешена":"Erlaubt"}</span>:<span className="text-neutral-500">{u.accountConsent?.marketingWithdrawnAt?(ru?"Отписан":"Abgemeldet"):u.accountConsent?.marketingRequestedAt?(ru?"Ожидает согласия":"Einwilligung offen"):(ru?"Нет согласия":"Keine Einwilligung")}</span>}</td>
       <td className="p-3 font-medium tabular-nums">{u.loyaltyWallet?.balancePoints??0}</td>
       <td className="p-3">{u.createdAt.toLocaleDateString(ru?"ru-RU":"de-DE",{timeZone:"Europe/Berlin"})}</td>
      </tr>})}</tbody>
    </table>
    {!users.length&&<p className="p-5 text-sm text-neutral-500">{ru?"Нет клиентов по выбранным фильтрам":"Keine Treffer"}</p>}
   </div>
   <div className="flex items-center justify-between border-t p-4 text-xs text-neutral-600"><span>{page} / {Math.max(1,Math.ceil(total/30))}</span><div className="flex gap-4">
    {page>1&&<a className="underline" href={`?q=${encodeURIComponent(q)}&status=${status}&page=${page-1}`}>{ru?"Назад":"Zurück"}</a>}
    {page*30<total&&<a className="underline" href={`?q=${encodeURIComponent(q)}&status=${status}&page=${page+1}`}>{ru?"Далее":"Weiter"}</a>}
   </div></div>
  </div>
  <p className="text-xs text-neutral-500">{ru?"Экспорт содержит только подтверждённые email с действующим согласием на рекламу. Регистрация сама по себе не разрешает рекламную рассылку.":"Der Export enthält ausschließlich bestätigte E-Mails mit gültiger Newsletter-Einwilligung."}</p>
 </main>;
}
