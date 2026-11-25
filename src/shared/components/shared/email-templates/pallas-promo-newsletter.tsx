import React from "react";
import {PALLAS_NEWSLETTER_BASE as base} from "@/src/shared/lib/pallas-promo-newsletter";

// Same published product image as the approved mock-up, no inline data URIs in outbound mail.
const bottle = "https://thgjecpmxhqwfoknvjiu.supabase.co/storage/v1/object/public/images/0-ARGOSPALLASATHENEPERFUMEBOTTLEFRONTVIEW100ML_720x-510x510.webp--2025-07-25T21:10:52.729Z";
const button = {
  display:"inline-block", background:"#212620", color:"#fff", padding:"15px 20px",
  textDecoration:"none", borderRadius:6, fontWeight:700
};
const divider = {border:0,borderTop:"1px solid #e8e9e3",margin:"28px 0"};
const terms = {fontSize:15,color:"#5b6059"};

export function PallasPromoNewsletter({unsubscribeUrl}:{unsubscribeUrl:string}) {
  return <div lang="ru" style={{margin:0,background:"#f6f5f2",color:"#20221f",fontFamily:"Arial,sans-serif",padding:"24px 12px"}}>
    <table role="presentation" width="100%" cellSpacing={0} cellPadding={0} style={{maxWidth:620,margin:"0 auto",background:"#fff",border:"1px solid #e8e9e3"}}>
      <tbody><tr><td style={{padding:"30px 28px"}}>
        <p style={{color:"#3d5138",letterSpacing:"3px",fontWeight:700}}>EURO PERFUME</p>
        <h1 style={{fontFamily:"Georgia,serif",fontSize:39,lineHeight:1.12,fontWeight:400,margin:"20px 0"}}>Argos Pallas Athene</h1>
        {/* Email clients cannot resolve a Next.js-optimized image component. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="Argos Pallas Athene" src={bottle} width={220} style={{display:"block",maxWidth:"100%",height:"auto",margin:"0 auto"}}/>
        <p style={{textAlign:"center",color:"#3d5138",fontSize:14}}>Подарок: отливант 5 мл · Gratiszugabe: 5 ml Duftabfüllung</p>
        <hr style={divider}/>
        <h2 style={{fontSize:25}}>5 мл в подарок к заказу от 100 €</h2>
        <p style={{fontSize:17,lineHeight:1.52}}>Первые 10 покупателей получат отливант Argos Pallas Athene 5 мл. Подарок появится в корзине при выполнении условий и закрепится при оформлении заказа, пока подарки есть. Один подарок на покупателя.</p>
        <p style={terms}>100 € за товары после скидок и баллов, без доставки.</p>
        <p style={{padding:"12px 0"}}><a style={button} href={base+"/ru"}>Перейти в магазин →</a></p>
        <hr style={divider}/>
        <div lang="de">
          <h2 style={{fontSize:25}}>5 ml gratis ab 100 € Warenwert</h2>
          <p style={{fontSize:17,lineHeight:1.52}}>Die ersten 10 Kundinnen und Kunden erhalten eine 5-ml-Duftabfüllung von Argos Pallas Athene. Sobald die Bedingungen erfüllt sind, erscheint die Zugabe im Warenkorb. Sie wird erst beim Abschluss der Bestellung reserviert, solange der Vorrat reicht. Ein Geschenk pro Person.</p>
          <p style={terms}>100 € Warenwert nach Rabatten und Punkten, ohne Versand.</p>
          <p style={{padding:"12px 0"}}><a style={button} href={base+"/de"}>Zum Shop →</a></p>
        </div>
        <hr style={divider}/>
        <p style={{fontSize:12,lineHeight:1.6,color:"#5b6059"}}>
          Вы получили это письмо, потому что подтвердили подписку. / Diese E-Mail erhältst du nach bestätigter Newsletter-Anmeldung.<br/>
          <a href={unsubscribeUrl}>Отписаться / Newsletter abbestellen</a>
          {" · "}<a href={base+"/de/data-protection"}>Datenschutz</a>
          {" · "}<a href={base+"/de/impressum"}>Impressum</a>
        </p>
      </td></tr></tbody>
    </table>
  </div>;
}
