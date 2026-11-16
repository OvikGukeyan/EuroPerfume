import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { calcCartItemTotalPrice } from "@/src/shared/lib/calc-cart-item-total-price";

export const revalidate = 300;

// Public navigation preview: only published, available parent perfumes.
export async function GET() {
  try {
    const products=await prisma.product.findMany({
      where:{available:true,bottleParentId:null,productGroup:{onTap:true}},
      orderBy:{createdAt:"desc"},
      take:3,
      include:{brand:true,productGroup:true}
    });
    return NextResponse.json(products.map(p=>({
      id:p.id,name:p.name.trim(),brand:p.brand.name,image:p.imageUrl[0]||"",
      price:calcCartItemTotalPrice(Number(p.price),2,true,p.discountPrice?Number(p.discountPrice):undefined,p)
    })),{headers:{"Cache-Control":"public, max-age=60, s-maxage=300"}});
  }catch{
    return NextResponse.json([],{headers:{"Cache-Control":"no-store"}});
  }
}
