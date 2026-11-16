import { NextRequest,NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
export async function POST(req:NextRequest,{params}:{params:Promise<{slug:string}>}) {
 const {slug}=await params;
 if(!/^[a-z0-9-]{3,60}$/.test(slug)) return NextResponse.json({ok:false},{status:400});
 const body=await req.json().catch(()=>null);
 const event=body?.event;
 if(!["view","click"].includes(event)) return NextResponse.json({ok:false},{status:400});
 const cookieName="ep_pv_"+slug;
 if(event==="view" && req.cookies.has(cookieName)) return NextResponse.json({ok:true,counted:false});
 try {
  await prisma.promotion.update({where:{slug,active:true},data:event==="view"?{viewCount:{increment:1}}:{clickCount:{increment:1}}});
  const res=NextResponse.json({ok:true,counted:true});
  if(event==="view")res.cookies.set(cookieName,"1",{maxAge:86400,httpOnly:true,sameSite:"lax",path:"/"});
  return res;
 } catch {return NextResponse.json({ok:false},{status:404});}
}
