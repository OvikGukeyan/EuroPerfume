import * as React from "react";
interface Props {code:string;locale?:"ru"|"de";marketingOptIn?:boolean}
export const UserVerificationTemplate:React.FC<Props>=({code,locale="de",marketingOptIn=false})=>{
 const base="https://euro-perfume-inky.vercel.app";
 const url=`${base}/api/auth/verify?code=${encodeURIComponent(code)}&locale=${locale}`;
 const ru=locale==="ru";
 return <div lang={locale} style={{fontFamily:"Arial,sans-serif",lineHeight:1.7,color:"#252624",maxWidth:600,margin:"auto"}}>
  <p>EURO PERFUME</p>
  <h1 style={{fontSize:24}}>{ru?"Подтвердите адрес электронной почты":"Bitte bestätige deine E-Mail-Adresse"}</h1>
  <p>{ru?"Спасибо за регистрацию в EURO PERFUME. Для активации аккаунта подтвердите email по ссылке ниже. Ссылка действует 24 часа.":"Vielen Dank für deine Registrierung bei EURO PERFUME. Bitte bestätige deine E-Mail-Adresse über den folgenden Link, um dein Kundenkonto zu aktivieren. Der Link ist 24 Stunden gültig."}</p>
  {marketingOptIn?<p>{ru?"Вы также добровольно выбрали получение рекламной рассылки при регистрации. Нажатие кнопки подтвердит и адрес email, и ваше отдельное согласие получать письма об ароматах, новинках и предложениях EURO PERFUME. Отписаться можно в любое время через ссылку в письмах или личный кабинет.":"Du hast bei der Registrierung außerdem freiwillig den Newsletter ausgewählt. Mit dem Klick bestätigst du sowohl deine E-Mail-Adresse als auch deine gesonderte Einwilligung in Werbe-E-Mails über Düfte, Neuheiten und Angebote von EURO PERFUME. Du kannst dich jederzeit über den Abmeldelink oder dein Kundenkonto abmelden."}</p>:<p>{ru?"Подписка на рекламную рассылку не оформляется.":"Du meldest dich damit nicht zum Newsletter an."}</p>}
  <p><a href={url}>{marketingOptIn?(ru?"Подтвердить email и подписку":"E-Mail und Newsletter bestätigen"):(ru?"Подтвердить email":"E-Mail-Adresse bestätigen")}</a></p>
  <p>{ru?"Если вы не регистрировались, проигнорируйте это письмо.":"Falls du kein Konto erstellt hast, ignoriere diese Nachricht."}</p>
  <p><a href={`${base}/${locale}/impressum`}>Impressum</a> · <a href={`${base}/${locale}/data-protection`}>{ru?"Конфиденциальность":"Datenschutz"}</a></p>
 </div>;
};