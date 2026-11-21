'use server';
import { z } from 'zod';
import { prisma } from '@/prisma/prisma-client';
import { CorrectionInput } from '@/src/shared/lib/invoice-correction';
import { requireInvoiceAdmin, getCorrectionContext, prepareCorrection, issueCorrection } from '@/src/shared/server-lib/invoice-corrections';
import { correctionPdf } from '@/src/shared/server-lib/correction-pdf';
import { berlinDate,readPricing } from '@/src/shared/lib/tax';
import {earnedPointsAfterRefund,refundableSpentPoints} from '@/src/shared/lib/loyalty-arithmetic';

export async function loadInvoiceCorrections(orderId: number) {
  await requireInvoiceAdmin(); z.number().int().positive().parse(orderId);
  const { invoice, corrections, refunds } = await getCorrectionContext(orderId);
  const saved = corrections[0]?.snapshot.baseline;
  const tax = invoice.taxSnapshot as { grossCents?: number } | null;
  return {
    originalNumber: invoice.invoiceNumber, originalUrl: `/api/invoices/${orderId}`,
    originalAmount: ((saved?.grossCents ?? tax?.grossCents ?? Math.round(Number(invoice.order.totalAmount) * 100)) / 100).toFixed(2),
    customer: saved?.customer ?? [invoice.order.fullName, `${invoice.order.address} ${invoice.order.houseNumber}`, `${invoice.order.zip} ${invoice.order.city}`, invoice.order.country].join('\n'),
    legacy: !invoice.taxSnapshot, locked: Boolean(saved),
    corrections: corrections.map(c => ({ id: c.id, number: c.number, grossCents: c.grossCents, issuedAt: c.issuedAt.toISOString(), refund: refunds.find(r => r.correctionId === c.id) ?? null })),
  };
}
export async function previewInvoiceCorrection(input: CorrectionInput) {
  await requireInvoiceAdmin(); const p = await prepareCorrection(input);
  const pdf = await correctionPdf(p.snapshot, true);
  return { previewHash: p.previewHash, pdf: pdf.toString('base64'), grossCents: p.snapshot.grossCents };
}
export async function createInvoiceCorrection(input: CorrectionInput, previewHash: string, confirmed: boolean) {
  const actor = await requireInvoiceAdmin();
  if (confirmed !== true) throw new Error('Подтвердите выпуск документа');
  z.string().regex(/^[a-f0-9]{64}$/).parse(previewHash);
  return issueCorrection(input, previewHash, actor);
}
export async function recordInvoiceRefund(raw: { correctionId: string; paidAt: string; reference: string; confirmed: boolean; eligibleRefundAmount?:string }) {
  const actor = await requireInvoiceAdmin();
  const data = z.object({
    correctionId:z.string().uuid(),paidAt:z.string().regex(/^\\d{4}-\\d{2}-\\d{2}$/),
    reference:z.string().trim().min(3).max(200),confirmed:z.literal(true),
    eligibleRefundAmount:z.string().regex(/^\\d{1,7}([.,]\\d{1,2})?$/).optional()
  }).parse(raw);
  const date = new Date(`${data.paidAt}T12:00:00Z`);
  if(!Number.isFinite(date.getTime())||date.toISOString().slice(0,10)!==data.paidAt||data.paidAt>berlinDate(new Date()))throw new Error("Проверьте дату перевода");
  const parseEuro=(value:string)=>{const [a,b=""]=value.replace(",",".").split(".");return Number(a)*100+Number(b.padEnd(2,"0"));};
  await prisma.$transaction(async tx=>{
    // Serialize all refunds of the same order, including different Stornorechnungen.
    const candidates=await tx.$queryRaw<{orderId:number}[]>`SELECT i."orderId" FROM "InvoiceCorrection" c JOIN "Invoice" i ON i.id=c."invoiceId" WHERE c.id=${data.correctionId}`;
    if(!candidates.length)throw new Error("Документ не найден");
    const orderId=candidates[0].orderId;
    await tx.$queryRaw`SELECT id FROM "Order" WHERE id=${orderId} FOR UPDATE`;
    const rows=await tx.$queryRaw<{id:string;orderDate:Date;grossCents:number;mode:string}[]>`
      SELECT c.id,o."createdAt" AS "orderDate",c."grossCents",c.snapshot->>'mode' AS mode
      FROM "InvoiceCorrection" c JOIN "Invoice" i ON i.id=c."invoiceId"
      JOIN "Order" o ON o.id=i."orderId"
      WHERE c.id=${data.correctionId} FOR UPDATE OF c`;
    if(!rows.length||data.paidAt<berlinDate(rows[0].orderDate))throw new Error("Документ или дата перевода некорректны");
    const old=await tx.$queryRaw<{paidAt:string;reference:string}[]>`SELECT "paidAt",reference FROM "InvoiceRefund" WHERE "correctionId"=${data.correctionId}`;
    if(old.length){
      if(old[0].paidAt!==data.paidAt||old[0].reference!==data.reference)throw new Error("Возврат уже отмечен с другими данными");
      return;
    }
    const order=await tx.order.findUnique({where:{id:orderId},select:{userId:true,pricingSnapshot:true,createdAt:true}});
    const pricing=readPricing(order?.pricingSnapshot);
    let eligibleRefundCents=0;
    let netDelta=0;
    if(order?.userId!==null&&order?.userId!==undefined&&pricing&&order.createdAt>=new Date("2026-11-21T00:00:00Z")){
      const originalEligible=Math.max(0,pricing.lines.filter(l=>!l.couponExcluded).reduce((sum,l)=>sum+l.grossCents,0)-pricing.discountGrossCents);
      const prior=await tx.$queryRaw<{value:bigint}[]>`SELECT COALESCE(SUM("eligibleCents"),0) AS value FROM "LoyaltyRefund" WHERE "orderId"=${orderId}`;
      const previousEligible=Number(prior[0]?.value??0);
      const remaining=Math.max(0,originalEligible-previousEligible);
      if(rows[0].mode==="full"){
        eligibleRefundCents=remaining;
      }else{
        if(data.eligibleRefundAmount===undefined)throw new Error("Укажите сумму возврата подходящих товаров для расчёта бонусов");
        eligibleRefundCents=parseEuro(data.eligibleRefundAmount);
      }
      if(eligibleRefundCents>rows[0].grossCents+(pricing.loyaltyDiscountCents??0)||eligibleRefundCents>remaining)throw new Error("Бонусная часть возврата превышает допустимую сумму");
      const entries=await tx.loyaltyEntry.findMany({where:{orderId},select:{kind:true,points:true}});
      const originalEarn=entries.filter(e=>e.kind==="EARN").reduce((n,e)=>n+e.points,0);
      const originalSpend=-entries.filter(e=>e.kind==="SPEND").reduce((n,e)=>n+e.points,0);
      const reversed=-entries.filter(e=>e.kind==="REFUND_EARN_REVERSE").reduce((n,e)=>n+e.points,0);
      const restored=entries.filter(e=>e.kind==="REFUND_SPEND_RESTORE").reduce((n,e)=>n+e.points,0);
      const cumulative=previousEligible+eligibleRefundCents;
      const reverseTarget=earnedPointsAfterRefund({originalEarnedPoints:originalEarn,originalEligibleCents:originalEligible,cumulativeEligibleRefundCents:cumulative}).reversalPoints;
      const restoreTarget=refundableSpentPoints({originalSpentPoints:originalSpend,originalEligibleChargedCents:originalEligible,cumulativeEligibleRefundCents:cumulative});
      const reverseDelta=reverseTarget-reversed, restoreDelta=restoreTarget-restored;
      if(reverseDelta<0||restoreDelta<0)throw new Error("История бонусов требует проверки");
      if(reverseDelta)await tx.loyaltyEntry.create({data:{userId:order.userId,orderId,kind:"REFUND_EARN_REVERSE",points:-reverseDelta,idempotencyKey:`refund:${data.correctionId}:earn`,note:"Refunded eligible merchandise"}});
      if(restoreDelta)await tx.loyaltyEntry.create({data:{userId:order.userId,orderId,kind:"REFUND_SPEND_RESTORE",points:restoreDelta,idempotencyKey:`refund:${data.correctionId}:spend`,note:"Restore redeemed points after cash refund"}});
      netDelta=restoreDelta-reverseDelta;
      if(netDelta)await tx.loyaltyWallet.upsert({where:{userId:order.userId},create:{userId:order.userId,balancePoints:netDelta},update:{balancePoints:{increment:netDelta}}});
      await tx.$executeRaw`INSERT INTO "LoyaltyRefund" ("correctionId","orderId","eligibleCents") VALUES (${data.correctionId},${orderId},${eligibleRefundCents})`;
    }
    await tx.$executeRaw`INSERT INTO "InvoiceRefund" ("correctionId","paidAt",reference,"actorId") VALUES (${data.correctionId},${data.paidAt},${data.reference},${actor})`;
  },{timeout:20000});
  return {ok:true};
}
