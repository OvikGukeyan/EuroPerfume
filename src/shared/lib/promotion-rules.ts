export type PromoRequirements = { productIds:number[];requiredMl:number;active:boolean;startsAt:Date|null;endsAt:Date|null };
export type PromoCartLine = { productId:number;variationId:number|null;quantity:number;packMl?:number|null };
export function promotionLive(p:PromoRequirements,at:Date=new Date()) {
 return p.active && (!p.startsAt || p.startsAt<=at) && (!p.endsAt || p.endsAt>at);
}
export function promotionQualified(p:PromoRequirements,lines:PromoCartLine[]) {
 return p.productIds.length>=2 && new Set(p.productIds).size===p.productIds.length &&
   p.productIds.every(id=>lines.some(l=>l.productId===id && l.variationId===null && (l.packMl??l.quantity)>=p.requiredMl));
}
