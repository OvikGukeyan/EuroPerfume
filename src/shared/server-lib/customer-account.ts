import 'server-only';
import {prisma} from '@/prisma/prisma-client';
import {readPricing} from '@/src/shared/lib/tax';
import type {AccountData} from '@/src/shared/lib/customer-account';
export async function loadCustomerAccount(userId:number):Promise<AccountData|null> {
 const user=await prisma.user.findUnique({where:{id:userId},select:{fullName:true,email:true,provider:true,accountConsent:{select:{marketingRequestedAt:true,marketingConfirmedAt:true,marketingWithdrawnAt:true}},addresses:{select:{id:true,fullName:true,street:true,houseNumber:true,city:true,postalCode:true,country:true,phone:true},orderBy:{createdAt:'desc'}}}});
 if(!user) return null;
 const orders=await prisma.order.findMany({where:{userId},orderBy:{createdAt:'desc'},include:{invoice:{select:{id:true}},shipments:{select:{shipmentNo:true,carrier:true,status:true,createdAt:true},orderBy:{createdAt:'desc'}},items:{include:{product:{select:{imageUrl:true,volume:true,productGroup:{select:{onTap:true}}}}}}}});
 return {fullName:user.fullName,email:user.email,provider:Boolean(user.provider),newsletter:{requested:Boolean(user.accountConsent?.marketingRequestedAt),confirmed:Boolean(user.accountConsent?.marketingConfirmedAt&&!user.accountConsent?.marketingWithdrawnAt),withdrawn:Boolean(user.accountConsent?.marketingWithdrawnAt)},addresses:user.addresses,orders:orders.map(o=>{
 const pricing=readPricing(o.pricingSnapshot);
 const shipment=o.shipments.find(s=>s.status!=='CANCELED');
 return {id:o.id,date:o.createdAt.toISOString(),status:o.status,tracking:shipment?.shipmentNo||o.trackingCode,carrier:shipment?.carrier||'DHL',shipmentStatus:shipment?.status||null,shippedAt:shipment&&['HANDED_OVER','IN_TRANSIT','DELIVERED'].includes(shipment.status)?shipment.createdAt.toISOString():null,total:Number(o.totalAmount),subtotal:pricing?pricing.subtotalGrossCents/100:null,shipping:pricing?pricing.shippingGrossCents/100:null,discount:pricing?pricing.discountGrossCents/100:null,invoice:Boolean(o.invoice),address:[o.deliveryFullNmae,`${o.deliveryAddress} ${o.deliveryHouseNumber}`,`${o.deliveryZip} ${o.deliveryCity}`,o.deliveryCountry].filter(Boolean).join(' · '),items:o.items.map(i=>{
 const line=pricing?.lines.find(l=>l.productId===i.productId&&l.variationId===i.variationId);
 return {id:i.productId,name:i.name,image:i.product.imageUrl[0]||'',amount:(line?.onTap??i.product.productGroup?.onTap)?`${i.quantity} ml`:`${i.quantity} × ${i.product.volume?i.product.volume+' ml':''}`,total:line?line.grossCents/100:null};
 })};
 })};
}
