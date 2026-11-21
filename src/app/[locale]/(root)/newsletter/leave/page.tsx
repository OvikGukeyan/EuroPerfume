import {optOutUserId} from "@/src/shared/server-lib/marketing-optout";
export default async function OptOutPage({params,searchParams}:{
 params:Promise<{locale:string}>;searchParams:Promise<{token?:string}>
}){
 const {locale}=await params,ru=locale==="ru",sp=await searchParams;
 const token=sp.token||"",valid=optOutUserId(token)!==null;
 return <main className="mx-auto max-w-lg px-5 py-16">
  <p className="text-xs uppercase tracking-[.16em] text-[#927268]">EURO PERFUME</p>
  <h1 className="mt-3 text-2xl font-normal">{ru?"Отписаться от рассылки":"Newsletter abbestellen"}</h1>
  {valid?<><p className="my-5 text-sm leading-6 text-[#555]">{ru?"Вы можете в любой момент отказаться от рекламных писем. Заказы и технические уведомления продолжат приходить.":"Du kannst Werbe-E-Mails jederzeit abbestellen. Bestell- und Service-Nachrichten bleiben davon unberührt."}</p>
  <form action="/api/marketing/unsubscribe" method="post">
   <input type="hidden" name="token" value={token}/><input type="hidden" name="locale" value={locale}/>
   <button className="min-h-12 w-full rounded-md bg-neutral-900 px-6 text-sm text-white">{ru?"Подтвердить отписку":"Abmeldung bestätigen"}</button>
  </form></>:<p className="my-5 text-sm text-red-700">{ru?"Ссылка недействительна. Вы можете отказаться от подписки в личном кабинете.":"Der Link ist ungültig. Du kannst den Newsletter im Kundenkonto abbestellen."}</p>}
 </main>;
}
