import "server-only";
import { prisma } from "@/prisma/prisma-client";
import { offerPrices } from "@/src/shared/lib/day-offer";

export type FeaturedDayFragrance = {
  id:number; name:string; brand:string; image:string;
  startsAt:string; endsAt:string;
  regularPrice:number; salePrice:number; volume:number;
  href:string;
};

export async function getActiveDayFragrance():Promise<FeaturedDayFragrance|null>{
  const now=new Date();
  const p=await prisma.product.findFirst({
    where:{
      available:true,bottleParentId:null,
      dayOfferStartsAt:{lte:now},
      dayOfferEndsAt:{gt:now},
      productGroup:{onTap:true}
    },
    include:{brand:true,productGroup:true},
    orderBy:{dayOfferStartsAt:"desc"}
  });
  if(!p)return null;
  const volume=5;
  const prices=offerPrices({price:Number(p.price),discountPrice:p.discountPrice?Number(p.discountPrice):undefined,dayOfferStartsAt:p.dayOfferStartsAt,dayOfferEndsAt:p.dayOfferEndsAt},volume,true,now.getTime());
  return {
    id:p.id,name:p.name.trim(),brand:p.brand.name,
    image:p.imageUrl[0]||"",startsAt:p.dayOfferStartsAt!.toISOString(),
    endsAt:p.dayOfferEndsAt!.toISOString(),volume,
    regularPrice:prices.regular,salePrice:prices.effective,
    href:"/product/"+p.id
  };
}
