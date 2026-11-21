import * as React from "react";
interface Props {code:string; locale?:"ru"|"de"}
export const UserVerificationTemplate:React.FC<Props>=({code,locale="de"})=>{
 const base="https://euro-perfume-inky.vercel.app";
 const url=`${base}/api/auth/verify?code=${encodeURIComponent(code)}&locale=${locale}`;
 return <div lang="de" style={{fontFamily:"Arial,sans-serif",lineHeight:1.7,color:"#252624",maxWidth:600,margin:"auto"}}>
  <p>EURO PERFUME</p><h1 style={{fontSize:24}}>Bitte bestätige deine E-Mail-Adresse</h1>
  <p>Vielen Dank für deine Registrierung bei EURO PERFUME. Über diesen Link bestätigst du deine E-Mail-Adresse. Er ist 24 Stunden gültig. Eine Newsletter-Anmeldung erfolgt dadurch nicht.</p>
  <p><a href={url}>E-Mail-Adresse bestätigen</a></p>
  <p>Falls du kein Konto erstellt hast, ignoriere diese Nachricht.</p>
  <p><a href={`${base}/de/impressum`}>Impressum</a> · <a href={`${base}/de/data-protection`}>Datenschutz</a></p>
 </div>;
};