import {Link} from "@/src/i18n/navigation";
export const metadata={title:"EURO PERFUME · Newsletter",robots:{index:false,follow:false},referrer:"no-referrer" as const};
export const dynamic="force-dynamic";
export default async function NewsletterPage({params,searchParams}:{params:Promise<{locale:string}>,searchParams:Promise<{token?:string;unsubscribe?:string;result?:string}>}){
 const {locale}=await params,{token,unsubscribe:unsubscribeToken,result}=await searchParams;
 const ru=locale==="ru",unsubscribe=Boolean(unsubscribeToken),key=unsubscribeToken||token||"",valid=/^[a-f0-9]{64}$/.test(key);
 const messages:Record<string,string>=ru?{
  confirmed:"Подписка успешно подтверждена. Спасибо!",
  already:"Подписка уже подтверждена. Повторное действие не требуется.",
  unsubscribed:"Согласие на рассылку отозвано. Рекламные письма больше не отправляются.",
  expired:"Срок действия ссылки истёк. Запросите новую ссылку — регистрироваться заново не нужно.",
  resent:"Отправили новое письмо для подтверждения подписки. Проверьте папку «Спам».",
  wait:"Повторный запрос отправлен слишком скоро. Проверьте почту и попробуйте чуть позже.",
  "verify-account":"Сначала подтвердите email аккаунта, затем подписку.",
  unavailable:"Не удалось выполнить запрос. Попробуйте позднее.",
  invalid:"Ссылка недействительна. Проверьте статус подписки в личном кабинете."
 }:{
  confirmed:"Deine Newsletter-Anmeldung ist bestätigt. Vielen Dank!",
  already:"Dein Newsletter-Abo ist bereits bestätigt. Es ist nichts weiter nötig.",
  unsubscribed:"Deine Einwilligung wurde widerrufen. Du erhältst keine Werbe-E-Mails mehr.",
  expired:"Dieser Link ist abgelaufen. Fordere einen neuen an, ohne dich erneut zu registrieren.",
  resent:"Eine neue Bestätigungs-E-Mail wurde versendet. Bitte prüfe auch den Spamordner.",
  wait:"Du hast vor Kurzem eine E-Mail angefordert. Prüfe dein Postfach und versuche es später erneut.",
  "verify-account":"Bitte bestätige zuerst die E-Mail-Adresse deines Kundenkontos.",
  unavailable:"Deine Anfrage konnte nicht abgeschlossen werden. Bitte versuche es später erneut.",
  invalid:"Dieser Link ist ungültig. Prüfe den Newsletter-Status in deinem Kundenkonto."
 };
 return <main className="mx-auto max-w-xl px-6 py-14"><p className="text-xs tracking-[.2em] text-stone-500">EURO PERFUME</p><h1 className="text-3xl my-6">{ru?"Рекламная подписка":"Newsletter-Anmeldung"}</h1>
 {result?<p role="status" className="leading-7">{messages[result]||messages.invalid}</p>
  :valid?<><p className="leading-7 mb-7">{unsubscribe
  ?ru?"Нажмите ниже, чтобы отозвать согласие на рекламные письма. Аккаунт и уведомления о заказах останутся доступны.":"Klicke unten, um deine Einwilligung in Werbe-E-Mails zu widerrufen. Dein Konto und Bestellnachrichten bleiben verfügbar."
  :ru?"Подтвердите, что хотите получать по email новости об ароматах, новинках и скидках EURO PERFUME. Вы можете отписаться в любое время.":"Bestätige, dass du per E-Mail Informationen über Düfte, Neuheiten und Angebote von EURO PERFUME erhalten möchtest. Du kannst dich jederzeit abmelden."}</p>
 <form action="/api/newsletter" method="post"><input type="hidden" name="token" value={key}/><input type="hidden" name="locale" value={ru?"ru":"de"}/><input type="hidden" name="action" value={unsubscribe?"unsubscribe":"confirm"}/>
 <button className="rounded-md bg-neutral-800 text-white px-7 py-4">{unsubscribe?(ru?"Отписаться от рекламы":"Werbeeinwilligung widerrufen"):(ru?"Подтвердить подписку":"Anmeldung bestätigen")}</button></form></>
  :<p>{ru?"Подписка подтверждается по ссылке из письма.":"Bitte öffne den Bestätigungslink aus deiner E-Mail."}</p>}
 {result==="expired"&&valid&&!unsubscribe?<form method="post" action="/api/newsletter/renew" className="mt-7"><input type="hidden" name="token" value={key}/><input type="hidden" name="locale" value={ru?"ru":"de"}/><button className="rounded-md bg-neutral-800 text-white px-7 py-4">{ru?"Отправить новую ссылку":"Neuen Bestätigungslink senden"}</button></form>:null}
 <div className="flex gap-6 mt-8 text-sm underline"><Link href="/profile">{ru?"Личный кабинет":"Mein Konto"}</Link><Link href="/data-protection">{ru?"Конфиденциальность":"Datenschutz"}</Link></div></main>;
}