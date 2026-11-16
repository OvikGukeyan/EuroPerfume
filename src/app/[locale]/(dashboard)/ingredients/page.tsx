import { prisma } from "@/prisma/prisma-client";
import { Link } from "@/src/i18n/navigation";
import { resolveIngredients } from "@/src/shared/lib/fragrance-ingredients";
export const dynamic="force-dynamic";
export default async function IngredientsAudit({params}: {params:Promise<{locale:string}>}) {
 const {locale}=await params;
 const ru=locale==="ru";
 const products=await prisma.product.findMany({where:{categoryId:1,bottleParentId:null,concentration:{not:null}},select:{id:true,name:true,available:true,brand:{select:{name:true}},translations:{select:{language:true,activeIngredients:true}}},orderBy:[{available:"desc"},{id:"desc"}]});
 const rows=products.map(p=>({...p,...resolveIngredients(p.id,p.translations,locale)}));
 const active=rows.filter(p=>p.available);
 const missing=active.filter(p=>!p.inci);
 const review=active.filter(p=>p.review);
 return <div className="mx-auto max-w-6xl p-4 md:p-8">
  <h1 className="text-2xl font-medium">{ru?"Составы и аллергены — проверка каталога":"Inhaltsstoffe & Allergene — Katalogprüfung"}</h1>
  <p className="my-4 text-sm leading-6">{ru?`Активных карточек: ${active.length}. Без состава: ${missing.length}. Требуют срочной сверки старого списка: ${review.length}. Наличие текста не означает проверку актуальности состава.`:`Aktive Produkte: ${active.length}. Ohne Liste: ${missing.length}. Alte Listen mit Prüfbedarf: ${review.length}. Ein vorhandener Text bestätigt nicht die Aktualität der Rezeptur.`}</p>
  <p className="mb-6 text-sm leading-6">{ru?"Переносите полный INCI с упаковки продаваемой партии, включая аллергены, в оба языковых поля. Не заменяйте его нотами аромата и не удаляйте отдельные вещества из старого списка. Список производителя на сайте нужно сверить с вашей упаковкой. Для наборов нужен состав каждого входящего аромата.":"Übernimm die vollständige INCI-Liste der verkauften Charge einschließlich der Allergene in beide Sprachfelder. Duftnoten sind keine Inhaltsstoffliste. Einzelne Stoffe dürfen nicht einfach aus einer alten Liste entfernt werden. Herstellerangaben mit der eigenen Verpackung abgleichen. Bei Sets werden die Angaben aller enthaltenen Düfte benötigt."}</p>
  <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b"><th className="p-3">{ru?"Аромат":"Duft"}</th><th className="p-3">{ru?"Статус":"Status"}</th><th className="p-3">INCI</th></tr></thead><tbody>
   {[...rows].sort((a,b)=>Number(b.review)-Number(a.review)||Number(!!a.inci)-Number(!!b.inci)).map(p=><tr key={p.id} className="border-b align-top"><td className="p-3 min-w-48"><Link className="underline" href={`/update/${p.id}`}>{p.brand.name} · {p.name}</Link><p className="mt-1 text-xs text-neutral-500">#{p.id} · {p.available?(ru?"В продаже":"Aktiv"):(ru?"Неактивен":"Inaktiv")}</p></td><td className="p-3 min-w-40">{p.review?(ru?"Сверить старый список с упаковкой":"Alte Liste mit Verpackung abgleichen"):!p.inci?(ru?"Нет состава":"Liste fehlt"):p.source?(ru?"Есть источник; сверить партию":"Quelle vorhanden; Charge abgleichen"):(ru?"Список сохранён; сверить партию":"Liste gespeichert; Charge abgleichen")}</td><td className="p-3 min-w-64 max-w-xl break-words">{p.inci||"—"}{p.source && <a href={p.source.url} target="_blank" rel="noopener noreferrer" className="mt-2 block underline">{ru?"Источник состава":"Quelle der Inhaltsstoffliste"}</a>}</td></tr>)}
  </tbody></table></div>
 </div>;
}
