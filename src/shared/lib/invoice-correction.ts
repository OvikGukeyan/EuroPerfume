import { z } from 'zod';

export const euroAmount = z.string().trim().regex(/^\d{1,7}([.,]\d{1,2})?$/, 'Сумма: например 24,50')
  .transform(v => { const [a, b = ''] = v.replace(',', '.').split('.'); return Number(a) * 100 + Number(b.padEnd(2, '0')); });
export const correctionInput = z.object({
  orderId: z.number().int().positive(), requestId: z.string().uuid(),
  mode: z.enum(['full', 'partial']), reason: z.string().trim().min(3).max(500),
  customer: z.string().trim().min(5).max(700), originalAmount: euroAmount,
  legacyExemptConfirmed: z.boolean(), originalChecked: z.literal(true),
  lines: z.array(z.object({ description: z.string().trim().min(3).max(300), amount: euroAmount })).max(30),
});
export type CorrectionInput = z.input<typeof correctionInput>;
export type Baseline = { customer: string; grossCents: number; vatCents: number; rateBasisPoints: number; mode: 'vat' | 'exempt' };
export type CorrectionSnapshot = {
  version: 1; number: string; issuedAt: string; originalNumber: string; originalDate: string;
  orderId: number; baseline: Baseline; reason: string; mode: 'full' | 'partial';
  seller: string; sellerVatId: string; previousNumbers: string[];
  lines: { description: string; grossCents: number }[];
  grossCents: number; netCents: number; vatCents: number;
};
// Allocate cumulative VAT so the final correction exactly reverses the original VAT,
// including rounding from earlier partial corrections. Never consult today's rate.
export function correctionAmounts(base: Baseline, previousGross: number, previousVat: number, gross: number) {
  if (![base.grossCents, base.vatCents, previousGross, previousVat, gross].every(Number.isSafeInteger) ||
      base.grossCents <= 0 || base.vatCents < 0 || base.vatCents > base.grossCents ||
      previousGross < 0 || previousVat < 0 || gross <= 0 || previousGross + gross > base.grossCents) {
    throw new Error('Сумма превышает доступный остаток исходного счёта или некорректна');
  }
  const targetVat = Math.round(base.vatCents * ((previousGross + gross) / base.grossCents));
  const vatCents = targetVat - previousVat;
  if (vatCents < 0 || vatCents > gross) throw new Error('Налоговые суммы требуют проверки');
  return { grossCents: gross, vatCents, netCents: gross - vatCents };
}
export const euro = (cents: number) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(cents / 100);
