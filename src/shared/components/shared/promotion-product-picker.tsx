"use client";
import { useEffect,useState } from "react";
type Product={id:number;name:string;brand:string};
export function PromotionProductPicker({label,ids,onChange,multiple}:{label:string;ids:number[];onChange:(ids:number[])=>void;multiple:boolean}) {
 const [q,setQ]=useState(""),[results,setResults]=useState<Product[]>([]),[selected,setSelected]=useState<Product[]>([]);
 useEffect(()=>{
  if(!ids.length){setSelected([]);return;}
  const controller=new AbortController();
  void fetch("/api/admin/promotions/products?ids="+ids.join(","),{signal:controller.signal}).then(r=>r.ok?r.json():[]).then(setSelected).catch(()=>undefined);
  return ()=>controller.abort();
 },[ids.join(",")]);
 useEffect(()=>{
  if(q.trim().length<2){setResults([]);return;}
  const controller=new AbortController();
  void fetch("/api/admin/promotions/products?q="+encodeURIComponent(q),{signal:controller.signal}).then(r=>r.ok?r.json():[]).then(setResults).catch(()=>undefined);
  return ()=>controller.abort();
 },[q]);
 return <div className="space-y-2">
  <label className="text-sm font-medium">{label}<input className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" placeholder="Найти аромат по названию" value={q} onChange={e=>setQ(e.target.value)}/></label>
  {results.length>0&&<div className="max-h-52 overflow-auto rounded-lg border bg-white">
   {results.map(p=><button type="button" key={p.id} className="block w-full border-b px-3 py-2 text-left text-sm hover:bg-neutral-100" onClick={()=>{onChange(multiple?[...new Set([...ids,p.id])]:[p.id]);setQ("");setResults([])}}>{p.brand} · {p.name}</button>)}
  </div>}
  <div className="flex flex-wrap gap-2">
   {ids.map(id=><button type="button" key={id} className="rounded-full bg-stone-100 px-3 py-2 text-xs" onClick={()=>onChange(ids.filter(x=>x!==id))}>
    {selected.find(p=>p.id===id)?.name||"Товар #"+id} ×
   </button>)}
  </div>
 </div>;
}
