"use client";
import {useState} from "react";
import {useLocale} from "next-intl";
import {useRouter} from "next/navigation";
import {CircleCheck,Truck,CheckCircle2} from "lucide-react";
export function ClubFulfillmentActions({orderId,paid,shipped,enabled}:{orderId:number;paid:boolean;shipped:boolean;enabled:boolean}){
 const ru=useLocale()==="ru",router=useRouter(),[busy,setBusy]=useState(false),[error,setError]=useState("");
 const send=async(action:"payment_received"|"handed_to_carrier")=>{
  setBusy(true);setError("");
  try{const response=await fetch("/api/admin/club-fulfillment",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({orderId,action})});
   const value=await response.json();if(!response.ok)throw new Error(value.error||"FAILED");
   router.refresh();
  }catch(e){setError(e instanceof Error?e.message:"FAILED")}finally{setBusy(false);}
 };
 return <div className="flex flex-wrap items-center gap-2">
  {paid?<span className="inline-flex items-center gap-1 text-xs text-[#28744e]"><CheckCircle2 size={14}/>{ru?"Оплачен":"Bezahlt"}</span>:
  <button type="button" disabled={busy||!enabled} onClick={()=>void send("payment_received")} className="inline-flex min-h-9 items-center gap-1 rounded-md border px-2.5 text-xs disabled:opacity-40"><CircleCheck size={14}/>{ru?"Подтвердить оплату":"Zahlung bestätigen"}</button>}
  {shipped?<span className="inline-flex items-center gap-1 text-xs text-[#28744e]"><CheckCircle2 size={14}/>{ru?"Передан перевозчику":"Übergeben"}</span>:
  <button type="button" disabled={busy||!enabled} onClick={()=>void send("handed_to_carrier")} className="inline-flex min-h-9 items-center gap-1 rounded-md border px-2.5 text-xs disabled:opacity-40"><Truck size={14}/>{ru?"Передан DHL":"An DHL übergeben"}</button>}
  {error&&<span role="alert" className="w-full text-xs text-red-700">{error}</span>}
 </div>;
}
