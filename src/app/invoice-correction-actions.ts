'use server';
import { z } from 'zod';
import { prisma } from '@/prisma/prisma-client';
import { CorrectionInput } from '@/src/shared/lib/invoice-correction';
import { requireInvoiceAdmin, getCorrectionContext, prepareCorrection, issueCorrection } from '@/src/shared/server-lib/invoice-corrections';
import { correctionPdf } from '@/src/shared/server-lib/correction-pdf';
import { berlinDate } from '@/src/shared/lib/tax';

export async function loadInvoiceCorrections(orderId: number) {
  await requireInvoiceAdmin(); z.number().int().positive().parse(orderId);
  const { invoice, corrections, refunds } = await getCorrectionContext(orderId);
  const saved = corrections[0]?.snapshot.baseline;
  const tax = invoice.taxSnapshot as { grossCents?: number } | null;
  return {
    originalNumber: invoice.invoiceNumber, originalUrl: invoice.pdfUrl!,
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
export async function recordInvoiceRefund(raw: { correctionId: string; paidAt: string; reference: string; confirmed: boolean }) {
  const actor = await requireInvoiceAdmin();
  const data = z.object({ correctionId: z.string().uuid(), paidAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), reference: z.string().trim().min(3).max(200), confirmed: z.literal(true) }).parse(raw);
  const date = new Date(`${data.paidAt}T12:00:00Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== data.paidAt || data.paidAt > berlinDate(new Date())) throw new Error('Проверьте дату перевода');
  // This is only a manual record of a completed bank transfer, never a payment API call.
  await prisma.$transaction(async tx => {
    const rows = await tx.$queryRaw<{ id: string; orderDate: Date }[]>`SELECT c.id, o."createdAt" AS "orderDate" FROM "InvoiceCorrection" c JOIN "Invoice" i ON i.id = c."invoiceId" JOIN "Order" o ON o.id = i."orderId" WHERE c.id = ${data.correctionId} FOR UPDATE OF c`;
    if (!rows.length || data.paidAt < berlinDate(rows[0].orderDate)) throw new Error('Документ или дата перевода некорректны');
    const old = await tx.$queryRaw<{ paidAt: string; reference: string }[]>`SELECT "paidAt", reference FROM "InvoiceRefund" WHERE "correctionId" = ${data.correctionId}`;
    if (old.length) {
      if (old[0].paidAt !== data.paidAt || old[0].reference !== data.reference) throw new Error('Возврат уже отмечен с другими данными');
      return;
    }
    await tx.$executeRaw`INSERT INTO "InvoiceRefund" ("correctionId", "paidAt", reference, "actorId") VALUES (${data.correctionId}, ${data.paidAt}, ${data.reference}, ${actor})`;
  });
  return { ok: true };
}
