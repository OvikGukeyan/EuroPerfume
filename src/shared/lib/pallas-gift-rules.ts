export const PALLAS_GIFT = {slug:"pallas-athene-threshold-2026",productId:295,thresholdCents:10000,ml:5,slots:10,name:"Argos Pallas Athene"} as const;
export function qualifyingGiftAmount(subtotalCents:number,couponCents:number,loyaltyCents:number){
 return Math.max(0,subtotalCents-couponCents-loyaltyCents)>=PALLAS_GIFT.thresholdCents;
}
export type PallasOfferState = "off"|"eligible"|"claimed"|"exhausted";
