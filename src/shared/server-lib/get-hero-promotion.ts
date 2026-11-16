import "server-only";
import { calcCartItemTotalPrice } from "../lib/calc-cart-item-total-price";
import { prisma } from "@/prisma/prisma-client";
import { getActivePromotions, promotionProducts } from "./promotions";

export type HeroPromotion = {
  slug:string; titleRu:string;titleDe:string;
  image:string|null; requiredMl:number; giftMl:number; products:{id:number;name:string;brand:string;image:string;price:number;isGift:boolean}[];
  preview:boolean;
};
export async function getHeroPromotions(): Promise<HeroPromotion[]> {
  const promotions=await getActivePromotions();
  if(promotions.length) {
    // The original wood-trio promotion leads; additional active offers follow.
    const orderedPromotions=[...promotions].sort((a,b)=>
      (a.slug==="wood-trio"?-1:b.slug==="wood-trio"?1:0) || b.priority-a.priority
    );
    const results=await Promise.all(orderedPromotions.map(async promotion=>{
      const products=await promotionProducts(promotion);
      const ordered=[...promotion.productIds,...(promotion.giftProductId?[promotion.giftProductId]:[])];
      if(ordered.length!==3 || ordered.some(id=>!products.some(p=>p.id===id))) return null;
      return {slug:promotion.slug,titleRu:promotion.titleRu,titleDe:promotion.titleDe,image:promotion.heroImage,
        requiredMl:promotion.requiredMl,giftMl:promotion.giftMl,
        products:ordered.map(id=>products.find(p=>p.id===id)!).map(p=>({
          id:p.id,name:p.name,brand:p.brand.name,image:p.imageUrl[0]||"",isGift:p.id===promotion.giftProductId,
          price:calcCartItemTotalPrice(Number(p.price),p.id===promotion.giftProductId?promotion.giftMl:promotion.requiredMl,true,p.discountPrice?Number(p.discountPrice):undefined,p)
        })),preview:false};
    }));
    return results.filter((promotion):promotion is NonNullable<typeof promotion>=>promotion!==null);
  }
  // Preview-only visual fallback while the promotion migration is not applied.
  if(process.env.VERCEL_ENV==="production") return [];
  const products=await prisma.product.findMany({where:{bottleParentId:null,available:true,
    OR:[{name:{contains:"Cedar Chic",mode:"insensitive"}},{name:{contains:"Bois Imp",mode:"insensitive"}},{name:{contains:"Encre Noire",mode:"insensitive"}}]
  },take:8});
  if(products.length<3) return [];
  return [{slug:"wood-trio",titleRu:"Три оттенка древесины",titleDe:"Drei Facetten von Holz",
    image:null,requiredMl:5,giftMl:2,preview:true,products:products.map(p=>({id:p.id,name:p.name,brand:"",image:p.imageUrl[0]||"",price:0,isGift:p.name.trim()==="Encre Noire"}))}];
}
