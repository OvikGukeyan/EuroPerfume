import "server-only";
import { calcCartItemTotalPrice } from "../lib/calc-cart-item-total-price";
import { prisma } from "@/prisma/prisma-client";
import { getActivePromotions, promotionProducts } from "./promotions";

export type HeroPromotion = {
  slug:string; titleRu:string;titleDe:string;
  image:string|null; requiredMl:number; giftMl:number; products:{id:number;name:string;brand:string;image:string;price:number;isGift:boolean}[];
  preview:boolean;
};
export async function getHeroPromotion():Promise<HeroPromotion|null> {
  const promotions=await getActivePromotions();
  const first=promotions[0];
  if(first) {
    const products=await promotionProducts(first);
    const ordered=[...first.productIds,...(first.giftProductId?[first.giftProductId]:[])];
    return {slug:first.slug,titleRu:first.titleRu,titleDe:first.titleDe,image:first.heroImage,
      requiredMl:first.requiredMl,giftMl:first.giftMl,
      products:ordered.map(id=>products.find(p=>p.id===id)).filter((p):p is NonNullable<typeof p>=>Boolean(p)).map(p=>({
        id:p.id,name:p.name,brand:p.brand.name,image:p.imageUrl[0]||"",isGift:p.id===first.giftProductId,
        price:calcCartItemTotalPrice(Number(p.price),p.id===first.giftProductId?first.giftMl:first.requiredMl,true,p.discountPrice?Number(p.discountPrice):undefined,p)
      })),preview:false};
  }
  // Preview-only visual fallback while the promotion migration is not applied.
  if(process.env.VERCEL_ENV==="production") return null;
  const products=await prisma.product.findMany({where:{bottleParentId:null,available:true,
    OR:[{name:{contains:"Cedar Chic",mode:"insensitive"}},{name:{contains:"Bois Imp",mode:"insensitive"}},{name:{contains:"Encre Noire",mode:"insensitive"}}]
  },take:8});
  if(products.length<3) return null;
  return {slug:"wood-trio",titleRu:"Три оттенка древесины",titleDe:"Drei Facetten von Holz",
    image:null,requiredMl:5,giftMl:2,preview:true,products:products.map(p=>({id:p.id,name:p.name,brand:"",image:p.imageUrl[0]||"",price:0,isGift:p.name.trim()==="Encre Noire"}))};
}
