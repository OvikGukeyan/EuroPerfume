import * as React from "react";
interface Props {code:string}
export const PasswordResetTemplate:React.FC<Props>=({code})=>{
 const base="https://euro-perfume-inky.vercel.app";
 return <div lang="de" style={{fontFamily:"Arial,sans-serif",lineHeight:1.7,color:"#252624"}}>
  <p>EURO PERFUME</p><h1>Passwort zurücksetzen</h1>
  <p>Du hast angefragt, dein Passwort zurückzusetzen. Falls du diese Anfrage nicht gestellt hast, kannst du diese Nachricht ignorieren.</p>
  <p><a href={`${base}/de/reset/${encodeURIComponent(code)}`}>Neues Passwort festlegen</a></p>
  <p><a href={`${base}/de/impressum`}>Impressum</a> · <a href={`${base}/de/data-protection`}>Datenschutz</a></p>
 </div>;
};