import { NextRequest,NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { getUserSession } from "@/src/shared/server-lib/get-user-session";
import { UserRole } from "@prisma/client";
export async function GET(req:NextRequest) {
 const user=await getUserSession();
 if(!user || user.role!==UserRole.ADMIN) return NextResponse.json({error:"Forbidden"},{status:403});
 const q=(req.nextUrl.searchParams.get("q")||"").trim();
 const ids=(req.nextUrl.searchParams.get("ids")||"").split(",").map(Number).filter(id=>Number.isSafeInteger(id)&&id>0).slice(0,20);
 if(!ids.length && (q.length<2||q.length>80)) return NextResponse.json([]);
 const products=await prisma.product.findMany({where:{bottleParentId:null,available:true,...(ids.length?{id:{in:ids}}:{name:{contains:q,mode:"insensitive"}})},
   include:{brand:true},take:12,orderBy:{name:"asc"}});
 return NextResponse.json(products.map(p=>({id:p.id,name:p.name,brand:p.brand.name})));
}
