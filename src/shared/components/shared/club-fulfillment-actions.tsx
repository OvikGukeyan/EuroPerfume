"use client";
import {useState} from "react";
import {useLocale} from "next-intl";
import {useRouter} from "next/navigation";
import {cn} from "@/src/shared/lib/utils";
import {CircleCheck,Truck,CheckCircle2} from "lucide-react";
export function ClubFulfillmentActions({orderId,paid,shipped,enabled,source}:{orderId:number;paid:boolean;shipped:boolean;enabled:boolean;source?:"order_details"}){
 const ru=useLocale()==="ru",router=useRouter(),[busy,setBusy]=useState(false),[error,setError]=useState("");
 const [confirmed,setConfirmed]=useState({paid:false,shipped:false});
 const send=async(action:"payment_received"|"handed_to_carrier")=>{
  setBusy(true);setError("");
  try{const response=await fetch("/api/admin/club-fulfillment",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({orderId,action,source})});
   const value=await response.json();if(!response.ok)throw new Error(value.error||"FAILED");
   if(source)setConfirmed({paid:value.paymentConfirmed,shipped:value.shippedConfirmed});
   router.refresh();
  }catch(e){setError(e instanceof Error?e.message:"FAILED")}finally{setBusy(false);}
 };
 const actionClass=cn("inline-flex min-h-9 items-center justify-center gap-1 rounded-md border px-2.5 text-xs disabled:opacity-40",source&&"min-h-10 flex-1");
 const stateClass=cn("inline-flex items-center gap-1 text-xs text-[#28744e]",source&&"min-h-10 flex-1");
 return <div className="flex flex-wrap items-center gap-2">
  {(paid||confirmed.paid)?<span className={stateClass}><CheckCircle2 size={14}/>{ru?"Оплачен":"Bezahlt"}</span>:
  <button type="button" disabled={busy||!enabled} onClick={()=>void send("payment_received")} className={actionClass}><CircleCheck size={14}/>{ru?"Подтвердить оплату":"Zahlung bestätigen"}</button>}
  {(shipped||confirmed.shipped)?<span className={stateClass}><CheckCircle2 size={14}/>{ru?(source?"Передано DHL":"Передан перевозчику"):"Übergeben"}</span>:
  <button type="button" disabled={busy||!enabled} onClick={()=>void send("handed_to_carrier")} className={actionClass}><Truck size={14}/>{ru?(source?"Передано DHL":"Передан DHL"):"An DHL übergeben"}</button>}
  {error&&<span role="alert" className="w-full text-xs text-red-700">{error}</span>}
 </div>;
}
