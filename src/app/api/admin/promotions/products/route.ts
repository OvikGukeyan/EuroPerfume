import { NextRequest,NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { getUserSession } from "@/src/shared/server-lib/get-user-session";
import { UserRole } from "@prisma/client";
import { calcCartItemTotalPrice } from "@/src/shared/lib/calc-cart-item-total-price";
export async function GET(req:NextRequest) {
 const user=await getUserSession();
 if(!user || user.role!==UserRole.ADMIN) return NextResponse.json({error:"Forbidden"},{status:403});
 const q=(req.nextUrl.searchParams.get("q")||"").trim();
 const ids=(req.nextUrl.searchParams.get("ids")||"").split(",").map(Number).filter(id=>Number.isSafeInteger(id)&&id>0).slice(0,20);
 if(!ids.length && (q.length<2||q.length>80)) return NextResponse.json([]);
 const products=await prisma.product.findMany({where:{bottleParentId:null,available:true,...(ids.length?{id:{in:ids}}:{name:{contains:q,mode:"insensitive"}})},
   include:{brand:true,productGroup:true},take:ids.length?20:15,orderBy:{name:"asc"}});
 return NextResponse.json(products.filter(p=>p.productGroup?.onTap).map(p=>({id:p.id,name:p.name,brand:p.brand.name,image:p.imageUrl[0]||"",price5:calcCartItemTotalPrice(Number(p.price),5,true,p.discountPrice?Number(p.discountPrice):undefined,p),price2:calcCartItemTotalPrice(Number(p.price),2,true,p.discountPrice?Number(p.discountPrice):undefined,p),available:p.available})));
}
