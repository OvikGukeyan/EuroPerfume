export const ISO2_TO_ISO3: Record<string, string> = {
  // Европейский союз
  AT: "AUT", // Austria
  BE: "BEL", // Belgium
  BG: "BGR", // Bulgaria
  HR: "HRV", // Croatia
  CY: "CYP", // Cyprus
  CZ: "CZE", // Czech Republic
  DK: "DNK", // Denmark
  EE: "EST", // Estonia
  FI: "FIN", // Finland
  FR: "FRA", // France
  DE: "DEU", // Germany
  GR: "GRC", // Greece
  HU: "HUN", // Hungary
  IE: "IRL", // Ireland
  IT: "ITA", // Italy
  LV: "LVA", // Latvia
  LT: "LTU", // Lithuania
  LU: "LUX", // Luxembourg
  MT: "MLT", // Malta
  NL: "NLD", // Netherlands
  PL: "POL", // Poland
  PT: "PRT", // Portugal
  RO: "ROU", // Romania
  SK: "SVK", // Slovakia
  SI: "SVN", // Slovenia
  ES: "ESP", // Spain
  SE: "SWE", // Sweden

  // Другие европейские страны
  AL: "ALB", // Albania
  AD: "AND", // Andorra
  AM: "ARM", // Armenia
  AZ: "AZE", // Azerbaijan
  BY: "BLR", // Belarus
  BA: "BIH", // Bosnia and Herzegovina
  FO: "FRO", // Faroe Islands (Дания)
  GE: "GEO", // Georgia
  GI: "GIB", // Gibraltar (UK territory)
  IS: "ISL", // Iceland
  XK: "XKX", // Kosovo (спец. код, DHL иногда принимает)
  LI: "LIE", // Liechtenstein
  MC: "MCO", // Monaco
  MD: "MDA", // Moldova
  ME: "MNE", // Montenegro
  MK: "MKD", // North Macedonia
  NO: "NOR", // Norway
  RU: "RUS", // Russia
  SM: "SMR", // San Marino
  RS: "SRB", // Serbia
  CH: "CHE", // Switzerland
  TR: "TUR", // Turkey (частично европ.)
  UA: "UKR", // Ukraine
  GB: "GBR", // United Kingdom
  VA: "VAT"  // Vatican City
};
export function iso2to3(iso2?: string) {
  if (!iso2) return "";
  return ISO2_TO_ISO3[iso2.toUpperCase()] ?? iso2.toUpperCase();
}