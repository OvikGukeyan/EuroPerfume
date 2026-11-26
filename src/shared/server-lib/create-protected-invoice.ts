import 'server-only';
import type { Prisma } from '@prisma/client';
import prisma from '@/prisma/prisma-client';
import { requireInvoiceAdmin } from './invoice-corrections';
import {settlePointsAtInvoice} from './preinvoice-loyalty';
import { pdfHash } from './invoice-document';
import { generateInvoicePdf } from './generate-invoice-pdf';
import { berlinDate,validateSupplyDate,readPricing,capturePricing,cents,invoiceTax } from '../lib/tax';
export async function createProtectedInvoice(orderId:number,supplyDateValue:string) {
 await requireInvoiceAdmin();
 if(!Number.isSafeInteger(orderId)||orderId<=0) throw new Error('Некорректный номер заказа');
 return prisma.$transaction(tx => issueOrderInvoice(tx, orderId, supplyDateValue), {timeout:20000});
}

/** Must be called inside the issuance transaction after the caller authorizes the operation. */
export async function issueOrderInvoice(tx: Prisma.TransactionClient, orderId: number, supplyDateValue: string) {
  await tx.$queryRaw`SELECT id FROM "Order" WHERE id=${orderId} FOR UPDATE`;
  const exists=await tx.invoice.findUnique({where:{orderId}});
  const invoiceUrl=`/api/invoices/${orderId}`;
  if(exists) return {ok:true as const,invoiceUrl, invoiceNumber:exists.invoiceNumber};
  const order=await tx.order.findUnique({where:{id:orderId},include:{items:{include:{product:{include:{brand:true,productGroup:true}}}}}});
  if(!order) throw new Error('Заказ не найден');
  const promotionRecords=await tx.orderPromotion.findMany({where:{orderId}});
  const giftLines=promotionRecords.map(record=>record.snapshot as {giftName:string;giftMl:number}).filter(p=>p.giftName && p.giftMl>0).map(p=>({title:p.giftName,ml:p.giftMl}));
  if(order.status==='CENCELLED')throw new Error('Нельзя выставить счёт по отменённой заявке');
  const supplyDate=validateSupplyDate(supplyDateValue,order.createdAt);
  const pricing=readPricing(order.pricingSnapshot)??capturePricing(order.items,order.deliveryCountry,order.discount??0,order.createdAt);
  if(pricing.totalGrossCents!==cents(Number(order.totalAmount))) return {ok:false as const,message:'Исторические цены не совпадают с суммой заказа. Проверьте данные перед созданием счёта.'};
  const taxSnapshot=invoiceTax(pricing,supplyDate);
  const issuedAt=new Date(),year=Number(berlinDate(issuedAt).slice(0,4));
  const counters=await tx.$queryRaw<{lastValue:number}[]>`INSERT INTO "InvoiceCounter" (year,"lastValue") VALUES (${year},1) ON CONFLICT (year) DO UPDATE SET "lastValue"="InvoiceCounter"."lastValue"+1 RETURNING "lastValue"`;
  const invoiceNumber=`EP-${year}-${String(counters[0].lastValue).padStart(6,'0')}`;
  const pdf=await generateInvoicePdf(order,invoiceNumber,pricing,taxSnapshot,issuedAt,giftLines);
  const invoice=await tx.invoice.create({data:{orderId,pdfUrl:invoiceUrl,supplyDate,taxSnapshot,issuedAt,year,invoiceNumber}});
  const sha256=pdfHash(pdf);
  await tx.$executeRaw`INSERT INTO "InvoiceDocument" ("invoiceId",pdf,sha256) VALUES (${invoice.id},${pdf},${sha256})`;
  await settlePointsAtInvoice(tx,order.id,order.userId,pricing);
  return {ok:true as const,invoiceUrl, invoiceNumber};
}
