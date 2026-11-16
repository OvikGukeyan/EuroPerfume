"use client";
import { useEffect } from "react";
export function trackPromotion(slug:string,event:"view"|"click") {
 return fetch(`/api/promotions/${encodeURIComponent(slug)}/track`,{
   method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({event}),keepalive:true
 }).catch(()=>undefined);
}
export function PromotionViewTracker({slug}:{slug:string}) {
 useEffect(()=>{void trackPromotion(slug,"view");},[slug]);
 return null;
}
