"use client";
import {useState} from "react";
import {useLocale} from "next-intl";
import {Link} from "@/src/i18n/navigation";
import {useRouter} from "next/navigation";
import {TicketPercent, RotateCcw, Power, PlusCircle, Info} from "lucide-react";

type Row={code:string;discount:number;active:boolean;expiresAt:string|null;disposable:boolean;
 kind:string|null;usedCount:number;epoch:number;globalLimit:number|null;perUserLimit:number|null;validDays:number|null};
export function AdminCouponConsole({rows,ready}:{rows:Row[];ready:boolean}){
 const ru=useLocale()==="ru",router=useRouter();
 const [code,setCode]=useState(""),[percent,setPercent]=useState(10);
 const [kind,setKind]=useState<"WELCOME"|"PER_ACCOUNT"|"UNLIMITED">("PER_ACCOUNT");
 const [perUserLimit,setPerUserLimit]=useState(1),[globalLimit,setGlobalLimit]=useState("");
 const [until,setUntil]=useState(""),[busy,setBusy]=useState(false),[message,setMessage]=useState("");
 const send=async(body:Record<string,unknown>)=>{
  setBusy(true);setMessage("");
  try{
   const res=await fetch("/api/admin/club-coupons",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(body)});
   const result=await res.json();
   if(!res.ok)throw new Error(result.error||"FAILED");
   setMessage(ru?"Изменения сохранены":"Änderungen gespeichert");router.refresh();
  }catch(e){setMessage(ru?"Ошибка: "+(e instanceof Error?e.message:""):"Fehler: "+(e instanceof Error?e.message:""))}
  finally{setBusy(false);}
 };
 const expires=until?new Date(until+"T23:59:59").toISOString():null;
 return <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
  <section className="rounded-lg border border-[#e8e5e2] bg-[#fcfaf8] p-5">
   <h2 className="flex items-center gap-2 text-lg font-medium"><PlusCircle size={18}/>{ru?"Новая кампания":"Neue Kampagne"}</h2>
   <p className="mt-2 text-xs leading-5 text-neutral-600">{ru?"Один код можно печатать на неограниченном числе карточек; ограничения проверяются по подтверждённому аккаунту.":"Ein gemeinsamer Code für beliebig viele Karten, mit Nutzungslimit je verifiziertem Konto."}</p>
   <form className="mt-4 grid gap-3" onSubmit={e=>{e.preventDefault();void send({action:"create",code:code.trim().toUpperCase(),percent,kind,perUserLimit,globalLimit:globalLimit?Number(globalLimit):null,endsAt:expires})}}>
    <label className="grid gap-1 text-xs">{ru?"Код":"Code"}<input required minLength={3} maxLength={48} pattern="[A-Za-z0-9_-]+" className="h-11 rounded-md border bg-white px-3 text-sm uppercase" value={code} onChange={e=>setCode(e.target.value)}/></label>
    <label className="grid gap-1 text-xs">{ru?"Скидка, %":"Rabatt, %"}<input type="number" min={1} max={40} className="h-11 rounded-md border bg-white px-3 text-sm" value={percent} onChange={e=>setPercent(Number(e.target.value))}/></label>
    <label className="grid gap-1 text-xs">{ru?"Тип":"Typ"}<select className="h-11 rounded-md border bg-white px-3 text-sm" value={kind} onChange={e=>setKind(e.target.value as typeof kind)}>
     <option value="PER_ACCOUNT">{ru?"Один или несколько раз на аккаунт":"Pro Konto begrenzt"}</option>
     <option value="WELCOME">{ru?"Приветственный — только первая покупка":"Willkommen – nur Erstkauf"}</option>
     <option value="UNLIMITED">{ru?"Повторяемый для каждого клиента":"Mehrfach je Kunde"}</option>
    </select></label>
    <label className="grid gap-1 text-xs">{ru?"Использований на аккаунт":"Einlösungen pro Konto"}<input type="number" min={1} max={100} className="h-11 rounded-md border bg-white px-3 text-sm" value={perUserLimit} onChange={e=>setPerUserLimit(Number(e.target.value))}/></label>
    <label className="grid gap-1 text-xs">{ru?"Общий лимит (пусто = без лимита)":"Gesamtlimit (leer = unbegrenzt)"}<input type="number" min={1} className="h-11 rounded-md border bg-white px-3 text-sm" value={globalLimit} onChange={e=>setGlobalLimit(e.target.value)}/></label>
    <label className="grid gap-1 text-xs">{ru?"Окончание (пусто = без срока)":"Ende (leer = unbegrenzt)"}<input type="date" className="h-11 rounded-md border bg-white px-3 text-sm" value={until} onChange={e=>setUntil(e.target.value)}/></label>
    <button type="submit" disabled={!ready||busy} className="min-h-11 rounded-md bg-[#292929] px-5 text-sm font-medium text-white disabled:opacity-50">{ru?"Создать код":"Code erstellen"}</button>
   </form>
   {!ready&&<p role="status" className="mt-3 rounded-md bg-amber-50 p-3 text-xs text-amber-900">{ru?"Новая схема базы ещё не применена. Промокоды и заказы не изменены.":"Migration noch nicht ausgeführt. Bestehende Codes bleiben unverändert."}</p>}
   {message&&<p role="status" className="mt-3 text-sm text-[#73534f]">{message}</p>}
  </section>
  <section className="min-w-0 rounded-lg border border-[#e8e5e2] bg-white">
   <h2 className="flex items-center gap-2 border-b px-4 py-4 text-lg font-medium"><TicketPercent size={19}/>{ru?"Все промокоды":"Alle Gutscheincodes"}<span className="ml-auto text-xs text-neutral-500">{rows.length}</span></h2>
   <div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left text-sm">
    <thead className="bg-[#fafafa] text-xs text-neutral-500"><tr><th className="p-3">{ru?"Код":"Code"}</th><th className="p-3">%</th><th className="p-3">{ru?"Режим":"Modus"}</th><th className="p-3">{ru?"Применено":"Nutzung"}</th><th className="p-3">{ru?"Статус":"Status"}</th><th className="p-3">{ru?"Действия":"Aktionen"}</th></tr></thead>
    <tbody>{rows.map(r=><tr key={r.code} className="border-t">
      <td className="p-3"><Link className="font-semibold underline underline-offset-4" href={{pathname:"/insights",query:{promo:r.code.toUpperCase().startsWith("EP15-")?"legacy15":r.code},hash:"promo-history"}}>{r.code}</Link><p className="text-xs text-neutral-500">{r.expiresAt?new Date(r.expiresAt).toLocaleDateString(ru?"ru-RU":"de-DE"):(ru?"Без срока":"Unbefristet")}</p></td>
      <td className="p-3">{r.discount}%</td><td className="p-3 text-xs">{r.kind|| (r.disposable?(ru?"Старый одноразовый":"Alt, einmalig"):(ru?"Старый код":"Altcode"))}{r.kind==="WELCOME"&&<p>60 {ru?"дней":"Tage"}</p>}</td>
      <td className="p-3 tabular-nums">{r.kind?r.usedCount:"—"} {r.globalLimit!==null?"/ "+r.globalLimit:""}</td>
      <td className="p-3">{r.active?<span className="text-[#2b7956]">{ru?"Активен":"Aktiv"}</span>:<span className="text-[#9d5656]">{ru?"Выключен":"Inaktiv"}</span>}</td>
      <td className="p-3"><div className="flex gap-2">
       <button type="button" title={ru?"Пауза / включить":"Pause / aktivieren"} disabled={busy} onClick={()=>void send({action:"toggle",code:r.code,active:!r.active})} className="rounded border p-2 hover:bg-neutral-50"><Power size={16}/></button>
       <button type="button" title={ru?"Новый период (история сохранится)":"Neue Periode, Historie bleibt"} disabled={busy||!ready} onClick={()=>{if(window.confirm(ru?`Перезапустить ${r.code}? Использования нового периода начнутся с нуля. История останется.`:`${r.code} neu starten? Historie bleibt erhalten.`))void send({action:"restart",code:r.code,endsAt:null});}} className="rounded border p-2 hover:bg-neutral-50"><RotateCcw size={16}/></button>
      </div></td>
    </tr>)}</tbody></table></div>
   <div className="flex items-start gap-2 border-t bg-[#fafafa] p-4 text-xs leading-5 text-neutral-600"><Info size={16} className="shrink-0"/>{ru?"Перезапуск сохраняет старую статистику, но разрешает новый период использования. Старые исторические скидки не пересчитываются.":"Ein Neustart behält die alte Historie; neue Einlösungen gelten für die nächste Periode."}</div>
  </section>
 </div>;
}
