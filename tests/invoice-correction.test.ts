import test from 'node:test';
import assert from 'node:assert/strict';
import { correctionAmounts, euroAmount, correctionInput } from '../src/shared/lib/invoice-correction';

const exempt = { customer: 'Test', grossCents: 10000, vatCents: 0, rateBasisPoints: 0, mode: 'exempt' as const };
test('legacy exempt invoice stays exempt, including when refunded after VAT transition', () => {
  assert.deepEqual(correctionAmounts(exempt, 0, 0, 10000), { grossCents: 10000, netCents: 10000, vatCents: 0 });
});
test('partial refunds and final remainder exactly reverse original gross and VAT', () => {
  const base = { ...exempt, mode: 'vat' as const, grossCents: 11901, vatCents: 1900, rateBasisPoints: 1900 };
  let gross = 0, vat = 0;
  for (const amount of [1, 3000, 2444, 6456]) {
    const c = correctionAmounts(base, gross, vat, amount); gross += c.grossCents; vat += c.vatCents;
  }
  assert.equal(gross, 11901); assert.equal(vat, 1900);
});
test('zero, negative, fractional and excessive corrections are rejected', () => {
  for (const amount of [0, -1, 0.5, 10001, Infinity]) assert.throws(() => correctionAmounts(exempt, 0, 0, amount));
  assert.throws(() => correctionAmounts(exempt, 9999, 0, 2));
});
test('money input parses decimal comma without floating point multiplication', () => {
  assert.equal(euroAmount.parse('104,75'), 10475); assert.equal(euroAmount.parse('1.01'), 101);
  for (const v of ['-1', '1e3', '1.001', 'NaN', '']) assert.equal(euroAmount.safeParse(v).success, false);
});
test('source verification and request key required even for full cancellation', () => {
  const input = { orderId: 1, requestId: '11111111-1111-4111-8111-111111111111', mode: 'full', reason: 'Retoure', customer: 'Testkunde', originalAmount: '100', legacyExemptConfirmed: true, originalChecked: true, lines: [] };
  assert.equal(correctionInput.safeParse(input).success, true);
  assert.equal(correctionInput.safeParse({ ...input, originalChecked: false }).success, false);
  assert.equal(correctionInput.safeParse({ ...input, requestId: '' }).success, false);
});
