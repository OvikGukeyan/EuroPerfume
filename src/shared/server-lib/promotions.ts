import "server-only";
import { prisma } from "@/prisma/prisma-client";

export type PromoView = {
  id: string; slug: string; titleRu: string; titleDe: string;
  active: boolean; requiredMl: number; giftMl: number;
  productIds: number[]; giftProductId: number | null; heroImage: string | null;
  startsAt: Date | null; endsAt: Date | null; priority: number;
};
export type PromoLine = {id:number; quantity:number; variationId:number|null; productId:number};

export { promotionLive, promotionQualified } from "../lib/promotion-rules";
export async function getPromotion(slug: string): Promise<PromoView | null> {
  try { return await prisma.promotion.findUnique({where:{slug}}); }
  catch (error) { console.error("[promotions] Database migration pending", error); return null; }
}
export async function getActivePromotions() {
  try {
    return await prisma.promotion.findMany({where:{active:true, OR:[{endsAt:null},{endsAt:{gt:new Date()}}]},orderBy:{priority:"desc"}});
  } catch { return []; }
}
export async function getCartPromotions(cartId: number) {
  try { return await prisma.cartPromotion.findMany({where:{cartId},include:{promotion:true}}); }
  catch { return []; }
}
export async function promotionProducts(p: PromoView) {
  const ids=[...new Set([...p.productIds, ...(p.giftProductId ? [p.giftProductId] : [])])];
  return prisma.product.findMany({where:{id:{in:ids},available:true,bottleParentId:null},include:{brand:true,productGroup:true}});
}
