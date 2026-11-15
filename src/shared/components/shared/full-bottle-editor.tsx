"use client";
import {useRef,useState} from "react";
import {useRouter} from "next/navigation";
import {saveFullBottle} from "@/src/app/full-bottle-actions";
import type {BottleAdminOption} from "@/src/shared/lib/full-bottle";
import {imageCompressor} from "@/src/shared/lib/image-compressor";

function BottleFields({parentId,bottle}:{parentId:number;bottle?:BottleAdminOption}) {
  const router=useRouter(), form=useRef<HTMLFormElement>(null);
  const [busy,setBusy]=useState(false),[message,setMessage]=useState("");
  const field="mt-1 block min-h-10 w-full rounded-md border bg-white px-2 text-base";
  return <form ref={form} className="space-y-3 border-t py-4" onSubmit={async e=>{
    e.preventDefault(); if(busy)return; const data=new FormData(e.currentTarget);setBusy(true);setMessage("");
    try{
      const file=data.get("photo");if(file instanceof File && file.size) data.set("photo",await imageCompressor(file,"image/webp"));
      if(bottle){data.set("version",bottle.version);data.set("expectedStock",String(bottle.stock));}
      const result=await saveFullBottle(parentId,bottle?.id??null,data);
      if(!result.ok){setMessage(result.message);return;}
      if(!bottle)form.current?.reset();setMessage("Флакон сохранён.");router.refresh();
    }catch{setMessage("Не удалось сохранить. Проверьте фото и соединение.");}finally{setBusy(false);}
  }}>
    <h3 className="font-semibold">{bottle ? "Флакон · "+bottle.ml+" мл" : "Добавить новый объём"}</h3>
    <div className="grid gap-3 sm:grid-cols-3">
      <label>Объём флакона, мл<input className={field} name="ml" type="number" min="1" max="9999" step="1" required readOnly={!!bottle} defaultValue={bottle?.ml} placeholder="50"/></label>
      <label>Цена за флакон, €<input className={field} name="price" type="text" inputMode="decimal" required defaultValue={bottle?.price} placeholder="120,00"/></label>
      <label>Остаток в штуках<input className={field} name="stock" type="number" min="0" max="999999" step="1" required defaultValue={bottle?.stock} placeholder="0"/></label>
    </div>
    <div className="flex flex-wrap items-center gap-3">{bottle?.image && <img src={bottle.image} alt="Фото флакона" width={58} height={58} className="rounded border object-contain"/>}
      <label className="text-sm">Фото флакона<input className="mt-1 block max-w-full" type="file" name="photo" required={!bottle} accept="image/jpeg,image/png,image/webp,image/heic,.heic"/></label>
    </div>
    <button type="submit" disabled={busy} className="rounded-md bg-neutral-900 px-4 py-2 text-white disabled:opacity-50">{busy?"Сохранение…":bottle?"Сохранить изменения флакона":"Добавить флакон"}</button>
    <p role="status" className="text-sm">{message}</p>
  </form>;
}
export function FullBottleEditor({parentId,bottles}:{parentId:number;bottles:BottleAdminOption[]}) {
  return <section id="full-bottles" className="mb-6 rounded-xl border bg-white px-4 pt-4 sm:px-6">
    <h2 className="text-xl font-semibold">Полные флаконы</h2><p className="mb-4 text-sm text-neutral-600">Каждый объём продаётся по своей цене за штуку. Остаток 0 отключает покупку этого объёма.</p>
    {bottles.map(b=><BottleFields key={b.id+":"+b.version+":"+b.stock} parentId={parentId} bottle={b}/>)}
    <BottleFields parentId={parentId}/>
  </section>;
}
