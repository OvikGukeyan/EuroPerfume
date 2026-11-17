import * as React from 'react';
interface Props{code:string;locale?:'ru'|'de'}
export const UserVerificationTemplate:React.FC<Props>=({code,locale='de'})=>{
 const ru=locale==='ru';const base='https://euro-perfume-inky.vercel.app';const url=`${base}/api/auth/verify?code=${encodeURIComponent(code)}&locale=${locale}`;
 return <div style={{fontFamily:'Arial,sans-serif',lineHeight:1.7,color:'#252624'}}><p>EURO PERFUME</p><h1 style={{fontSize:24}}>{ru?'Подтвердите ваш email':'Bitte bestätige deine E-Mail-Adresse'}</h1><p>{ru?'Спасибо за регистрацию. Эта ссылка подтверждает email вашего аккаунта и действует 24 часа. Она не подписывает вас на рекламную рассылку.':'Vielen Dank für deine Registrierung. Dieser Link bestätigt die E-Mail-Adresse deines Kontos und ist 24 Stunden gültig. Er meldet dich nicht für den Newsletter an.'}</p><p><a href={url}>{ru?'Подтвердить email':'E-Mail-Adresse bestätigen'}</a></p><p>{ru?'Если вы не создавали аккаунт, проигнорируйте письмо.':'Wenn du kein Konto erstellt hast, ignoriere diese E-Mail.'}</p><p><a href={`${base}/${locale}/impressum`}>Impressum</a> · <a href={`${base}/${locale}/data-protection`}>{ru?'Конфиденциальность':'Datenschutz'}</a></p></div>;
};
