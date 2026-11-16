import { prisma } from "@/prisma/prisma-client";
import { getUserSession } from "@/src/shared/server-lib/get-user-session";
import { notFound } from "next/navigation";
import { linePrice } from "@/src/shared/lib/day-offer";
import { offerWeekSlots } from "@/src/shared/lib/day-offer-week";
import { DayOfferAdmin } from "@/src/shared/components/shared/day-offer-admin";

export const dynamic="force-dynamic";
const day=(d:Date)=>new Intl.DateTimeFormat("ru-RU",{timeZone:"Europe/Berlin",day:"numeric",month:"short"}).format(d);
const moment=(d:Date)=>new Intl.DateTimeFormat("ru-RU",{timeZone:"Europe/Berlin",day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}).format(d);
export default async function DayOfferPage(){
 const user=await getUserSession();
 if(user?.role!=="ADMIN")notFound();
 const now=new Date(),weeks=offerWeekSlots(now);
 const products=await prisma.product.findMany({
   where:{categoryId:1,available:true,bottleParentId:null,productGroup:{onTap:true}},
   include:{brand:true,productGroup:true},orderBy:{name:"asc"}
 });
 const inSlot=(start:Date,end:Date)=>products.find(p=>p.dayOfferStartsAt&&p.dayOfferEndsAt&&p.dayOfferStartsAt<end&&p.dayOfferEndsAt>start);
 const current=inSlot(now,weeks.current.end);
 const next=inSlot(weeks.next.start,weeks.next.end);
 const describe=(p:typeof products[number]|undefined)=>p?{
   id:p.id,brand:p.brand.name,name:p.name.trim(),
   startLabel:moment(p.dayOfferStartsAt!),endLabel:moment(p.dayOfferEndsAt!)
 }:null;
 const options=products.map(p=>{
   const regular=linePrice(Number(p.price),5,true);
   const existing=p.discountPrice!==null&&Number(p.discountPrice)>0&&Number(p.discountPrice)<Number(p.price);
   return {id:p.id,name:p.name.trim(),brand:p.brand.name,image:p.imageUrl[0]||"",regular,sale:Math.round(regular*90)/100,allowed:!existing};
 });
 const label=(slot:{start:Date;end:Date})=>({startLabel:day(slot.start),endLabel:day(new Date(slot.end.getTime()-1000))});
 return <DayOfferAdmin products={options} current={describe(current)} next={describe(next)} currentWeek={label(weeks.current)} nextWeek={label(weeks.next)}/>;
}
