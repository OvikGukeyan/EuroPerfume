/** Round monetary values at the cent boundary before storing or comparing them. */
export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

const euroNumber = new Intl.NumberFormat("de-DE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Both supported storefront languages use a decimal comma. */
export function formatMoney(value: number): string {
  return euroNumber.format(roundMoney(value));
}

export function sumMoney(values: number[]): number {
  return values.reduce((total, value) => total + Math.round((value + Number.EPSILON) * 100), 0) / 100;
}
