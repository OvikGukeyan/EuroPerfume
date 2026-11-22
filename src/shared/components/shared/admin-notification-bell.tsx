"use client";
import {useLocale} from "next-intl";
import {useRouter} from "@/src/i18n/navigation";
import {Bell,CheckCheck,Clock3,X} from "lucide-react";
import {useAdminNotifications,type AdminCategory,type AdminEvent} from "./admin-notifications-context";

const messages:Record<string,[string,string]>={
 registered:["Новый клиент зарегистрировался","Neues Kundenkonto"],
 email_verified:["Клиент подтвердил email","E-Mail-Adresse bestätigt"],
 newsletter_requested:["Запрошена подписка","Newsletter angefragt"],
 newsletter_confirmed:["Подписка подтверждена","Newsletter bestätigt"],
 newsletter_unsubscribed:["Отписка от рассылки","Newsletter abbestellt"],
 coupon_issued:["Выдан персональный купон 15%","15 %-Gutschein ausgestellt"],
 coupon_email_sent:["Письмо с купоном отправлено","Gutschein-E-Mail versendet"],
 coupon_redeemed:["Промокод использован","Gutschein eingelöst"],
 new_order:["Новый заказ","Neue Bestellung"],
 refund_recorded:["Возврат денег отмечен","Rückzahlung erfasst"],
 points_earned:["Бонусы начислены","Punkte gutgeschrieben"],
 points_spent:["Баллы списаны","Punkte eingelöst"],
 points_restored:["Баллы восстановлены","Punkte erstattet"],
 points_adjusted:["Баланс баллов скорректирован","Punktestand korrigiert"]
};
const categoryNames:Record<AdminCategory,[string,string]>={
 crm:["Клиенты","Kunden"],club:["Бонусы и купоны","Punkte & Gutscheine"],
 orders:["Заказы","Bestellungen"],campaigns:["Рассылки","Newsletter"]
};
export function AdminNotificationBadge({count}:{count:number}){
 if(count<1)return null;
 return <span className="inline-flex h-[19px] min-w-[19px] shrink-0 items-center justify-center rounded-full bg-[#ad817e] px-1 text-[10px] font-semibold leading-none text-white tabular-nums" aria-label={`${count} unread`}>{count>99?"99+":count}</span>;
}
function destination(item:AdminEvent):string{
 if(item.category==="orders")return item.orderId?`/order/${item.orderId}`:"/orders";
 if(item.category==="crm")return "/crm";
 if(item.category==="club")return "/club";
 return "/campaigns";
}
export function AdminNotificationBell(){
 const ru=useLocale()==="ru",router=useRouter();
 const {total,counts,isOpen,filter,presented,loading,openInbox,closeInbox}=useAdminNotifications();
 const categoryTitle=filter?categoryNames[filter][ru?0:1]:(ru?"Новые уведомления":"Neue Benachrichtigungen");
 function openItem(item:AdminEvent){closeInbox();router.push(destination(item))}
 return <div className="relative" data-admin-inbox>
  <button type="button" onClick={()=>isOpen?closeInbox():openInbox()} aria-label={ru?"Уведомления администратора":"Benachrichtigungen"} aria-expanded={isOpen}
   className="relative inline-flex h-10 min-w-10 items-center justify-center gap-2 rounded-md border border-[#e6e0dd] bg-[#faf9f7] px-2.5 hover:bg-[#f1ece9]">
   <Bell size={19} strokeWidth={1.7}/>
   <AdminNotificationBadge count={total}/>
  </button>
  {isOpen&&<>
   <button type="button" className="fixed inset-0 z-[65] cursor-default bg-black/10 sm:bg-transparent" onClick={closeInbox} aria-label={ru?"Закрыть уведомления":"Benachrichtigungen schließen"}/>
   <section className="fixed inset-x-3 top-[70px] z-[70] max-h-[min(75vh,560px)] overflow-hidden rounded-xl border border-[#e8dfd9] bg-white shadow-2xl sm:absolute sm:inset-x-auto sm:right-0 sm:top-12 sm:w-[420px]" role="dialog" aria-label={categoryTitle}>
    <div className="flex items-center justify-between border-b border-[#eee9e5] bg-[#faf9f7] px-4 py-3">
     <div><p className="text-[10px] uppercase tracking-[.14em] text-[#9a8077]">EURO PERFUME</p><h2 className="mt-1 text-[15px] font-medium">{categoryTitle}</h2></div>
     <button type="button" onClick={closeInbox} className="rounded p-2 hover:bg-neutral-100" aria-label={ru?"Закрыть":"Schließen"}><X size={19}/></button>
    </div>
    <div className="max-h-[min(62vh,460px)] overflow-y-auto">
     {presented.length===0?<p className="flex items-center gap-3 p-6 text-sm text-neutral-500"><CheckCheck size={22}/>{ru?"Новых уведомлений нет":"Keine neuen Benachrichtigungen"}</p>
      :presented.map(item=><button type="button" key={item.id} onClick={()=>openItem(item)}
       className="flex w-full flex-col gap-1 border-b border-[#f0ece9] px-4 py-3 text-left hover:bg-[#faf8f7]">
        <span className="flex w-full items-center justify-between gap-3"><strong className="text-sm font-medium">{(messages[item.kind]||[item.kind,item.kind])[ru?0:1]}</strong><span className="text-[11px] text-[#957a72]">{categoryNames[item.category][ru?0:1]}</span></span>
        {(item.email||item.orderId)&&<span className="break-all text-xs text-neutral-600">{item.email||""}{item.orderId?` · #${item.orderId}`:""}</span>}
        <span className="inline-flex items-center gap-1 text-[11px] text-neutral-500"><Clock3 size={12}/>{new Intl.DateTimeFormat(ru?"ru-RU":"de-DE",{timeZone:"Europe/Berlin",day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}).format(new Date(item.createdAt))}</span>
       </button>)}
    </div>
    <div className="flex items-center justify-between gap-2 border-t px-4 py-3 text-xs text-neutral-500">
     <span>{loading?(ru?"Отмечаю сообщения как просмотренные…":"Nachrichten als gelesen markieren…"):(presented.some(item=>item.kind==="new_order")?(ru?"Новый заказ исчезнет из счётчика после статуса «В обработке»":"Neue Bestellungen verschwinden bei Status „In Bearbeitung“"):(ru?"Просмотренные сообщения исчезают из счётчика":"Gelesene Nachrichten verschwinden vom Zähler"))}</span>
     {total>presented.length&&<span className="tabular-nums">{total} {ru?"всего новых":"insgesamt neu"}</span>}
    </div>
   </section>
  </>}
 </div>;
}
