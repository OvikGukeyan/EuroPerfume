"use client";
import {useState} from "react";
import {useLocale} from "next-intl";
import {useRouter} from "next/navigation";
import {MailPlus, Send, Pause, Play, ShieldCheck} from "lucide-react";
type Campaign={id:string;name:string;segment:string;status:string;subjectRu:string;subjectDe:string;sent:number;total:number};
export function MarketingConsole({ready,counts,campaigns}:{
 ready:boolean;counts:{all:number;noOrders:number;withOrders:number};campaigns:Campaign[]
}){
 const ru=useLocale()==="ru",router=useRouter();
 const [busy,setBusy]=useState(false),[notice,setNotice]=useState("");
 const [form,setForm]=useState({name:"",segment:"ALL",subjectRu:"",subjectDe:"",bodyRu:"",bodyDe:""});
 const send=async(input:Record<string,unknown>)=>{
  setBusy(true);setNotice("");
  try{
   const response=await fetch("/api/admin/marketing-campaigns",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(input)});
   const res=await response.json();if(!response.ok)throw new Error(res.error||"FAILED");
   setNotice(input.action==="send_next"
     ? (ru?`Отправлено: ${res.sent}, не доставлено: ${res.failed}. Для следующей партии нажмите ещё раз.`:`Versendet: ${res.sent}, Fehler: ${res.failed}. Für nächste Charge erneut klicken.`)
     : (ru?"Сохранено":"Gespeichert"));
   router.refresh();
  }catch(e){setNotice(e instanceof Error?e.message:"FAILED")}finally{setBusy(false)}
 };
 const input=(field:keyof typeof form)=>(<input value={form[field]} onChange={e=>setForm(v=>({...v,[field]:e.target.value}))} required className="h-11 w-full rounded-md border bg-white px-3 text-sm"/>);
 const area=(field:"bodyRu"|"bodyDe")=><textarea value={form[field]} onChange={e=>setForm(v=>({...v,[field]:e.target.value}))} required rows={5} className="w-full rounded-md border bg-white p-3 text-sm"/>;
 return <div className="grid gap-6 xl:grid-cols-[minmax(300px,390px)_minmax(0,1fr)]">
  <section className="rounded-lg border border-[#e8e3df] bg-[#faf9f7] p-5">
   <h2 className="flex items-center gap-2 text-lg font-medium"><MailPlus size={19}/>{ru?"Новая рассылка":"Neuer Newsletter"}</h2>
   <p className="mt-2 text-xs leading-5 text-[#656565]">{ru?"Только подтверждённые подписчики EURO PERFUME на Vercel. Отправка по 5 писем за нажатие и только после активации кампании.":"Nur bestätigte Vercel-Newsletter-Abonnenten. Versand erfolgt manuell in Chargen zu 5."}</p>
   <form className="mt-5 grid gap-3" onSubmit={e=>{e.preventDefault();void send({action:"create",...form})}}>
    <label className="grid gap-1 text-xs">{ru?"Название кампании":"Kampagnenname"}{input("name")}</label>
    <label className="grid gap-1 text-xs">{ru?"Аудитория":"Zielgruppe"}<select className="h-11 rounded-md border bg-white px-3 text-sm" value={form.segment} onChange={e=>setForm(v=>({...v,segment:e.target.value}))}>
     <option value="ALL">{ru?"Все подписчики":"Alle Abonnenten"} ({counts.all})</option>
     <option value="NO_ORDERS">{ru?"Без заказов в аккаунте":"Ohne Kontobestellungen"} ({counts.noOrders})</option>
     <option value="WITH_ORDERS">{ru?"С заказами в аккаунте":"Mit Kontobestellungen"} ({counts.withOrders})</option>
    </select></label>
    <label className="grid gap-1 text-xs">{ru?"Тема письма RU":"Betreff RU"}{input("subjectRu")}</label>
    <label className="grid gap-1 text-xs">{ru?"Тема письма DE":"Betreff DE"}{input("subjectDe")}</label>
    <label className="grid gap-1 text-xs">{ru?"Текст письма RU":"Nachricht RU"}{area("bodyRu")}</label>
    <label className="grid gap-1 text-xs">{ru?"Текст письма DE":"Nachricht DE"}{area("bodyDe")}</label>
    <button type="submit" disabled={busy||!ready} className="min-h-11 rounded-md bg-neutral-900 px-4 text-sm text-white disabled:opacity-50">{ru?"Сохранить черновик":"Entwurf speichern"}</button>
   </form>
  </section>
  <div className="space-y-4">
   <div className="grid grid-cols-3 gap-2">
    {[
     {label:ru?"Подписаны":"Abonniert",value:counts.all},
     {label:ru?"Без заказов":"Ohne Bestellung",value:counts.noOrders},
     {label:ru?"Есть заказы":"Mit Bestellungen",value:counts.withOrders}
    ].map(item=><div key={item.label} className="rounded-lg border p-3"><p className="text-[11px] text-neutral-500">{item.label}</p><strong className="mt-1 block text-xl font-medium tabular-nums">{item.value}</strong></div>)}
   </div>
   {!ready&&<p role="status" className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">{ru?"Маркетинговая база ещё не обновлена. До миграции рассылка отключена.":"Migration ausstehend: Newsletter ist deaktiviert."}</p>}
   {notice&&<p role="status" className="rounded-md bg-[#f8f5f2] p-3 text-sm">{notice}</p>}
   <div className="overflow-hidden rounded-lg border bg-white"><h2 className="border-b p-4 text-lg font-medium">{ru?"Кампании":"Kampagnen"}</h2>
    {campaigns.length?campaigns.map(c=><div key={c.id} className="border-b p-4">
     <div className="flex flex-wrap items-start justify-between gap-2"><div><strong>{c.name}</strong><p className="mt-1 text-xs text-neutral-500">{c.subjectRu} / {c.subjectDe}</p>
     <p className="mt-1 text-xs text-neutral-500">{ru?"Получили":"Versendet"}: {c.sent} · {ru?"Попыток":"Versuche"}: {c.total} · {c.segment}</p></div>
      <span className="rounded bg-neutral-100 px-2 py-1 text-[11px]">{c.status}</span></div>
     <div className="mt-3 flex flex-wrap gap-2">
      {c.status!=="ACTIVE"&&c.status!=="DONE"&&<button disabled={busy||!ready} type="button" onClick={()=>{if(confirm(ru?"Запустить выбранную кампанию?":"Kampagne aktivieren?"))void send({action:"activate",id:c.id})}} className="inline-flex min-h-9 items-center gap-2 rounded-md border px-3 text-xs"><Play size={14}/>{ru?"Активировать":"Aktivieren"}</button>}
      {c.status==="ACTIVE"&&<>
       <button disabled={busy||!ready} type="button" onClick={()=>{if(confirm(ru?"Отправить ещё 5 писем только подтвердившим подписку?":"5 weitere Newsletter an bestätigte Abonnenten senden?"))void send({action:"send_next",id:c.id})}} className="inline-flex min-h-9 items-center gap-2 rounded-md bg-neutral-900 px-3 text-xs text-white"><Send size={14}/>{ru?"Отправить следующую пятёрку":"Weitere 5 senden"}</button>
       <button disabled={busy} onClick={()=>void send({action:"pause",id:c.id})} className="inline-flex min-h-9 items-center gap-2 rounded-md border px-3 text-xs"><Pause size={14}/>{ru?"Пауза":"Pause"}</button>
      </>}
     </div>
    </div>):<p className="p-5 text-sm text-neutral-500">{ru?"Кампаний пока нет.":"Noch keine Kampagnen."}</p>}
   </div>
   <p className="flex gap-2 rounded-lg border border-[#e4e7e2] bg-[#f6f9f6] p-4 text-xs leading-5 text-[#3a5d49]"><ShieldCheck size={20} className="shrink-0"/>{ru?"Программа отправляет только клиентам с активным подтверждённым согласием. Каждое письмо содержит ссылку отписки. Письма заказов не связаны с рекламными рассылками.":"Nur aktive Double-Opt-in-Einwilligungen, mit Abmeldelink in jeder Marketing-E-Mail."}</p>
  </div>
 </div>;
}
