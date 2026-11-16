"use client";
import { useEffect, useState } from "react";
type Entry={id:string;slug:string;titleRu:string;titleDe:string;active:boolean;productIds:number[];giftProductId:number;requiredMl:number;giftMl:number;heroImage:string|null;priority:number;_count?:{orders:number;carts:number}};
const empty={slug:"",titleRu:"",titleDe:"",active:false,productIds:[] as number[],giftProductId:0,requiredMl:5,giftMl:2,heroImage:"",priority:10};
export function PromotionAdmin() {
  const [list,setList]=useState<Entry[]>([]);
  const [draft,setDraft]=useState<typeof empty & {id?:string}>(empty);
  const [message,setMessage]=useState("");
  const [busy,setBusy]=useState(false);
  async function load() {
    const res=await fetch("/api/admin/promotions",{cache:"no-store"});
    if (!res.ok) {setMessage("Для управления акциями требуется миграция базы данных.");return;}
    setList(await res.json());
  }
  useEffect(()=>{void load()},[]);
  async function save(e:React.FormEvent) {
    e.preventDefault();setBusy(true);setMessage("");
    try {
      const res=await fetch("/api/admin/promotions",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...draft,heroImage:draft.heroImage||null})});
      if(!res.ok) {setMessage("Не удалось сохранить: проверьте ID товаров, уникальность названия и миграцию.");return;}
      setMessage("Сохранено");setDraft(empty);await load();
    } catch {setMessage("Ошибка соединения");} finally {setBusy(false)}
  }
  const input="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm";
  return <main className="mx-auto max-w-5xl space-y-7 p-5">
    <h1 className="text-2xl font-medium">Акции EURO PERFUME</h1>
    <p className="text-sm text-neutral-600">Настройки сохраняются в базе. Изменения не переписывают историю завершённых заказов.</p>
    <section className="grid gap-3">
      {list.map(p=><button type="button" key={p.id} onClick={()=>setDraft({...p,heroImage:p.heroImage||""})} className="rounded-lg border bg-white p-4 text-left">
        <strong>{p.titleRu}</strong> · {p.slug} · {p.active?"Активна":"Черновик"}
        <p className="text-xs text-neutral-500">Заказов: {p._count?.orders||0} · В корзинах: {p._count?.carts||0}</p>
      </button>)}
    </section>
    <form onSubmit={save} className="grid gap-4 rounded-xl border bg-white p-5">
      <h2 className="text-lg font-medium">{draft.id?"Редактирование":"Новая акция"}</h2>
      <label>Код ссылки<input className={input} required value={draft.slug} onChange={e=>setDraft({...draft,slug:e.target.value})} placeholder="woody-selection"/></label>
      <label>Название RU<input className={input} required value={draft.titleRu} onChange={e=>setDraft({...draft,titleRu:e.target.value})}/></label>
      <label>Название DE<input className={input} required value={draft.titleDe} onChange={e=>setDraft({...draft,titleDe:e.target.value})}/></label>
      <label>ID обязательных ароматов через запятую<input className={input} required value={draft.productIds.join(",")} onChange={e=>setDraft({...draft,productIds:e.target.value.split(",").map(x=>Number(x.trim())).filter(Number.isInteger).filter(Boolean)})}/></label>
      <label>ID подарка<input type="number" min="1" className={input} required value={draft.giftProductId||""} onChange={e=>setDraft({...draft,giftProductId:Number(e.target.value)})}/></label>
      <div className="grid grid-cols-2 gap-3">
        <label>Объём покупки (мл)<input type="number" min="1" max="30" className={input} value={draft.requiredMl} onChange={e=>setDraft({...draft,requiredMl:Number(e.target.value)})}/></label>
        <label>Объём подарка (мл)<input type="number" min="1" max="30" className={input} value={draft.giftMl} onChange={e=>setDraft({...draft,giftMl:Number(e.target.value)})}/></label>
      </div>
      <label>Изображение баннера (URL, необязательно)<input type="url" className={input} value={draft.heroImage||""} onChange={e=>setDraft({...draft,heroImage:e.target.value})}/></label>
      <label className="flex gap-2"><input type="checkbox" checked={draft.active} onChange={e=>setDraft({...draft,active:e.target.checked})}/> Опубликовать акцию</label>
      <div className="flex gap-3">
        <button disabled={busy} className="rounded-lg bg-neutral-900 px-5 py-3 text-white disabled:opacity-50">Сохранить</button>
        <button type="button" className="rounded-lg border px-5 py-3" onClick={()=>setDraft(empty)}>Новая</button>
      </div>
      <p role="status" className="text-sm">{message}</p>
    </form>
  </main>;
}
