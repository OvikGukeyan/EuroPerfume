import "server-only";
import { prisma } from "@/prisma/prisma-client";
import { getActivePromotions, promotionProducts } from "./promotions";

export type HeroPromotion = {
  slug:string; titleRu:string;titleDe:string;
  image:string|null; products:{id:number;name:string;image:string}[];
  preview:boolean;
};
export async function getHeroPromotion():Promise<HeroPromotion|null> {
  const promotions=await getActivePromotions();
  const first=promotions[0];
  if(first) {
    const products=await promotionProducts(first);
    return {slug:first.slug,titleRu:first.titleRu,titleDe:first.titleDe,image:first.heroImage,
      products:products.map(p=>({id:p.id,name:p.name,image:p.imageUrl[0]||""})),preview:false};
  }
  // Preview-only visual fallback while the promotion migration is not applied.
  if(process.env.VERCEL_ENV==="production") return null;
  const products=await prisma.product.findMany({where:{bottleParentId:null,available:true,
    OR:[{name:{contains:"Cedar Chic",mode:"insensitive"}},{name:{contains:"Bois Imp",mode:"insensitive"}},{name:{contains:"Encre Noire",mode:"insensitive"}}]
  },take:8});
  if(products.length<3) return null;
  return {slug:"wood-trio",titleRu:"Три оттенка древесины",titleDe:"Drei Facetten von Holz",
    image:null,preview:true,products:products.map(p=>({id:p.id,name:p.name,image:p.imageUrl[0]||""}))};
}
