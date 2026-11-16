import { prisma } from "@/prisma/prisma-client";
import { getUserSession } from "@/src/shared/server-lib/get-user-session";
import { saveDayOffer, cancelDayOffer } from "@/src/app/day-offer-actions";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export default async function DayOfferPage() {
  const user = await getUserSession();
  if (user?.role !== "ADMIN") notFound();
  const products = await prisma.product.findMany({where:{categoryId:1,available:true},include:{brand:true,productGroup:true},orderBy:{name:"asc"}});
  const active = products.filter(p=>p.dayOfferEndsAt && p.dayOfferEndsAt.getTime()>Date.now());
  const input = "block w-full border rounded p-2 mt-1";
  return <main className="max-w-3xl p-6 space-y-6">
    <h1 className="text-2xl">Товар дня / Tagesangebot −10%</h1>
    <p>Скидка на выбранный товар, включая атомайзер. Формат флакона — отдельный товар. Время по Германии (Europe/Berlin). Обычная цена не изменяется. После окончания акция и слайд отключаются автоматически.</p>
    {active.map(p=><div key={p.id} className="border p-4 rounded"><strong>{p.brand.name} {p.name} {p.bottleParentId ? p.volume+" ml":""}</strong><p>До {p.dayOfferEndsAt!.toLocaleString("de-DE",{timeZone:"Europe/Berlin"})}</p><form action={cancelDayOffer}><input type="hidden" name="productId" value={p.id}/><button className="underline" type="submit">Отменить акцию</button></form></div>)}
    <form action={saveDayOffer} className="space-y-4">
      <label className="block">Аромат / формат<select name="productId" className={input} required defaultValue=""><option disabled value="">Выберите товар</option>{products.map(p=><option key={p.id} value={p.id}>{p.brand.name} · {p.name} {p.bottleParentId ? "· флакон "+p.volume+" ml":"· отливанты"}</option>)}</select></label>
      <label className="block">Начало по Германии (пусто — сейчас)<input className={input} name="start" type="datetime-local"/></label>
      <label className="block">Окончание по Германии (в этот момент скидка выключится)<input className={input} name="end" type="datetime-local" required/></label>
      <p>Для 24 часов задайте окончание через сутки. Для «по 20 ноября включительно» — 21 ноября, 00:00. Можно заранее запланировать следующие товары дня. Интервалы не должны пересекаться.</p>
      {["desktopRu","mobileRu","desktopDe","mobileDe"].map(name=><label key={name} className="block">{({desktopRu:"Баннер RU — компьютер",mobileRu:"Баннер RU — телефон",desktopDe:"Баннер DE — компьютер",mobileDe:"Баннер DE — телефон"} as Record<string,string>)[name]}<input className={input} name={name} type="url" required placeholder="https://…/storage/v1/object/public/slides/…"/></label>)}
      <label className="flex gap-2"><input type="checkbox" name="referenceConfirmed" required/>Подтверждаю: базовая цена каждого объёма соответствует низшей цене за 30 дней до акции (§11 PAngV). Баннеры содержат правильный товар, −10% и срок акции.</label>
      <p>Публикация включает скидку и баннер вместе. Наличие проверяется по отметке на сайте; физический остаток продавец подтверждает перед выставлением счёта.</p>
      <button type="submit" className="bg-black text-white px-5 py-3 rounded">Опубликовать товар дня</button>
    </form>
  </main>;
}
