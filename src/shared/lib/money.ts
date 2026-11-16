/** Round monetary values at the cent boundary before storing or comparing them. */
export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

const euroNumber = new Intl.NumberFormat("en-GB", {
  useGrouping: false,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Use the requested decimal point consistently in both storefront languages. */
export function formatMoney(value: number): string {
  return euroNumber.format(roundMoney(value));
}

export function sumMoney(values: number[]): number {
  return values.reduce((total, value) => total + Math.round((value + Number.EPSILON) * 100), 0) / 100;
}

/** German unit-price notation, matching the storefront reference. */
const unitPriceNumber = new Intl.NumberFormat("de-DE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatUnitPrice(value: number): string {
  return unitPriceNumber.format(roundMoney(value));
}
