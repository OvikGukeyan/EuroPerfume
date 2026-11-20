import { prisma } from "@/prisma/prisma-client";
import { Link } from "@/src/i18n/navigation";
import { resolveIngredients } from "@/src/shared/lib/fragrance-ingredients";
export const dynamic="force-dynamic";
export default async function IngredientsAudit({params}:{params:Promise<{locale:string}>}){
 const {locale}=await params,ru=locale==="ru";
 // Include all perfume product parents, even when their concentration isn't populated,
 // and other products that already have saved INCI (do not silently exclude them).
 const products=await prisma.product.findMany({
  where:{bottleParentId:null,OR:[{categoryId:1},{translations:{some:{activeIngredients:{not:null}}}}]},
  select:{id:true,name:true,available:true,categoryId:true,brand:{select:{name:true}},
   translations:{select:{language:true,activeIngredients:true}}},
  orderBy:[{available:"desc"},{id:"desc"}]
 });
 const rows=products.map(p=>{
  const resolved=resolveIngredients(p.id,p.translations,locale);
  const ruSaved=Boolean(p.translations.find(t=>t.language==="RU")?.activeIngredients?.trim());
  const deSaved=Boolean(p.translations.find(t=>t.language==="DE")?.activeIngredients?.trim());
  return {...p,...resolved,ruSaved,deSaved,missing:!resolved.inci,localeMismatch:ruSaved!==deSaved};
 });
 const live=rows.filter(p=>p.available);
 const perfumes=live.filter(p=>p.categoryId===1);
 const missing=perfumes.filter(p=>p.missing);
 const needsReview=live.filter(p=>p.review);
 const incompleteLocales=live.filter(p=>p.localeMismatch);
 const status=(p:typeof rows[number])=>p.review
  ? (ru?"Сверить сохранённый INCI с упаковкой":"Gespeicherte INCI-Liste mit Verpackung abgleichen")
  :p.missing?(ru?"Нет подтверждённого списка INCI":"Keine INCI-Liste hinterlegt")
  :p.localeMismatch?(ru?"Неполные языковые поля":"Sprachfelder unvollständig")
  :p.source?(ru?"Сохранённый источник — проверить партию":"Referenz vorhanden — Charge abgleichen")
  :(ru?"Состав сохранён — проверить партию":"INCI gespeichert — Charge abgleichen");
 return <main className="mx-auto max-w-6xl p-4 md:p-8">
  <h1 className="text-2xl font-medium">{ru?"Проверка составов каталога":"INCI-Katalogprüfung"}</h1>
  <p className="my-4 text-sm text-neutral-700">
   {ru?"Проверяются все парфюмерные карточки и другие товары с сохранёнными составами. INCI в базе не подтверждает актуальность продаваемой партии.":"Geprüft werden alle Parfums und weitere Produkte mit gespeicherten Inhaltsstofflisten. Ein Datenbankeintrag bestätigt nicht die aktuelle Charge."}
  </p>
  <section className="grid grid-cols-2 gap-3 md:grid-cols-4" aria-label={ru?"Статистика INCI":"INCI-Statistik"}>
   {[
    [ru?"Парфюмерия в продаже":"Aktive Parfums",perfumes.length],
    [ru?"Состав отображаем":"INCI verfügbar",perfumes.length-missing.length],
    [ru?"Нет состава":"INCI fehlt",missing.length],
    [ru?"Требуют проверки":"Zu prüfen",needsReview.length]
   ].map(([title,n])=><div key={String(title)} className="rounded-lg border bg-white p-4">
    <p className="text-xs text-neutral-600">{title}</p><strong className="mt-2 block text-2xl">{n}</strong>
   </div>)}
  </section>
  {incompleteLocales.length>0&&<p className="mt-4 text-sm text-amber-800">{ru?"Карточек с разными языковыми полями: ":"Abweichende Sprachfelder: "}{incompleteLocales.length}</p>}
  <p className="my-5 text-sm leading-6">{ru
   ?"Список для проверки упорядочен: сначала товары с устаревшими/сомнительными INCI, затем карточки без состава. Не удаляйте вещества из исходных списков без проверки упаковки. Перед продажей состава с замечаниями подтвердите текущую маркировку."
   :"Prüfreihenfolge: zuerst INCI-Listen mit Prüfhinweis, danach fehlende Angaben. Inhaltsstoffe nicht ohne Verpackungsabgleich löschen. Bei Warnungen aktuelle Kennzeichnung vor dem Verkauf prüfen."}</p>
  <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b">
   <th className="p-3">{ru?"Товар":"Produkt"}</th><th className="p-3">{ru?"Статус":"Status"}</th><th className="p-3">INCI · RU / DE</th>
  </tr></thead><tbody>
   {[...rows].sort((a,b)=>Number(b.available)-Number(a.available)||Number(b.review)-Number(a.review)||Number(b.missing)-Number(a.missing)).map(p=><tr key={p.id} className="border-b align-top">
    <td className="min-w-52 p-3"><Link href={`/update/${p.id}`} className="font-medium underline">{p.brand.name} · {p.name}</Link>
      <p className="mt-1 text-xs text-neutral-500">#{p.id} · {p.available?(ru?"В продаже":"Aktiv"):(ru?"Неактивен":"Inaktiv")}</p>
      <Link href={`/product/${p.id}`} className="mt-1 block text-xs underline">{ru?"Публичная карточка":"Produktseite"}</Link>
    </td>
    <td className="min-w-40 p-3">{status(p)}{p.review&&<p className="mt-2 font-semibold text-amber-800">{ru?"Не подтверждён для текущей партии":"Aktuelle Charge nicht bestätigt"}</p>}</td>
    <td className="min-w-56 max-w-xl break-words p-3">
     <p className="mb-1 text-xs">{p.ruSaved?"RU ✓":"RU —"} · {p.deSaved?"DE ✓":"DE —"}</p>
     {p.inci||"—"}
     {p.source&&<a href={p.source.url} target="_blank" rel="noopener noreferrer" className="mt-2 block underline">{ru?"Источник":"Quelle"}</a>}
    </td>
   </tr>)}
  </tbody></table></div>
 </main>;
}
