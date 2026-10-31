import 'server-only';
import { createHash } from 'crypto';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '@/prisma/prisma-client';
import { getUserSession } from './get-user-session';
import { correctionInput, CorrectionInput, CorrectionSnapshot, Baseline, correctionAmounts } from '../lib/invoice-correction';
import { business, businessAddress } from '../constants/business';
import { berlinDate } from '../lib/tax';
import { correctionPdf } from './correction-pdf';

type DB = Prisma.TransactionClient;
export type CorrectionRow = { id: string; number: string; invoiceId: number; grossCents: number; vatCents: number; issuedAt: Date; snapshot: CorrectionSnapshot; requestHash: string };
export async function requireInvoiceAdmin() {
  const session = await getUserSession();
  const user = session && await prisma.user.findUnique({ where: { id: Number(session.id) }, select: { id: true, role: true } });
  if (!user || user.role !== 'ADMIN') throw new Error('Доступ только для администратора');
  return user.id;
}
const hash = (value: unknown) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const taxSchema = z.object({ mode: z.enum(['exempt', 'vat']), rateBasisPoints: z.number().int().min(0).max(3000), grossCents: z.number().int().positive(), vatCents: z.number().int().nonnegative(), netCents: z.number().int().nonnegative() });

export async function getCorrectionContext(orderId: number, db: DB = prisma) {
  const invoice = await db.invoice.findUnique({ where: { orderId }, include: { order: true } });
  if (!invoice || !invoice.pdfUrl) throw new Error('Сначала должен существовать исходный Rechnung');
  const corrections = await db.$queryRaw<CorrectionRow[]>`SELECT id, number, "invoiceId", "grossCents", "vatCents", "issuedAt", snapshot, "requestHash" FROM "InvoiceCorrection" WHERE "invoiceId" = ${invoice.id} ORDER BY "issuedAt", number`;
  const refunds = await db.$queryRaw<{ correctionId: string; paidAt: string; reference: string }[]>`SELECT r."correctionId", r."paidAt", r.reference FROM "InvoiceRefund" r JOIN "InvoiceCorrection" c ON c.id = r."correctionId" WHERE c."invoiceId" = ${invoice.id}`;
  return { invoice, corrections, refunds };
}

export async function prepareCorrection(raw: CorrectionInput, db: DB = prisma) {
  const input = correctionInput.parse(raw);
  const ctx = await getCorrectionContext(input.orderId, db);
  let base: Baseline;
  if (ctx.corrections.length) {
    base = ctx.corrections[0].snapshot.baseline;
    if (input.customer !== base.customer || input.originalAmount !== base.grossCents) throw new Error('Используйте сохранённые реквизиты исходного счёта');
  } else {
    const parsedTax = taxSchema.safeParse(ctx.invoice.taxSnapshot);
    if (parsedTax.success) {
      const t = parsedTax.data;
      if (t.grossCents !== input.originalAmount || t.netCents + t.vatCents !== t.grossCents || (t.mode === 'exempt' && t.vatCents !== 0)) throw new Error('Сумма не совпадает с сохранённым исходным счётом');
      base = { customer: input.customer, grossCents: t.grossCents, vatCents: t.vatCents, mode: t.mode, rateBasisPoints: t.rateBasisPoints };
    } else {
      // Legacy invoices have no trustworthy tax snapshot. Only confirmed §19 originals
      // from before the VAT transition are supported; never infer VAT from today's date.
      if (ctx.invoice.taxSnapshot !== null || berlinDate(ctx.invoice.issuedAt) >= '2027-01-01' || !input.legacyExemptConfirmed) throw new Error('Налоговые данные исходного PDF требуют отдельной проверки');
      base = { customer: input.customer, grossCents: input.originalAmount, vatCents: 0, mode: 'exempt', rateBasisPoints: 0 };
    }
  }
  const previousGross = ctx.corrections.reduce((n, c) => n + c.grossCents, 0);
  const previousVat = ctx.corrections.reduce((n, c) => n + c.vatCents, 0);
  const lines = input.mode === 'full'
    ? [{ description: ctx.corrections.length ? 'Stornierung des verbleibenden Rechnungsbetrags' : 'Vollständige Stornierung der oben genannten Rechnung einschließlich berechneter Versandkosten und Rabatte', grossCents: base.grossCents - previousGross }]
    : input.lines.map(l => ({ description: l.description, grossCents: l.amount }));
  if (!lines.length || lines.some(l => l.grossCents <= 0)) throw new Error('Укажите позиции и положительные суммы возврата');
  const amount = correctionAmounts(base, previousGross, previousVat, lines.reduce((n, l) => n + l.grossCents, 0));
  const snapshot: CorrectionSnapshot = {
    version: 1, number: '', issuedAt: new Date().toISOString(), originalNumber: ctx.invoice.invoiceNumber,
    originalDate: ctx.invoice.issuedAt.toISOString(), orderId: input.orderId, baseline: base,
    mode: input.mode, reason: input.reason, seller: businessAddress, sellerVatId: business.vatId,
    previousNumbers: ctx.corrections.map(c => c.number), lines, ...amount,
  };
  const previewHash = hash({ ...snapshot, issuedAt: '', number: '', sourceInvoiceId: ctx.invoice.id });
  return { snapshot, previewHash, invoiceId: ctx.invoice.id, requestHash: hash(input), input };
}

export async function issueCorrection(raw: CorrectionInput, previewHash: string, actorId: number) {
  const input = correctionInput.parse(raw);
  return prisma.$transaction(async tx => {
    await tx.$queryRaw`SELECT id FROM "Invoice" WHERE "orderId" = ${input.orderId} FOR UPDATE`;
    const existing = await tx.$queryRaw<CorrectionRow[]>`SELECT id, number, "requestHash" FROM "InvoiceCorrection" WHERE id = ${input.requestId}`;
    if (existing.length) {
      if (existing[0].requestHash !== hash(input)) throw new Error('Этот запрос уже использован. Обновите форму.');
      return { id: existing[0].id, number: existing[0].number };
    }
    const prepared = await prepareCorrection(raw, tx);
    if (prepared.previewHash !== previewHash) throw new Error('Данные изменились. Откройте новый предпросмотр.');
    const year = Number(berlinDate(new Date()).slice(0, 4));
    const counters = await tx.$queryRaw<{ value: number }[]>`INSERT INTO "InvoiceCorrectionCounter" (year, value) VALUES (${year}, 1) ON CONFLICT (year) DO UPDATE SET value = "InvoiceCorrectionCounter".value + 1 RETURNING value`;
    const number = `EP-ST-${year}-${String(counters[0].value).padStart(6, '0')}`;
    const s = { ...prepared.snapshot, number, issuedAt: new Date().toISOString() };
    const pdf = await correctionPdf(s);
    await tx.$executeRaw`INSERT INTO "InvoiceCorrection" (id, number, "invoiceId", "grossCents", "vatCents", "issuedAt", snapshot, pdf, "requestHash", "actorId") VALUES (${input.requestId}, ${number}, ${prepared.invoiceId}, ${s.grossCents}, ${s.vatCents}, ${new Date(s.issuedAt)}, ${JSON.stringify(s)}::jsonb, ${pdf}, ${prepared.requestHash}, ${actorId})`;
    return { id: input.requestId, number };
  }, { timeout: 20000 });
}
