import {formatMoney} from "@/src/shared/lib/money";
import * as React from "react";
interface Props {orderId:number;totalAmount:number;paymentUrl:string}
export const PayOrderTemplate:React.FC<Props>=({orderId,totalAmount,paymentUrl})=>(
 <div lang="de" style={{fontFamily:"Arial,sans-serif",lineHeight:1.7}}>
  <p>EURO PERFUME</p><h1>Zahlung zu Bestellung #{orderId}</h1>
  <p>Für deine Bestellung ist ein Betrag von <strong>{formatMoney(totalAmount)} €</strong> offen.</p>
  <p><a href={paymentUrl}>Zur sicheren Zahlung</a></p>
  <p>Falls du Fragen zur Bestellung hast, antworte einfach auf diese E-Mail.</p>
 </div>
);