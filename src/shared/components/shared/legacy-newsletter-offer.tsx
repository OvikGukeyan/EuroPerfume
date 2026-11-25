"use client";
import {useState} from "react";
import {useLocale} from "next-intl";
import {useRouter} from "next/navigation";
import type {AccountData} from "@/src/shared/lib/customer-account";
import {Gift,MailCheck,ShieldCheck} from "lucide-react";
export function LegacyNewsletterOffer({offer,confirmed,demo=false}:{offer:NonNullable<AccountData["newsletterOffer"]>;confirmed:boolean;demo?:boolean}){
 const ru=useLocale()==="ru",router=useRouter();
 const [checked,setChecked]=useState(false),[busy,setBusy]=useState(false),[message,setMessage]=useState("");
 const t=(a:string,b:string)=>ru?a:b;
 async function claim(){
  if(!checked||busy||demo)return;
  setBusy(true);setMessage("");
  try{
   const response=await fetch("/api/account/legacy-newsletter-reward",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({consent:true})});
   const json=await response.json();
   if(!response.ok)throw new Error(json.error||"UNAVAILABLE");
   const next=t("Проверьте «Входящие», «Промоакции» (Gmail) и «Спам». В письме EURO PERFUME на немецком откройте ссылку «Newsletter-Anmeldung bestätigen», затем подтвердите подписку на открывшейся странице.","Prüfe den Posteingang, den Tab „Werbung“ (Gmail) und den Spamordner. Öffne in der E-Mail von EURO PERFUME den Link „Newsletter-Anmeldung bestätigen“ und bestätige das Abo auf der geöffneten Seite.");
   setMessage(json.status==="granted"
    ?t("Ваш купон готов и появится ниже.","Dein Gutschein ist freigeschaltet und erscheint hier.")
    :json.status==="confirmation_sent"
    ?t("Остался один шаг: подтвердите подписку. Письмо отправлено.","Nur noch ein Schritt: Bestätige dein Newsletter-Abo. Die E-Mail wurde versendet.")+" "+next
    :t("Подписка ещё не подтверждена. Новое письмо сейчас не отправлено.","Dein Newsletter-Abo ist noch nicht bestätigt. Es wurde gerade keine neue E-Mail versendet.")+" "+next);
   router.refresh();
  }catch(e){setMessage(t("Не удалось отправить запрос. Попробуйте позже.","Die Anmeldung konnte nicht verarbeitet werden. Bitte versuche es später."));}
  finally{setBusy(false);}
 }
 const expired=offer.expiresAt?new Date()>=new Date(offer.expiresAt):false;
 return <section className="mx-3 my-4 rounded-lg border border-[#d8c9be] bg-[#faf6f1] p-5 md:mx-0" aria-label="EURO PERFUME Newsletter-Vorteil">
  <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.17em] text-[#806251]"><Gift size={17}/> EURO PERFUME · EXKLUSIV</p>
  {offer.code?<><h2 className="mt-3 text-2xl font-medium">{t("Ваш персональный купон 15%","Dein persönlicher 15 %-Gutschein")}</h2>
   <div className="mt-3 rounded-md border border-[#c6b5a7] bg-white px-4 py-3 text-xl font-semibold tracking-wider select-all">{offer.code}</div>
   <p className="mt-2 text-xs leading-5 text-neutral-700">{offer.redeemed?t("Купон уже использован.","Dieser Gutschein wurde bereits eingelöst."):expired?t("Срок действия купона истёк.","Der Gutschein ist abgelaufen."):t("Один заказ, до ","Für eine Bestellung, gültig bis ")+(offer.expiresAt?new Date(offer.expiresAt).toLocaleDateString(ru?"ru-RU":"de-DE",{timeZone:"Europe/Berlin"}):"")}</p>
   <p className="mt-2 text-xs text-neutral-600">{t("Даже после отписки от рассылки купон остаётся действительным до окончания срока.","Dein Gutschein bleibt auch nach Abmeldung vom Newsletter bis zum Ablauf gültig.")}</p>
  </>:<>
   <h2 className="mt-3 text-2xl font-medium">{t("15% специально для вас","15 % exklusiv für dich")}</h2>
   <p className="mt-2 text-sm leading-6 text-neutral-700">{t("Подпишитесь добровольно на новости EURO PERFUME. После подтверждения email получите персональный промокод 15% на один заказ на 30 дней.","Melde dich freiwillig zu unserem Newsletter an. Nach Bestätigung deiner E-Mail-Adresse erhältst du einen persönlichen 15 %-Gutschein für eine Bestellung, gültig 30 Tage.")}</p>
   <p className="mt-2 text-xs text-neutral-600">{t("Не действует на Sale, товар дня, подарочные акции и доставку. Не суммируется с другими купонами.","Ausgenommen sind Sale, Tagesangebote, Geschenkaktionen und Versand. Nicht kombinierbar mit anderen Gutscheinen.")}</p>
   {offer.requested&&<p className="mt-3 flex items-center gap-2 text-xs text-[#805c33]"><MailCheck size={15}/>{t("Подписка ожидает подтверждения по email.","Die Newsletter-Anmeldung wartet auf deine E-Mail-Bestätigung.")}</p>}
   <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm leading-5">
    <input type="checkbox" className="mt-1 h-4 w-4 shrink-0 accent-[#745848]" checked={checked} onChange={e=>setChecked(e.target.checked)} disabled={busy}/>
    <span>{t("Я добровольно соглашаюсь получать рекламную рассылку EURO PERFUME по email. Я могу отозвать согласие в любой момент, без потери уже полученного купона.","Ich möchte freiwillig den EURO PERFUME Newsletter per E-Mail erhalten und willige in die Nutzung meiner E-Mail-Adresse zu diesem Zweck ein. Ich kann meine Einwilligung jederzeit widerrufen. Ein bereits erhaltener Gutschein bleibt gültig.")} <a className="underline" href="/de/data-protection" target="_blank" rel="noopener noreferrer">Datenschutz</a>.</span>
   </label>
   <button type="button" disabled={!checked||busy||demo} onClick={claim} className="mt-4 min-h-12 w-full rounded-md bg-[#2a2624] px-4 text-sm font-medium text-white disabled:opacity-50">
    {busy?t("Отправка...","Wird gesendet..."):confirmed?t("Получить персональный купон","Persönlichen Gutschein sichern"):t("Подписаться и получить 15%","Newsletter abonnieren & 15 % sichern")}
   </button>
   <p className="mt-3 flex gap-2 text-xs text-neutral-600"><ShieldCheck size={15} className="shrink-0"/>{t("Подписка необязательна. Все функции аккаунта доступны без неё.","Die Anmeldung ist freiwillig. Alle Funktionen des Kundenkontos bleiben auch ohne Newsletter verfügbar.")}</p>
  </>}
  {message&&<p role="status" className="mt-3 text-xs text-[#68543e]">{message}</p>}
 </section>;
}
