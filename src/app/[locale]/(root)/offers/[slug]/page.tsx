import { calcCartItemTotalPrice } from "@/src/shared/lib/calc-cart-item-total-price";
import { notFound } from "next/navigation";
import { getPromotion, promotionLive, promotionProducts } from "@/src/shared/server-lib/promotions";
import { PromotionOffer } from "@/src/shared/components/shared/promotion-offer";
export const dynamic="force-dynamic";
export default async function Offer({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;
  const promotion=await getPromotion(slug);
  if(!promotion || !promotionLive(promotion) || !promotion.giftProductId) notFound();
  const products=await promotionProducts(promotion);
  const items=promotion.productIds.map(id=>products.find(p=>p.id===id)).filter((p):p is NonNullable<typeof p>=>Boolean(p));
  const gift=products.find(p=>p.id===promotion.giftProductId);
  return <PromotionOffer slug={promotion.slug} titleRu={promotion.titleRu} titleDe={promotion.titleDe}
    requiredMl={promotion.requiredMl} giftMl={promotion.giftMl} available={items.length===promotion.productIds.length && !!gift}
    items={items.map(p=>({id:p.id,name:p.name,brand:p.brand.name,image:p.imageUrl[0]||"",price:calcCartItemTotalPrice(Number(p.price),promotion.requiredMl,true,p.discountPrice?Number(p.discountPrice):undefined,p)}))}
    gift={gift?{name:gift.name,brand:gift.brand.name,image:gift.imageUrl[0]||"",price:calcCartItemTotalPrice(Number(gift.price),promotion.giftMl,true,gift.discountPrice?Number(gift.discountPrice):undefined,gift)}:null}/>;
}
