import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { getUserSession } from "@/src/shared/server-lib/get-user-session";
import { UserRole } from "@prisma/client";
import { z } from "zod";

const schema = z.object({
  id:z.string().uuid().optional(),
  slug:z.string().regex(/^[a-z0-9-]{3,60}$/),
  titleRu:z.string().trim().min(3).max(100),
  titleDe:z.string().trim().min(3).max(100),
  productIds:z.array(z.number().int().positive()).min(2).max(6),
  giftProductId:z.number().int().positive(),
  requiredMl:z.number().int().min(1).max(30).default(5),
  giftMl:z.number().int().min(1).max(30).default(2),
  heroImage:z.string().url().nullable().optional(),
  active:z.boolean().default(false),
  startsAt:z.string().datetime().nullable().optional(),
  endsAt:z.string().datetime().nullable().optional(),
  priority:z.number().int().min(0).max(100).default(0)
}).refine(data=>new Set(data.productIds).size===data.productIds.length && !data.productIds.includes(data.giftProductId),
  "Products must be unique and gift must be separate");

async function guard() {
  const user=await getUserSession();
  return user?.role === UserRole.ADMIN;
}
export async function GET() {
  if (!await guard()) return NextResponse.json({error:"Forbidden"},{status:403});
  try {
    const promotions=await prisma.promotion.findMany({orderBy:{createdAt:"desc"},include:{_count:{select:{orders:true,carts:true}}}});
    return NextResponse.json(promotions);
  } catch { return NextResponse.json({error:"Promotion tables have not been migrated"},{status:503}); }
}
export async function POST(req:Request) {
  if (!await guard()) return NextResponse.json({error:"Forbidden"},{status:403});
  const parsed=schema.safeParse(await req.json().catch(()=>null));
  if (!parsed.success) return NextResponse.json({error:parsed.error.flatten()},{status:400});
  const {id,startsAt,endsAt,...data}=parsed.data;
  if (startsAt && endsAt && startsAt>=endsAt) return NextResponse.json({error:"Invalid date range"},{status:400});
  const products=await prisma.product.findMany({where:{id:{in:[...data.productIds,data.giftProductId]}}});
  if(products.length!==data.productIds.length+1 || products.some(p=>p.bottleParentId!==null))
    return NextResponse.json({error:"Choose valid parent fragrance products"},{status:400});
  try {
    const value={...data,startsAt:startsAt?new Date(startsAt):null,endsAt:endsAt?new Date(endsAt):null};
    const result=id
      ? await prisma.promotion.update({where:{id},data:value})
      : await prisma.promotion.create({data:value});
    return NextResponse.json(result);
  } catch { return NextResponse.json({error:"Unable to save promotion; migration or slug conflict"},{status:409}); }
}
