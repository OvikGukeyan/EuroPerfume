import "server-only";
import { prisma } from "@/prisma/prisma-client";
import { offerPrices } from "@/src/shared/lib/day-offer";
import { offerWeekSlots } from "@/src/shared/lib/day-offer-week";

export type FeaturedDayFragrance = {
  id:number; name:string; brand:string; image:string;
  startsAt:string; endsAt:string;
  regularPrice:number; salePrice:number; volume:number;
  href:string;
};

/** Return the live and next-week offer so the client can switch at midnight without a page reload. */
export async function getWeekFragrances():Promise<FeaturedDayFragrance[]> {
  const now=new Date(),slots=offerWeekSlots(now);
  const products=await prisma.product.findMany({
    where:{
      available:true,bottleParentId:null,
      dayOfferStartsAt:{lt:slots.next.end},
      dayOfferEndsAt:{gt:now},
      productGroup:{onTap:true}
    },
    include:{brand:true,productGroup:true},
    orderBy:{dayOfferStartsAt:"asc"}
  });
  return products.map(p=>{
    const volume=5;
    // Price at the effective start; future offers are still discounted in their previews.
    const pricingTime=Math.max(now.getTime(),p.dayOfferStartsAt!.getTime());
    const prices=offerPrices({price:Number(p.price),discountPrice:p.discountPrice?Number(p.discountPrice):undefined,dayOfferStartsAt:p.dayOfferStartsAt,dayOfferEndsAt:p.dayOfferEndsAt},volume,true,pricingTime);
    return {
      id:p.id,name:p.name.trim(),brand:p.brand.name,
      image:p.imageUrl[0]||"",startsAt:p.dayOfferStartsAt!.toISOString(),
      endsAt:p.dayOfferEndsAt!.toISOString(),volume,
      regularPrice:prices.regular,salePrice:prices.effective,
      href:"/product/"+p.id
    };
  });
}
