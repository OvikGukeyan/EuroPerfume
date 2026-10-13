export const TAX_SETTINGS = {
  // 00:00 on 1 January in Germany; not midnight UTC.
  VAT_START_AT: "2027-01-01T00:00:00+01:00",
  GERMAN_RATE_BASIS_POINTS: 1900,
  // Confirm origin taxation / OSS before enabling automatic EU invoicing.
  EU_VAT_MODE: "review" as "review" | "origin",
};
