import {z} from "zod";
import {NextResponse} from "next/server";
import {prisma} from "@/prisma/prisma-client";
import {getUserSession} from "@/src/shared/server-lib/get-user-session";
import {readPricing} from "@/src/shared/lib/tax";
import {earnablePoints,accountOrderEligible,loyaltyAwardAllowed} from "@/src/shared/lib/europerfume-club";
import {orderFulfillmentBlock} from "@/src/shared/lib/order-fulfillment-shortcuts";
import {UserRole} from "@prisma/client";
const schema=z.object({orderId:z.number().int().positive(),action:z.enum(["payment_received","handed_to_carrier"]),source:z.literal("order_details").optional()});
export async function POST(request:Request){
 const admin=await getUserSession();if(!admin||admin.role!==UserRole.ADMIN)return NextResponse.json({error:"FORBIDDEN"},{status:403});
 const awardsEnabled=process.env.EUROPERFUME_CLUB_AWARD_ENABLED==="true";
 if(request.headers.get("origin")!==new URL(request.url).origin)return NextResponse.json({error:"ORIGIN"},{status:403});
 let input:z.infer<typeof schema>;try{input=schema.parse(await request.json());}catch{return NextResponse.json({error:"INPUT"},{status:400});}
 if(!input.source&&!awardsEnabled)return NextResponse.json({error:"BONUS_AWARD_NOT_LIVE"},{status:503});
 try{
  const result=await prisma.$transaction(async tx=>{
   await tx.$queryRaw`SELECT id FROM "Order" WHERE id=${input.orderId} FOR UPDATE`;
   const order=await tx.order.findUnique({where:{id:input.orderId},select:{id:true,userId:true,createdAt:true,status:true,pricingSnapshot:true}});
   if(!order)throw new Error("ORDER_NOT_FOUND");
   if(order.status==="CENCELLED")throw new Error("ORDER_CANCELLED");
   if(!input.source&&order.userId===null)throw new Error("GUEST_ORDER");
   const user=order.userId===null?null:await tx.user.findUnique({where:{id:order.userId},select:{verified:true}});
   const clubEligible=accountOrderEligible(order.userId,user?.verified||null,order.createdAt);
   if(!input.source&&!clubEligible)throw new Error("ACCOUNT_NOT_VERIFIED_AT_ORDER");
   const invoice=await tx.invoice.findUnique({where:{orderId:order.id},select:{id:true}});
   if(input.source){
    const blocked=orderFulfillmentBlock({cancelled:false,hasInvoice:Boolean(invoice),clubEligible,awardsEnabled,hasPricing:Boolean(readPricing(order.pricingSnapshot))});
    if(blocked)throw new Error(blocked);
   }else if(!invoice)throw new Error("INVOICE_REQUIRED_BEFORE_LOYALTY_AWARD");
   const existing=await tx.orderFulfillment.findUnique({where:{orderId:order.id}});
   const now=new Date();
   const paymentConfirmedAt=existing?.paymentConfirmedAt||(input.action==="payment_received"?now:null);
   const shippedConfirmedAt=existing?.shippedConfirmedAt||(input.action==="handed_to_carrier"?now:null);
   // Shipping label CREATED is deliberately not proof of hand-over.
   let awardedAt=existing?.loyaltyAwardedAt||null;
   let awardedPoints=0;
   if(clubEligible&&order.userId!==null&&loyaltyAwardAllowed(paymentConfirmedAt,shippedConfirmedAt,awardedAt)){
     const snapshot=readPricing(order.pricingSnapshot);
     if(!snapshot)throw new Error("PRICING_SNAPSHOT_REQUIRED");
     const refunds=await tx.$queryRaw<{sum:bigint}[]>`SELECT COALESCE(SUM("eligibleCents"),0) AS sum FROM "LoyaltyRefund" WHERE "orderId"=${order.id}`;
     const refundCents=Number(refunds[0]?.sum??0);
     const eligibleGross=Math.max(0,snapshot.lines.filter(l=>!l.couponExcluded).reduce((sum,l)=>sum+l.grossCents,0)-snapshot.discountGrossCents-(snapshot.loyaltyDiscountCents??0)-refundCents);
     awardedPoints=Math.floor(eligibleGross*5/100);
     if(awardedPoints>0){
      await tx.loyaltyEntry.create({data:{
       userId:order.userId,orderId:order.id,kind:"EARN",points:awardedPoints,
       idempotencyKey:`order:${order.id}:earn:v1`,note:"Paid + handed to carrier"
      }});
      await tx.loyaltyWallet.upsert({where:{userId:order.userId},
       create:{userId:order.userId,balancePoints:awardedPoints},
       update:{balancePoints:{increment:awardedPoints}}});
     }
     awardedAt=now;
   }
   await tx.orderFulfillment.upsert({where:{orderId:order.id},
    create:{orderId:order.id,paymentConfirmedAt,shippedConfirmedAt,loyaltyAwardedAt:awardedAt},
    update:{paymentConfirmedAt,shippedConfirmedAt,loyaltyAwardedAt:awardedAt}});
   return {ok:true,awardedPoints,paymentConfirmed:Boolean(paymentConfirmedAt),shippedConfirmed:Boolean(shippedConfirmedAt)};
  },{timeout:15000});
  return NextResponse.json(result);
 }catch(e){
  const err=e as {code?:string;message?:string};
  const code=err.code==="P2021"?"MIGRATION_REQUIRED":err.message||"FAILED";
  return NextResponse.json({error:code},{status:code==="MIGRATION_REQUIRED"?503:400});
 }
}
