import { prisma } from "@/prisma/prisma-client";
import { getUserSession } from "@/src/shared/server-lib/get-user-session";
import { notFound } from "next/navigation";
import { linePrice } from "@/src/shared/lib/day-offer";
import { DayOfferAdmin } from "@/src/shared/components/shared/day-offer-admin";

export const dynamic="force-dynamic";
export default async function DayOfferPage(){
 const user=await getUserSession();
 if(user?.role!=="ADMIN")notFound();
 const products=await prisma.product.findMany({
  where:{categoryId:1,available:true,bottleParentId:null,productGroup:{onTap:true}},
  include:{brand:true,productGroup:true},orderBy:{name:"asc"}
 });
 const now=Date.now();
 const active=products.find(p=>p.dayOfferStartsAt&&p.dayOfferEndsAt&&p.dayOfferStartsAt.getTime()<=now&&p.dayOfferEndsAt.getTime()>now);
 const options=products.map(p=>{
  const regular=linePrice(Number(p.price),5,true);
  const currentSale=p.discountPrice!==null&&Number(p.discountPrice)>0&&Number(p.discountPrice)<Number(p.price);
  return {id:p.id,name:p.name.trim(),brand:p.brand.name,image:p.imageUrl[0]||"",regular,sale:Math.round(regular*90)/100,allowed:!currentSale};
 });
 return <DayOfferAdmin products={options} active={active?{
  id:active.id,brand:active.brand.name,name:active.name.trim(),
  endLabel:active.dayOfferEndsAt!.toLocaleString("de-DE",{timeZone:"Europe/Berlin"})
 }:null}/>;
}
