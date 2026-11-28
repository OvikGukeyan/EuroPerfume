import { BLACK_FRIDAY, blackFridayActive, isBlackFridayCode } from "@/src/shared/lib/black-friday";
import { couponQuote } from "@/src/shared/lib/coupon-eligibility";
import { offerPrices } from "@/src/shared/lib/day-offer";
import { promotionLive, promotionQualified } from "@/src/shared/lib/promotion-rules";
import { prisma } from "@/prisma/prisma-client";
import { getUserSession } from "@/src/shared/server-lib/get-user-session";
import { checkCouponPolicy, findCouponPolicy, normalizeCode } from "@/src/shared/server-lib/coupon-policies";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const input = await req.json();
    const code = typeof input?.code === "string" ? normalizeCode(input.code) : "";
    if (!code || code.length > 80) return NextResponse.json({ valid:false },{status:400});
    const now = new Date();
    const blackFriday=isBlackFridayCode(code);
    const promo=blackFriday ? null : await prisma.promoCode.findFirst({
      where:{code:{equals:code,mode:"insensitive"},isActive:true,OR:[{expiresAt:null},{expiresAt:{gt:now}}]}
    });
    if (blackFriday && !blackFridayActive(now.getTime()))
      return NextResponse.json({valid:false,message:"BLACK15: 27.11.2026, Europe/Berlin"},{status:404});
    if(!blackFriday && !promo) return NextResponse.json({valid:false},{status:404});
    const policy=blackFriday ? null : await findCouponPolicy(prisma,promo!.code);
    if(policy){
      const session=await getUserSession();
      const failure=await checkCouponPolicy(prisma,policy,session?Number(session.id):null,now);
      if(failure) return NextResponse.json({valid:false,reason:failure},{status:422});
    }
    const discount=blackFriday ? 0 : promo!.discount;
    const token=(await cookies()).get("cartToken")?.value;
    const cart=token ? await prisma.cart.findFirst({where:{token},include:{
      items:{include:{product:{include:{productGroup:true}}}},promotions:{include:{promotion:true}}
    }}) : null;
    const lines=cart?.items||[];
    const candidatePromotions=(cart?.promotions||[]).filter(link=>
      promotionLive(link.promotion,now) && promotionQualified(link.promotion,lines)
    );
    const gifts=candidatePromotions.length
      ? await prisma.product.findMany({where:{id:{in:candidatePromotions.map(link=>link.promotion.giftProductId).filter((id):id is number=>id!==null)},available:true,bottleParentId:null},select:{id:true}})
      : [];
    const availableGiftIds=new Set(gifts.map(g=>g.id));
    const blocked=new Set(candidatePromotions.filter(link=>link.promotion.giftProductId!==null &&
      availableGiftIds.has(link.promotion.giftProductId)).flatMap(link=>link.promotion.productIds));
    const quote=couponQuote(lines.map(item=>{
      const price=offerPrices(item.product,item.quantity,Boolean(item.product.productGroup?.onTap),now.getTime(),true,item.packMl);
      const dayActive=Boolean(item.product.dayOfferStartsAt && item.product.dayOfferEndsAt &&
        now >= item.product.dayOfferStartsAt && now < item.product.dayOfferEndsAt);
      return {productId:item.productId,grossCents:Math.round(price.effective*100),
        excluded:price.discounted||dayActive||blocked.has(item.productId)};
    }),discount,code,now.getTime());
    if(quote.discountCents===0) return NextResponse.json({valid:false,reason:"NO_ELIGIBLE_ITEMS"},{status:422});
    return NextResponse.json({valid:true,code:blackFriday?BLACK_FRIDAY.code:promo!.code,discount:quote.percentage,
      discountCents:quote.discountCents,eligibleCents:quote.eligibleCents,excludedCents:quote.excludedCents});
  } catch(error) {
    console.error("[PROMOCODE_VALIDATE]",error);
    return NextResponse.json({valid:false},{status:500});
  }
}
