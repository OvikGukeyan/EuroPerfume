import "server-only";
import {randomUUID} from "node:crypto";
import type {Prisma} from "@prisma/client";
import type {PricingSnapshot} from "@/src/shared/lib/tax";
import {readPricing,reviseOrderPricing} from "@/src/shared/lib/tax";

type DB=Prisma.TransactionClient;
type OrderRow={id:number;userId:number|null;status:string;createdAt:Date;deliveryCountry:string;discount:number|null;pricingSnapshot:Prisma.JsonValue|null};
type PriceableItem=Parameters<typeof reviseOrderPricing>[0][number];

/** Every edit or cancellation must serialize against the Order row before calling this helper. */
export async function lockEditableOrder(tx:DB,orderId:number){
 await tx.$queryRaw`SELECT id FROM "Order" WHERE id=${orderId} FOR UPDATE`;
 const order=await tx.order.findUnique({where:{id:orderId},include:{fulfillment:true,invoice:true}});
 if(!order)throw Error("ORDER_NOT_FOUND");
 if(order.invoice)throw Error("INVOICE_ALREADY_ISSUED");
 if(order.fulfillment?.paymentConfirmedAt)throw Error("PAYMENT_ALREADY_CONFIRMED");
 if(order.fulfillment?.shippedConfirmedAt || order.status==="SUCCEEDED" || order.status==="CENCELLED")throw Error("ORDER_NOT_EDITABLE");
 return order;
}

/** Audit the original debit and accumulated pre-invoice returns before crediting. */
async function reservedFromLedger(tx:DB,orderId:number,userId:number):Promise<number>{
 const entries=await tx.loyaltyEntry.findMany({where:{orderId},select:{kind:true,points:true,userId:true}});
 if(entries.some(e=>e.userId!==userId))throw Error("LOYALTY_LEDGER_MISMATCH");
 const debit=-entries.filter(e=>e.kind==="SPEND").reduce((a,e)=>a+e.points,0);
 const releases=entries.filter(e=>e.kind==="RESERVATION_RELEASE"||e.kind==="RESERVATION_CANCELLED").reduce((a,e)=>a+e.points,0);
 if(debit<0||releases<0||releases>debit)throw Error("LOYALTY_LEDGER_MISMATCH");
 return debit-releases;
}

async function creditReservation(tx:DB,orderId:number,userId:number,points:number,cancel=false){
 if(!Number.isSafeInteger(points)||points<0)throw Error("INVALID_POINTS");
 if(!points)return;
 await tx.loyaltyEntry.create({data:{userId,orderId,
  kind:cancel?"RESERVATION_CANCELLED":"RESERVATION_RELEASE",points,
  idempotencyKey:cancel?`order:${orderId}:cancel-reservation:v1`:`order:${orderId}:release:${randomUUID()}`,
  note:cancel?"Unpaid enquiry cancelled without invoice":"Items revised before invoice; unused reservation released"
 }});
 await tx.loyaltyWallet.update({where:{userId},data:{balancePoints:{increment:points}}});
}

/** Managed coupon is consumed at enquiry time. Release if no eligible discounted items remain. */
async function reconcileCoupon(tx:DB,orderId:number,discountCents:number){
 const redemption=await tx.couponRedemption.findUnique({where:{orderId}});
 if(!redemption)return;
 if(discountCents){
  if(discountCents!==redemption.discountCents)await tx.couponRedemption.update({where:{id:redemption.id},data:{discountCents}});
  return;
 }
 await tx.couponRedemption.delete({where:{id:redemption.id}});
 const updated=await tx.couponPolicy.updateMany({where:{code:redemption.code,usedCount:{gt:0}},data:{usedCount:{decrement:1}}});
 if(updated.count!==1)throw Error("COUPON_COUNTER_MISMATCH");
}

/** Repricing must happen within the item-mutation transaction, after locking Order. */
export async function updatePreinvoiceOrder(tx:DB,order:OrderRow,items:PriceableItem[]){
 if(!items.length)throw Error("EMPTY_ENQUIRY_CANCEL_INSTEAD");
 const prior=readPricing(order.pricingSnapshot);
 if(!prior && order.pricingSnapshot!==null)throw Error("PRICING_SNAPSHOT_INVALID");
 const pricing=reviseOrderPricing(items,order.deliveryCountry,order.discount??0,order.createdAt,prior);
 const previousPoints=prior?.loyaltyDiscountCents??0;
 const newPoints=pricing.loyaltyDiscountCents??0;
 if(newPoints>previousPoints)throw Error("ADDITIONAL_POINTS_REQUIRE_BUYER_APPROVAL");
 if(previousPoints){
  if(order.userId===null)throw Error("LOYALTY_ACCOUNT_REQUIRED");
  if(await reservedFromLedger(tx,order.id,order.userId)!==previousPoints)throw Error("LOYALTY_LEDGER_MISMATCH");
  await creditReservation(tx,order.id,order.userId,previousPoints-newPoints);
 }
 await reconcileCoupon(tx,order.id,pricing.discountGrossCents);
 const couponStillApplies=pricing.discountGrossCents>0;
 await tx.order.update({where:{id:order.id},data:{
  totalAmount:pricing.totalGrossCents/100,pricingSnapshot:pricing,
  ...(couponStillApplies?{}:{discount:0,promocode:null})
 }});
 return pricing;
}

/** Unpaid, uninvoiced cancellation. Repeated attempts return without another credit. */
export async function cancelUnpaidEnquiry(tx:DB,orderId:number){
 await tx.$queryRaw`SELECT id FROM "Order" WHERE id=${orderId} FOR UPDATE`;
 const order=await tx.order.findUnique({where:{id:orderId},include:{invoice:true,fulfillment:true}});
 if(!order)throw Error("ORDER_NOT_FOUND");
 if(order.status==="CENCELLED")return {status:"CENCELLED",alreadyCancelled:true,returnedPoints:0};
 if(order.invoice)throw Error("INVOICE_EXISTS_USE_STORNO");
 if(order.fulfillment?.paymentConfirmedAt)throw Error("PAYMENT_EXISTS_REFUND_PROCEDURE");
 if(order.fulfillment?.shippedConfirmedAt||order.status==="SUCCEEDED")throw Error("SHIPPING_ALREADY_CONFIRMED");
 const pricing=readPricing(order.pricingSnapshot);
 if(!pricing && order.pricingSnapshot!==null)throw Error("PRICING_SNAPSHOT_INVALID");
 const reserved=pricing?.loyaltyDiscountCents??0;
 if(reserved){
  if(order.userId===null||await reservedFromLedger(tx,order.id,order.userId)!==reserved)throw Error("LOYALTY_LEDGER_MISMATCH");
  await creditReservation(tx,order.id,order.userId,reserved,true);
 }
 await reconcileCoupon(tx,order.id,0);
 await tx.order.update({where:{id:order.id},data:{status:"CENCELLED"}});
 return {status:"CENCELLED",alreadyCancelled:false,returnedPoints:reserved};
}
