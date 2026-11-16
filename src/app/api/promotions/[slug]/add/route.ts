import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { findOrCreateCart } from "@/src/shared/server-lib/find-or-create-cart";
import { updateCartTotalAmount } from "@/src/shared/server-lib/update-cart-total-amount";
import { promotionLive } from "@/src/shared/server-lib/promotions";

export const dynamic="force-dynamic";
export async function POST(req:NextRequest,{params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;
  const token=req.cookies.get("cartToken")?.value||crypto.randomUUID();
  try {
    const campaign=await prisma.promotion.findUnique({where:{slug}});
    if (!campaign || !promotionLive(campaign) || !campaign.giftProductId)
      return NextResponse.json({error:"Campaign not available"},{status:409});
    const ids=[...campaign.productIds,campaign.giftProductId];
    if (campaign.productIds.length<2 || new Set(ids).size!==ids.length) return NextResponse.json({error:"Invalid promotion"},{status:409});
    const cart=await findOrCreateCart(token);
    const added=await prisma.$transaction(async tx=>{
      await tx.$queryRaw`SELECT id FROM public."Cart" WHERE id=${cart.id} FOR UPDATE`;
      const products=await tx.product.findMany({where:{id:{in:ids},bottleParentId:null,available:true},include:{productGroup:true}});
      if(products.length!==ids.length || products.some(p=>!p.productGroup.onTap)) return false;
      for(const id of campaign.productIds) {
        const existing=await tx.cartItem.findFirst({where:{cartId:cart.id,productId:id,variationId:null}});
        if(existing) {
          if(existing.quantity<campaign.requiredMl) await tx.cartItem.update({where:{id:existing.id},data:{quantity:campaign.requiredMl}});
        } else await tx.cartItem.create({data:{cartId:cart.id,productId:id,quantity:campaign.requiredMl}});
      }
      await tx.cartPromotion.upsert({
        where:{cartId_promotionId:{cartId:cart.id,promotionId:campaign.id}},
        update:{},create:{cartId:cart.id,promotionId:campaign.id}
      });
      return true;
    });
    if(!added) return NextResponse.json({error:"Unavailable product"},{status:409});
    await prisma.promotion.update({where:{id:campaign.id},data:{addCount:{increment:1}}}).catch(()=>undefined);
    const cartResult=await updateCartTotalAmount(token);
    const response=NextResponse.json(cartResult,{headers:{"Cache-Control":"no-store"}});
    response.cookies.set("cartToken",token,{maxAge:604800,path:"/",sameSite:"lax"});
    return response;
  }catch(e){console.error("[PROMOTION_ADD]",e);return NextResponse.json({error:"Could not add promotion"},{status:503});}
}
