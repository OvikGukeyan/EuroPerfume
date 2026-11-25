import {Link} from "@/src/i18n/navigation";
export const metadata={title:"EURO PERFUME · E-Mail-Verifizierung",robots:{index:false,follow:false},referrer:"no-referrer" as const};
export const dynamic="force-dynamic";
export default async function VerifyPage({params,searchParams}:{params:Promise<{locale:string}>,searchParams:Promise<{state?:string;code?:string}>}){
 const {locale}=await params;const {state,code}=await searchParams;
 const ru=locale==="ru",expired=state==="expired",resendable=expired&&/^(?:v2_)?[a-f0-9]{64}$/.test(code||"");
 const message=state==="verified"
  ?ru?"Ваш email подтверждён. Аккаунт активен.":"Deine E-Mail-Adresse ist bestätigt. Dein Konto ist jetzt aktiv."
  :state==="already"
  ?ru?"Ваш email уже подтверждён. Ничего повторно делать не нужно.":"Deine E-Mail-Adresse ist bereits bestätigt. Du musst nichts weiter tun."
  :state==="resent"
  ?ru?"Если ссылку можно обновить, новое письмо отправлено. Проверьте «Входящие», «Промоакции» (Gmail) и «Спам» и откройте ссылку подтверждения email в новом письме EURO PERFUME.":"Falls der Link erneuert werden kann, wurde eine neue E-Mail versendet. Prüfe den Posteingang, den Tab „Werbung“ (Gmail) und den Spamordner und öffne den Bestätigungslink in der neuen E-Mail von EURO PERFUME."
  :state==="expired"
  ?ru?"Срок действия ссылки истёк. Запросите новую — создавать аккаунт заново не нужно.":"Dieser Bestätigungslink ist abgelaufen. Bitte fordere einen neuen an, ohne dich erneut zu registrieren."
  :state==="unavailable"
  ?ru?"Сейчас не удалось завершить проверку. Попробуйте ещё раз позже.":"Die Bestätigung konnte gerade nicht abgeschlossen werden. Bitte versuche es später erneut."
  :ru?"Эта ссылка недействительна. Проверьте письмо или запросите новую ссылку.":"Dieser Bestätigungslink ist ungültig. Bitte prüfe deine E-Mail oder fordere einen neuen Link an.";
 return <main className="mx-auto max-w-lg px-6 py-16"><p className="text-xs tracking-[.2em] text-stone-500">EURO PERFUME</p><h1 className="text-3xl mt-4 mb-5">{ru?"Подтверждение email":"E-Mail bestätigen"}</h1><p role="status" className="leading-7">{message}</p>
 {resendable?<form method="post" action="/api/auth/renew-verification" className="mt-7">
  <input type="hidden" name="code" value={code}/><input type="hidden" name="locale" value={ru?"ru":"de"}/>
  <button className="bg-neutral-800 text-white rounded-md px-7 py-4">{ru?"Отправить новую ссылку":"Neuen Bestätigungslink senden"}</button>
 </form>:null}
 <div className="mt-8 flex gap-6 underline text-sm"><Link href="/">{ru?"На главную":"Zur Startseite"}</Link><Link href="/profile">{ru?"Личный кабинет":"Kundenkonto"}</Link></div></main>;
}