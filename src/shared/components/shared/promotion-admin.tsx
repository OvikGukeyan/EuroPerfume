"use client";
import { useCallback, useEffect, useState } from "react";
import { PromotionProductPicker } from "./promotion-product-picker";
import { useLocale } from "next-intl";
type Entry={
 id:string;slug:string;titleRu:string;titleDe:string;active:boolean;
 productIds:number[];giftProductId:number;requiredMl:number;giftMl:number;
 heroImage:string|null;priority:number; startsAt?:string|null;endsAt?:string|null;
 orderRevenue?:number;extraOrders?:number;viewCount?:number;clickCount?:number;addCount?:number;
 _count?:{orders:number;carts:number};
};
type Item={id:number;name:string;brand:string;image:string;price5:number;price2:number};
type Draft=Omit<Entry,"id"> & {id?:string};
const fresh=():Draft=>({slug:"",titleRu:"",titleDe:"",active:false,productIds:[],giftProductId:0,requiredMl:5,giftMl:2,heroImage:"",priority:10,startsAt:null,endsAt:null});
const euro=(n:number)=>new Intl.NumberFormat("de-DE",{style:"currency",currency:"EUR"}).format(n);
const input="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-3 text-sm text-stone-900 focus:border-stone-700 focus:outline-none";
const localTime=(s?:string|null)=>{if(!s)return "";const d=new Date(s);const local=new Date(d.getTime()-d.getTimezoneOffset()*60000);return local.toISOString().slice(0,16);};
const toIso=(s:string)=>s?new Date(s).toISOString():null;
export function PromotionAdmin(){
 const locale=useLocale(),ru=locale==="ru";
 const [list,setList]=useState<Entry[]>([]);
 const [draft,setDraft]=useState<Draft>(fresh);
 const [selected,setSelected]=useState<Item[]>([]);
 const [message,setMessage]=useState("");
 const [busy,setBusy]=useState(false);
 const [loading,setLoading]=useState(true);
 const [dateStart,setDateStart]=useState("");
 const [dateEnd,setDateEnd]=useState("");
 const load=useCallback(async()=>{
  try {
   const res=await fetch("/api/admin/promotions",{cache:"no-store"});
   if(!res.ok) throw new Error(res.status===403?"Недостаточно прав доступа":"Не удалось загрузить акции");
   const data:Entry[]=await res.json();
   setList(data.sort((a,b)=>b.priority-a.priority));
  } catch(e){setMessage(e instanceof Error?e.message:"Ошибка загрузки");}
  finally{setLoading(false);}
 },[]);
 useEffect(()=>{void load()},[load]);
 useEffect(()=>{
  const ids=[...draft.productIds,...(draft.giftProductId?[draft.giftProductId]:[])];
  if(!ids.length){setSelected([]);return;}
  const ctrl=new AbortController();
  void fetch("/api/admin/promotions/products?ids="+ids.join(","),{signal:ctrl.signal})
   .then(r=>r.ok?r.json():[]).then((data:Item[])=>setSelected(data)).catch(()=>undefined);
  return ()=>ctrl.abort();
 },[draft.productIds.join(","),draft.giftProductId]);
 const bought=draft.productIds.map(id=>selected.find(p=>p.id===id));
 const gift=selected.find(p=>p.id===draft.giftProductId);
 const total=bought.reduce((sum,p)=>sum+(p?.price5||0),0);
 const giftValue=gift?.price2||0;
 const valid=draft.productIds.length===2&&new Set(draft.productIds).size===2&&!!gift&&!draft.productIds.includes(draft.giftProductId);
 const previewReady=valid && bought.every(Boolean);
 function edit(p:Entry){
  setDraft({...p,heroImage:p.heroImage||""});
  setDateStart(localTime(p.startsAt));
  setDateEnd(localTime(p.endsAt));
  setMessage("");
  document.getElementById("promotion-editor")?.scrollIntoView({behavior:"smooth",block:"start"});
 }
 function reset(){setDraft(fresh());setDateStart("");setDateEnd("");setMessage("");}
 async function persist(value:Draft,quiet=false){
  setBusy(true);setMessage("");
  try{
   const body={...value,heroImage:value.heroImage||null,startsAt:quiet?(value.startsAt||null):toIso(dateStart),endsAt:quiet?(value.endsAt||null):toIso(dateEnd)};
   const res=await fetch("/api/admin/promotions",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
   const data=await res.json().catch(()=>({}));
   if(!res.ok)throw new Error(typeof data.error==="string"?data.error:"Проверьте названия, товары и даты");
   if(!quiet){setDraft({...value,id:data.id});setMessage("Акция сохранена. Изменения видны на сайте автоматически.");}
   await load();
  }catch(e){setMessage(e instanceof Error?e.message:"Ошибка сохранения");}
  finally{setBusy(false);}
 }
 async function save(e:React.FormEvent){e.preventDefault();await persist(draft);}
 async function toggle(p:Entry){await persist({...p,active:!p.active,heroImage:p.heroImage||""},true);}
 return <main className="mx-auto max-w-[1140px] space-y-7 px-4 pb-14 pt-6 text-[#292823] md:px-8">
  <header className="flex flex-wrap items-center justify-between gap-4">
   <div>
    <p className="text-xs font-semibold uppercase tracking-[.18em] text-[#88786c]">EURO PERFUME · ADMIN</p>
    <h1 className="mt-2 font-serif text-3xl md:text-4xl">Управление акциями</h1>
    <p className="mt-2 text-sm text-stone-600">Создавайте слайды, выбирайте ароматы и управляйте публикацией без разработчика.</p>
   </div>
   <button type="button" onClick={reset} className="rounded-full bg-[#292825] px-5 py-3 text-sm font-semibold text-white">+ Новая акция</button>
  </header>
  <section className="rounded-[24px] border border-[#e9e1d8] bg-[#f8f5f0] p-4 md:p-6">
   <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold">Ваши акции ({list.length})</h2><span className="text-xs text-stone-500">Порядок по приоритету ↓</span></div>
   {loading?<p className="text-sm">Загрузка…</p>:list.length===0?<p className="text-sm text-stone-600">Акций пока нет. Создайте первую ниже.</p>:
   <div className="grid gap-3 md:grid-cols-2">{list.map(p=><article key={p.id} className="rounded-[18px] border border-stone-200 bg-white p-4">
    <div className="flex items-start justify-between gap-3">
     <div className="min-w-0"><h3 className="font-semibold">{p.titleRu}</h3><p className="mt-1 break-all text-xs text-stone-500">{p.slug}</p></div>
     <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${p.active?"bg-emerald-50 text-emerald-800":"bg-stone-100 text-stone-600"}`}>{p.active?"Включена":"Выключена"}</span>
    </div>
    <p className="mt-2 text-xs text-stone-600">2 × {p.requiredMl} мл + {p.giftMl} мл подарок · Слайд: {p.priority}</p>
    <p className="mt-2 text-xs text-stone-500">Просмотры {p.viewCount||0} · В корзину {p.addCount||0} · Заказы {p._count?.orders||0}</p>
    <div className="mt-4 flex flex-wrap gap-2">
     <button type="button" onClick={()=>edit(p)} className="rounded-full border border-stone-300 px-4 py-2 text-xs font-semibold">Редактировать</button>
     <button type="button" disabled={busy} onClick={()=>void toggle(p)} className="rounded-full border border-stone-300 px-4 py-2 text-xs font-semibold disabled:opacity-50">{p.active?"Убрать с сайта":"Показать на сайте"}</button>
     {p.active&&<a href={`/${locale}/offers/${p.slug}`} target="_blank" rel="noreferrer" className="rounded-full px-3 py-2 text-xs underline">Посмотреть ↗</a>}
    </div>
   </article>)}</div>}
  </section>
  <form id="promotion-editor" onSubmit={save} className="grid gap-5 rounded-[24px] border border-[#e9e1d8] bg-white p-5 md:grid-cols-2 md:p-8">
   <div className="md:col-span-2"><h2 className="font-serif text-2xl">{draft.id?"Редактировать акцию":"Создать новую акцию"}</h2><p className="mt-1 text-sm text-stone-500">Сохраните как черновик или включите показ в слайдере.</p></div>
   <label className="text-sm font-medium">Название на русском<input className={input} required minLength={3} value={draft.titleRu} onChange={e=>setDraft({...draft,titleRu:e.target.value})} placeholder="Акция"/></label>
   <label className="text-sm font-medium">Название на немецком<input className={input} required minLength={3} value={draft.titleDe} onChange={e=>setDraft({...draft,titleDe:e.target.value})} placeholder="Aktion"/></label>
   <label className="text-sm font-medium">Ссылка (латиницей)<input className={input} required pattern="[a-z0-9-]{3,60}" value={draft.slug} onChange={e=>setDraft({...draft,slug:e.target.value})} placeholder="new-offer"/></label>
   <label className="text-sm font-medium">Порядок слайда<input type="number" min={0} max={100} className={input} value={draft.priority} onChange={e=>setDraft({...draft,priority:Number(e.target.value)})}/><span className="mt-1 block text-xs text-stone-500">Чем выше число, тем раньше показывается акция.</span></label>
   <div className="md:col-span-2"><PromotionProductPicker label="1. Выберите два аромата для покупки" ids={draft.productIds} multiple onChange={ids=>setDraft({...draft,productIds:ids.slice(0,2)})}/><p className="mt-1 text-xs text-stone-500">Клиент обязательно покупает оба аромата по 5 мл.</p></div>
   <div className="md:col-span-2"><PromotionProductPicker label="2. Выберите аромат в подарок" ids={draft.giftProductId?[draft.giftProductId]:[]} onChange={ids=>setDraft({...draft,giftProductId:ids[0]||0})} multiple={false}/><p className="mt-1 text-xs text-stone-500">Подарок — 2 мл за 0,00 € при выполнении условий акции.</p></div>
   <div className="md:col-span-2"><div className="grid gap-2 rounded-2xl bg-[#f4efe8] p-4 md:grid-cols-3">
    <div><p className="text-xs text-stone-500">Стоимость двух ароматов</p><p className="mt-1 text-xl font-semibold">{previewReady?euro(total):"Выберите товары"}</p></div>
    <div><p className="text-xs text-stone-500">Обычная стоимость с подарком</p><p className="mt-1 text-xl font-semibold">{previewReady?euro(total+giftValue):"—"}</p></div>
    <div><p className="text-xs text-stone-500">Выгода покупателя</p><p className="mt-1 text-xl font-semibold text-emerald-800">{previewReady?euro(giftValue):"—"}</p></div>
   </div><p className="mt-2 text-xs text-stone-500">Предпросмотр рассчитан по текущим ценам 5 мл и 2 мл в каталоге, включая действующие скидки. На сайте цена пересчитывается автоматически.</p></div>
   <label className="text-sm font-medium">Начало показа (необязательно)<input type="datetime-local" className={input} value={dateStart} onChange={e=>setDateStart(e.target.value)}/></label>
   <label className="text-sm font-medium">Окончание показа (необязательно)<input type="datetime-local" className={input} value={dateEnd} onChange={e=>setDateEnd(e.target.value)}/></label>
   <label className="text-sm font-medium md:col-span-2">Ссылка на индивидуальное изображение баннера (необязательно)<input type="url" className={input} value={draft.heroImage||""} onChange={e=>setDraft({...draft,heroImage:e.target.value})} placeholder="https://..."/><span className="mt-1 block text-xs text-stone-500">Без изображения используются фотографии выбранных флаконов из каталога.</span></label>
   <label className="flex items-center gap-3 rounded-2xl bg-[#f8f5f0] p-4 text-sm font-semibold md:col-span-2"><input type="checkbox" className="h-5 w-5 accent-stone-800" checked={draft.active} onChange={e=>setDraft({...draft,active:e.target.checked})}/> Показывать акцию на главной странице</label>
   <div className="flex flex-wrap gap-3 md:col-span-2">
    <button type="submit" disabled={busy||!valid} className="rounded-full bg-[#292825] px-7 py-3 text-sm font-semibold text-white disabled:opacity-50">{busy?"Сохраняю…":"Сохранить акцию"}</button>
    <button type="button" onClick={reset} className="rounded-full border border-stone-300 px-6 py-3 text-sm">Отмена / новая акция</button>
   </div>
   <p role="status" aria-live="polite" className="text-sm text-stone-700 md:col-span-2">{message}</p>
  </form>
 </main>;
}
