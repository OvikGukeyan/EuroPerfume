import {prisma} from "@/prisma/prisma-client";
import {UserRole,Prisma} from "@prisma/client";
import {getUserSession} from "@/src/shared/server-lib/get-user-session";
import {redirect} from "next/navigation";
import {readPricing} from "@/src/shared/lib/tax";
import {earnablePoints,accountOrderEligible} from "@/src/shared/lib/europerfume-club";
import {ClubFulfillmentActions} from "@/src/shared/components/shared/club-fulfillment-actions";
import {Wallet,Gift,PackageCheck,ShieldCheck} from "lucide-react";
export const dynamic="force-dynamic";
export default async function ClubAdmin({params}:{params:Promise<{locale:string}>}){
 const admin=await getUserSession();if(!admin||admin.role!==UserRole.ADMIN)redirect("/not-auth");
 const {locale}=await params,ru=locale==="ru";
 let installed=true;
 let wallets:{userId:number;balancePoints:number}[]=[];
 let states:{orderId:number;paymentConfirmedAt:Date|null;shippedConfirmedAt:Date|null;loyaltyAwardedAt:Date|null}[]=[];
 let pointsGiven=0;
 try{
  const [ws,ss,ag]=await Promise.all([
   prisma.loyaltyWallet.findMany({select:{userId:true,balancePoints:true},orderBy:{balancePoints:"desc"},take:20}),
   prisma.orderFulfillment.findMany({select:{orderId:true,paymentConfirmedAt:true,shippedConfirmedAt:true,loyaltyAwardedAt:true},take:100}),
   prisma.loyaltyEntry.aggregate({_sum:{points:true},where:{kind:"EARN"}})
  ]);wallets=ws;states=ss;pointsGiven=ag._sum.points||0;
 }catch(e){if(e instanceof Prisma.PrismaClientKnownRequestError&&(e.code==="P2021"||e.code==="P2022"))installed=false;else throw e;}
 const awardsEnabled=process.env.EUROPERFUME_CLUB_AWARD_ENABLED==="true";
 const pending=await prisma.order.findMany({where:{userId:{not:null}},orderBy:{createdAt:"desc"},take:30,
  select:{id:true,userId:true,fullName:true,status:true,createdAt:true,totalAmount:true,pricingSnapshot:true,
   user:{select:{verified:true}}}});
 const stateByOrder=new Map(states.map(s=>[s.orderId,s]));
 const eligible=pending.filter(o=>accountOrderEligible(o.userId,o.user?.verified||null,o.createdAt));
 return <main className="mx-auto max-w-[1250px] px-4 py-6 md:px-8">
  <p className="text-[11px] uppercase tracking-[.18em] text-[#96776e]">EURO PERFUME CLUB</p>
  <h1 className="mt-2 text-[30px] font-normal tracking-tight">{ru?"Бонусная программа":"Treueprogramm"}</h1>
  <p className="mt-3 max-w-4xl text-sm leading-6 text-neutral-600">{ru?"Начисление 5 баллов за каждый 1 € подходящих товаров — только после подтверждения оплаты и фактической передачи посылки перевозчику. Создание Rechnung или DHL-этикетки само по себе баллов не начисляет.":"5 Punkte je 1 € berechtigter Ware, erst nach bestätigter Zahlung und Übergabe an den Versanddienst. Rechnung oder Label allein lösen keine Punkte aus."}</p>
  {!installed&&<p role="status" className="mt-5 rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">{ru?"Тестовая схема бонусов ещё не применена. Кнопки отключены; реальные заказы не менялись.":"Bonus-Migration noch nicht ausgeführt. Aktionen sind deaktiviert."}</p>}
  {!awardsEnabled&&<p className="mt-4 rounded-md border border-[#e7d3b1] bg-[#fffbf4] p-3 text-sm text-[#775b33]">{ru?"Тестовый режим: начисление на реальные заказы заблокировано до завершения интеграционных проверок.":"Testmodus: Keine Buchung echter Kundenpunkte vor der Integrationsprüfung."}</p>}
  <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
   {[
    {icon:Wallet,name:ru?"Баланс всех клиентов":"Offene Punkte",value:wallets.reduce((s,w)=>s+w.balancePoints,0)},
    {icon:Gift,name:ru?"Всего начислено":"Insgesamt vergeben",value:pointsGiven},
    {icon:PackageCheck,name:ru?"Оплачено и отправлено":"Bezahlt & versendet",value:states.filter(s=>s.loyaltyAwardedAt).length},
    {icon:ShieldCheck,name:ru?"Заказы из аккаунтов":"Konto-Bestellungen",value:eligible.length}
   ].map(({icon:Icon,name,value})=><section key={name} className="rounded-md border bg-[#faf9f7] p-4"><Icon size={20} strokeWidth={1.5} className="text-[#8c716a]"/><p className="mt-3 text-xs text-neutral-500">{name}</p><strong className="mt-1 block text-2xl font-medium tabular-nums">{value}</strong></section>)}
  </div>
  <section className="mt-7 overflow-hidden rounded-md border">
   <div className="border-b p-4"><h2 className="text-lg font-medium">{ru?"Подтверждение заказов":"Bestellungen bestätigen"}</h2><p className="mt-1 text-xs text-neutral-600">{ru?"Гостевые заказы не учитываются. Заказы без сохранённого расчёта требуют ручной проверки.":"Gastbestellungen zählen nicht. Ohne Preissnapshot erfolgt keine automatische Vergabe."}</p></div>
   <div className="overflow-x-auto"><table className="w-full min-w-[800px] text-left text-sm"><thead className="bg-neutral-50 text-xs text-neutral-600"><tr><th className="p-3">№</th><th className="p-3">{ru?"Клиент":"Kunde"}</th><th className="p-3">{ru?"Сумма":"Summe"}</th><th className="p-3">{ru?"Ожидаемые баллы":"Mögliche Punkte"}</th><th className="p-3">{ru?"Подтверждения":"Bestätigungen"}</th></tr></thead><tbody>
   {eligible.map(o=>{const f=stateByOrder.get(o.id),p=readPricing(o.pricingSnapshot),points=p?earnablePoints(p.lines,p.discountGrossCents):null;return <tr key={o.id} className="border-t">
    <td className="p-3 font-medium">{o.id}</td><td className="p-3">{o.fullName}<p className="text-xs text-neutral-500">{o.createdAt.toLocaleDateString(ru?"ru-RU":"de-DE")}</p></td>
    <td className="p-3 tabular-nums">{Number(o.totalAmount).toFixed(2)} €</td>
    <td className="p-3 tabular-nums">{points===null?"—":points}</td>
    <td className="p-3">{f?.loyaltyAwardedAt?<span className="text-[#27764b]">{ru?"Баллы начислены":"Punkte gebucht"}</span>:<ClubFulfillmentActions orderId={o.id} paid={Boolean(f?.paymentConfirmedAt)} shipped={Boolean(f?.shippedConfirmedAt)} enabled={installed&&awardsEnabled&&points!==null&&o.status!=="CENCELLED"}/>}</td>
   </tr>})}</tbody></table></div>
  </section>
  <p className="mt-4 text-xs text-neutral-600">{ru?"В этой версии запускается безопасное начисление. Списание, возврат баллов при Stornorechnung и массовый запуск будут включены после отдельной интеграционной проверки; сегодня это не изменяет счета.":"Diese Version bereitet die sichere Vergabe vor. Einlösen und Storno-Ausgleich bleiben vor dem Livegang gesperrt."}</p>
 </main>;
}
