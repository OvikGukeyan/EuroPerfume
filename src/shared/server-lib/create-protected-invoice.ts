import 'server-only';
import prisma from '@/prisma/prisma-client';
import { requireInvoiceAdmin } from './invoice-corrections';
import { pdfHash } from './invoice-document';
import { generateInvoicePdf } from './generate-invoice-pdf';
import { berlinDate,validateSupplyDate,readPricing,capturePricing,cents,invoiceTax } from '../lib/tax';
export async function createProtectedInvoice(orderId:number,supplyDateValue:string) {
 await requireInvoiceAdmin();
 if(!Number.isSafeInteger(orderId)||orderId<=0) throw new Error('Некорректный номер заказа');
 return prisma.$transaction(async tx=>{
  await tx.$queryRaw`SELECT id FROM "Order" WHERE id=${orderId} FOR UPDATE`;
  const exists=await tx.invoice.findUnique({where:{orderId}});
  const invoiceUrl=`/api/invoices/${orderId}`;
  if(exists) return {ok:true,invoiceUrl};
  const order=await tx.order.findUnique({where:{id:orderId},include:{items:{include:{product:{include:{brand:true,productGroup:true}}}}}});
  if(!order) throw new Error('Заказ не найден');
  const supplyDate=validateSupplyDate(supplyDateValue,order.createdAt);
  const pricing=readPricing(order.pricingSnapshot)??capturePricing(order.items,order.deliveryCountry,order.discount??0,order.createdAt);
  if(pricing.totalGrossCents!==cents(Number(order.totalAmount))) return {ok:false,message:'Исторические цены не совпадают с суммой заказа. Проверьте данные перед созданием счёта.'};
  const taxSnapshot=invoiceTax(pricing,supplyDate);
  const issuedAt=new Date(),year=Number(berlinDate(issuedAt).slice(0,4));
  const counters=await tx.$queryRaw<{lastValue:number}[]>`INSERT INTO "InvoiceCounter" (year,"lastValue") VALUES (${year},1) ON CONFLICT (year) DO UPDATE SET "lastValue"="InvoiceCounter"."lastValue"+1 RETURNING "lastValue"`;
  const invoiceNumber=`EP-${year}-${String(counters[0].lastValue).padStart(6,'0')}`;
  const pdf=await generateInvoicePdf(order,invoiceNumber,pricing,taxSnapshot,issuedAt);
  const invoice=await tx.invoice.create({data:{orderId,pdfUrl:invoiceUrl,supplyDate,taxSnapshot,issuedAt,year,invoiceNumber}});
  const sha256=pdfHash(pdf);
  await tx.$executeRaw`INSERT INTO "InvoiceDocument" ("invoiceId",pdf,sha256) VALUES (${invoice.id},${pdf},${sha256})`;
  return {ok:true,invoiceUrl};
 },{timeout:20000});
}
