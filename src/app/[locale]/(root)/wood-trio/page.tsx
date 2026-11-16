import { prisma } from "@/prisma/prisma-client";
import { getPromotion, promotionLive } from "@/src/shared/server-lib/promotions";
import { calcCartItemTotalPrice } from "@/src/shared/lib/calc-cart-item-total-price";
import { PromotionOffer } from "@/src/shared/components/shared/promotion-offer";
export const dynamic = "force-dynamic";
const normalize=(name:string)=>name.trim().normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
export default async function WoodTrioPage() {
  const campaign=await getPromotion("wood-trio");
  const products=await prisma.product.findMany({where:{available:true,bottleParentId:null,
    OR:[{name:{contains:"Cedar Chic",mode:"insensitive"}},{name:{contains:"Bois Imp",mode:"insensitive"}},{name:{contains:"Encre Noire",mode:"insensitive"}}]
  },include:{brand:true,productGroup:true}});
  const match=(name:string)=>products.find(p=>normalize(p.name)===normalize(name)&&p.productGroup.onTap);
  const cedar=match("Cedar Chic"),bois=match("Bois Imperial"),gift=match("Encre Noire");
  const items=[cedar,bois].filter((p):p is NonNullable<typeof p>=>Boolean(p));
  const ready=Boolean(campaign&&promotionLive(campaign)&&cedar&&bois&&gift);
  return <PromotionOffer slug="wood-trio" titleRu="Три оттенка древесины" titleDe="Drei Facetten von Holz"
    requiredMl={5} giftMl={2} available={ready}
    items={items.map(p=>({id:p.id,name:p.name,brand:p.brand.name,image:p.imageUrl[0]||"",
      price:calcCartItemTotalPrice(Number(p.price),5,true,p.discountPrice?Number(p.discountPrice):undefined,p)}))}
    gift={gift?{name:gift.name,brand:gift.brand.name,image:gift.imageUrl[0]||""}:null}/>;
}
