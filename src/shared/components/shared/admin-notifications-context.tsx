"use client";
import {createContext,useCallback,useContext,useEffect,useRef,useState,type ReactNode} from "react";
export type AdminCategory="crm"|"club"|"orders"|"campaigns";
export type AdminEvent={
 id:string;kind:string;category:AdminCategory;email:string|null;
 userId:number|null;orderId:number|null;createdAt:string;
};
export type NotificationCounts=Record<AdminCategory,number>;
const emptyCounts:NotificationCounts={crm:0,club:0,orders:0,campaigns:0};
type NotificationContext={
 counts:NotificationCounts;total:number;isOpen:boolean;filter:AdminCategory|null;
 presented:AdminEvent[];loading:boolean;
 openInbox:(category?:AdminCategory)=>void;closeInbox:()=>void;refresh:()=>Promise<void>;
};
const context=createContext<NotificationContext|null>(null);
export function useAdminNotifications(){
 const value=useContext(context);
 if(!value)throw new Error("AdminNotificationsProvider is missing");
 return value;
}
export function AdminNotificationsProvider({children}:{children:ReactNode}){
 const [counts,setCounts]=useState<NotificationCounts>(emptyCounts);
 const [total,setTotal]=useState(0);
 const [unread,setUnread]=useState<AdminEvent[]>([]);
 const [presented,setPresented]=useState<AdminEvent[]>([]);
 const [isOpen,setIsOpen]=useState(false);
 const [filter,setFilter]=useState<AdminCategory|null>(null);
 const [loading,setLoading]=useState(false);
 const live=useRef(true);
 const refresh=useCallback(async()=>{
  try{
   const response=await fetch("/api/admin/notifications",{cache:"no-store"});
   if(!response.ok)return;
   const data=await response.json() as {counts:NotificationCounts;total:number;unread:AdminEvent[]};
   if(!live.current)return;
   setCounts(data.counts);
   setTotal(data.total);
   setUnread(data.unread);
  }catch{/* Keep last known state on temporary network failures. */}
 },[]);
 useEffect(()=>{
  live.current=true;
  void refresh();
  const id=window.setInterval(()=>{if(document.visibilityState==="visible")void refresh()},30000);
  const visible=()=>{if(document.visibilityState==="visible")void refresh()};
  document.addEventListener("visibilitychange",visible);
  return ()=>{live.current=false;window.clearInterval(id);document.removeEventListener("visibilitychange",visible)};
 },[refresh]);
 const openInbox=useCallback((category?:AdminCategory)=>{
  const selected=category??null;
  const visible=unread.filter(event=>!selected||event.category===selected);
  setPresented(visible);setFilter(selected);setIsOpen(true);
  if(!visible.length)return;
  setLoading(true);
  void (async()=>{
   try{
    const response=await fetch("/api/admin/notifications",{
     method:"POST",headers:{"Content-Type":"application/json"},
     body:JSON.stringify({ids:visible.map(item=>item.id)})
    });
    if(response.ok)await refresh();
   }catch{/* Preserve unread badge until acknowledgement succeeds. */}finally{if(live.current)setLoading(false)}
  })();
 },[unread,refresh]);
 const closeInbox=useCallback(()=>{setIsOpen(false);setPresented([]);setFilter(null)},[]);
 return <context.Provider value={{counts,total,isOpen,filter,presented,loading,openInbox,closeInbox,refresh}}>
  {children}
 </context.Provider>;
}
