"use client";
import { useMemo, useState } from "react";
import { saveDayOffer, cancelDayOffer } from "@/src/app/day-offer-actions";

type Option={id:number;name:string;brand:string;image:string;regular:number;sale:number;allowed:boolean};
type Scheduled={id:number;brand:string;name:string;startLabel:string;endLabel:string}|null;
type Week={startLabel:string;endLabel:string};
const euro=(v:number)=>new Intl.NumberFormat("de-DE",{style:"currency",currency:"EUR"}).format(v);

function WeekEditor({slot,products,entry,otherId,week}:{
 slot:"current"|"next";products:Option[];entry:Scheduled;otherId?:number;week:Week;
}){
 const [selectedId,setSelectedId]=useState(entry?.id||(slot==="current"?products.find(p=>p.name.trim().toLowerCase()==="addictive vibration")?.id:undefined)||0);
 const selected=useMemo(()=>products.find(p=>p.id===selectedId)||null,[products,selectedId]);
 const unavailable=Boolean(selected && (!selected.allowed || selected.id===otherId));
 const current=slot==="current";
 return <section className="grid gap-5 rounded-[24px] border border-[#e5ded6] bg-white p-4 md:grid-cols-[1fr_.9fr] md:p-7">
  <div className="space-y-4">
   <div>
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${current?"bg-[#282825] text-white":"bg-[#eee6dc] text-[#54473b]"}`}>{current?"Текущая неделя":"Следующая неделя"}</span>
    <h2 className="mt-3 font-serif text-2xl">{week.startLabel} — {week.endLabel}</h2>
    <p className="mt-1 text-xs leading-relaxed text-stone-600">{current?"Скидка начинается сразу после сохранения и действует до понедельника 00:00.":"Аромат можно назначить заранее: скидка и слайд включатся в понедельник в 00:00, без дополнительных действий."}</p>
   </div>
   {entry&&<div className="rounded-xl bg-emerald-50 px-4 py-3">
    <p className="text-xs font-semibold text-emerald-800">{current?"АКТИВЕН":"ЗАПЛАНИРОВАН"}</p>
    <p className="mt-1 text-sm font-semibold">{entry.brand} · {entry.name}</p>
    <p className="mt-1 text-xs text-stone-600">{entry.startLabel} — {entry.endLabel}</p>
    <form action={cancelDayOffer} className="mt-2"><input type="hidden" name="productId" value={entry.id}/><button type="submit" className="text-xs font-semibold underline underline-offset-4">Отменить {current?"текущую":"запланированную"} акцию</button></form>
   </div>}
   <form action={saveDayOffer} className="space-y-4">
    <input type="hidden" name="slot" value={slot}/>
    <label className="block text-sm font-semibold">Выбери аромат из каталога
     <select required name="productId" value={selectedId||""} onChange={e=>setSelectedId(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-3 py-3 text-sm">
       <option value="" disabled>Выберите аромат</option>
       {products.map(p=><option key={p.id} value={p.id} disabled={!p.allowed || p.id===otherId}>{p.brand} · {p.name}{!p.allowed?" (другая скидка)":p.id===otherId?" (другая неделя)":""}</option>)}
     </select>
    </label>
    <label className="flex items-start gap-3 text-xs leading-relaxed text-stone-700">
     <input type="checkbox" required name="referenceConfirmed" className="mt-1 h-4 w-4 shrink-0 accent-[#292825]"/>
     <span>Подтверждаю проверку низшей цены за предыдущие 30 дней (§ 11 PAngV) и корректность цен до скидки.</span>
    </label>
    <button type="submit" disabled={!selected||unavailable} className="w-full rounded-full bg-[#292825] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#554a3f] disabled:opacity-40">
      {entry?"Заменить аромат":"Сохранить аромат"} {current?"этой недели":"следующей недели"}
    </button>
   </form>
  </div>
  <aside className="relative isolate flex min-h-[360px] flex-col overflow-hidden rounded-[20px] bg-[linear-gradient(115deg,#f4f0eb_0%,#e9e5df_55%,#d4cec8_100%)] p-5 md:p-6" aria-label="Предпросмотр">
   <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 h-[290px] w-[290px] rounded-full border-[32px] border-[#6a565b]/20" />
   <div className="relative z-10">
    <p className="text-[10px] font-medium uppercase tracking-[.17em] text-[#6b5c5e]">EURO PERFUME · АРОМАТ НЕДЕЛИ</p>
    <div aria-hidden="true" className="mt-4 h-px w-10 bg-[#89767c]/65"/>
    <h3 className="mt-4 break-words font-serif text-[30px] font-normal leading-[1.08] tracking-[-.03em]">{selected?.name||"Выбери аромат"}</h3>
    <p className="mt-2 text-[11px] uppercase tracking-[.12em] text-[#74656a]">{selected?.brand||"EURO PERFUME"}</p>
   </div>
   <div className="relative z-10 my-4 flex min-h-40 flex-1 items-center justify-center">
    {selected?.image&&<img src={selected.image} alt={selected.name} className="max-h-52 w-full object-contain mix-blend-multiply [mask-image:radial-gradient(ellipse_79%_85%_at_center,#000_66%,transparent_100%)]"/>}
   </div>
   {selected&&<div className="relative z-10">
    <p className="font-serif text-[37px] leading-none text-[#522f3e]">−10%</p>
    <div className="mt-2 flex flex-wrap items-baseline gap-2"><strong className="text-[19px]">{euro(selected.sale)}</strong><del className="text-[12px] text-stone-500">{euro(selected.regular)}</del><span className="text-xs text-stone-500">5 ml</span></div>
   </div>}
   <p className="relative z-10 mt-3 text-[11px] text-[#75695e]">Нишевая парфюмерия · Отливанты. Фото и цена автоматически изменятся при выборе другого аромата.</p>
  </aside>
 </section>;
}
export function DayOfferAdmin({products,current,next,currentWeek,nextWeek}:{
 products:Option[];current:Scheduled;next:Scheduled;currentWeek:Week;nextWeek:Week;
}){
 return <main className="mx-auto max-w-6xl space-y-6 px-4 py-7 md:px-8">
  <header>
   <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#9d8a7b]">EURO PERFUME · ADMIN</p>
   <h1 className="mt-2 font-serif text-3xl text-[#282622] md:text-4xl">Аромат недели −10%</h1>
   <p className="mt-2 max-w-3xl text-sm leading-relaxed text-stone-600">Назначай аромат на эту и следующую неделю. С наступлением понедельника в 00:00 по Германии скидка предыдущего аромата выключится, а запланированный аромат появится на главной и получит −10% в карточке и корзине. Новые баннеры загружать не нужно.</p>
  </header>
  <WeekEditor slot="current" products={products} entry={current} otherId={next?.id} week={currentWeek}/>
  <WeekEditor slot="next" products={products} entry={next} otherId={current?.id} week={nextWeek}/>
  <p className="text-xs leading-relaxed text-stone-600">Если на следующую неделю ничего не назначено, после окончания текущей акции слайд исчезнет до выбора нового аромата. Скидки не суммируются. Полные флаконы не участвуют: акция действует на отливанты выбранного аромата.</p>
 </main>;
}
