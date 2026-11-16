import { prisma } from "@/prisma/prisma-client";
import { getUserSession } from "@/src/shared/server-lib/get-user-session";
import { saveDayOffer, cancelDayOffer } from "@/src/app/day-offer-actions";
import { notFound } from "next/navigation";
import { offerPrices } from "@/src/shared/lib/day-offer";

export const dynamic="force-dynamic";
const eur=(v:number)=>new Intl.NumberFormat("de-DE",{style:"currency",currency:"EUR"}).format(v);
export default async function DayOfferPage() {
  const user=await getUserSession();
  if(user?.role!=="ADMIN")notFound();
  const products=await prisma.product.findMany({
    where:{categoryId:1,available:true,bottleParentId:null,productGroup:{onTap:true}},
    include:{brand:true,productGroup:true},
    orderBy:{name:"asc"}
  });
  const now=Date.now();
  const active=products.find(p=>p.dayOfferStartsAt && p.dayOfferEndsAt && new Date(p.dayOfferStartsAt).getTime()<=now && new Date(p.dayOfferEndsAt).getTime()>now);
  const representative=products.find(p=>p.name.trim().toLowerCase()==="addictive vibration");
  const preview=active||representative;
  const priced=preview?offerPrices({price:Number(preview.price),discountPrice:preview.discountPrice?Number(preview.discountPrice):undefined,dayOfferStartsAt:new Date(now-1000),dayOfferEndsAt:new Date(now+86400000)},5,true,now):null;
  return <main className="mx-auto max-w-5xl space-y-6 px-4 py-7 md:px-8">
    <header><p className="text-xs font-semibold uppercase tracking-[.2em] text-[#9d8a7b]">EURO PERFUME · ADMIN</p><h1 className="mt-2 font-serif text-3xl text-[#282622] md:text-4xl">Аромат дня −10%</h1><p className="mt-2 max-w-2xl text-sm leading-relaxed text-stone-600">Выбираешь аромат, проверяешь цену и нажимаешь «Сохранить». Старая акция снимается сразу. Новая действует до 00:00 по Германии и автоматически исчезает из слайдера и карточки товара.</p></header>
    {active&&<section className="rounded-[22px] border border-emerald-200 bg-emerald-50 p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800">СЕЙЧАС АКТИВЕН</p>
      <h2 className="mt-2 text-xl font-semibold">{active.brand.name} · {active.name}</h2>
      <p className="mt-1 text-sm text-neutral-700">До {active.dayOfferEndsAt!.toLocaleString("de-DE",{timeZone:"Europe/Berlin"})}. При выборе другого аромата эта акция отключится автоматически.</p>
      <form action={cancelDayOffer} className="mt-3"><input type="hidden" name="productId" value={active.id}/><button type="submit" className="rounded-full border border-emerald-700 px-4 py-2 text-sm font-medium">Выключить аромат дня</button></form>
    </section>}
    <div className="grid gap-6 md:grid-cols-[1.1fr_.9fr]">
      <form action={saveDayOffer} className="space-y-5 rounded-[24px] border border-stone-200 bg-white p-5 md:p-7">
       <h2 className="font-serif text-2xl">Выбрать аромат</h2>
       <label className="block text-sm font-semibold">Товар из каталога
         <select name="productId" required defaultValue={active?.id||""} className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm">
          <option value="" disabled>Выбрать аромат</option>
          {products.map(p=><option key={p.id} value={p.id}>{p.brand.name} · {p.name.trim()}</option>)}
         </select>
       </label>
       <p className="rounded-xl bg-[#f6f1ea] p-4 text-sm leading-relaxed text-stone-700">Скидка <strong>−10%</strong> действует на все объёмы отливантов этого аромата, включая атомайзер. Полные флаконы — отдельные товары. Баннер создаётся автоматически из фотографии и данных каталога.</p>
       <label className="flex items-start gap-3 text-sm leading-relaxed"><input type="checkbox" name="referenceConfirmed" required className="mt-1 h-4 w-4 accent-neutral-900"/><span>Подтверждаю, что проверил(а) низшую цену за предыдущие 30 дней и корректность информации о скидке по § 11 PAngV. При необходимости условия скидки на сайте должны соответствовать этой цене.</span></label>
       <button type="submit" className="w-full rounded-full bg-[#292825] px-6 py-4 text-sm font-semibold text-white hover:bg-[#4f4439]">{active?"Заменить аромат дня":"Сохранить аромат дня −10%"}</button>
       <p className="text-xs leading-relaxed text-stone-500">Сохранение немедленно заменяет предыдущий товар. После полуночи по Берлину скидка выключается сама, даже если новый аромат ещё не выбран.</p>
      </form>
      <aside className="overflow-hidden rounded-[24px] bg-[#eee8df] p-5 md:p-7">
       <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#8a7566]">ПРИМЕР СЛАЙДА</p>
       <h2 className="mt-4 font-serif text-3xl leading-tight">{preview?.name.trim()||"Аромат дня"}</h2>
       <p className="mt-1 text-xs uppercase tracking-wider text-[#8a7566]">{preview?.brand.name||"EURO PERFUME"}</p>
       {preview?.imageUrl[0]&&<div className="mx-auto my-3 flex h-48 items-center justify-center rounded-xl bg-white/40"><img src={preview.imageUrl[0]} alt={preview.name} className="h-full w-full object-contain mix-blend-multiply"/></div>}
       {priced&&<div className="flex items-center gap-3"><strong className="text-2xl">{eur(priced.effective)}</strong><del className="text-sm text-stone-500">{eur(priced.regular)}</del><span className="rounded-full bg-[#292825] px-3 py-1 text-xs text-white">−10%</span></div>}
       <p className="mt-2 text-xs text-stone-600">Пример цены за 5 мл. Акция на Initio Addictive Vibration не включается автоматически — только после выбора и сохранения.</p>
      </aside>
    </div>
  </main>;
}
