/** Manufacturer references checked 2026-11-16. INCI names are not translated.
 * These describe the published formula, not a verification of a particular stock batch.
 * A saved packaging transcription takes precedence over this fallback.
 */
const references: Record<number, {url:string; brand:string; inci:string}> = {
 369: {brand:"Amouage",url:"https://amouage.com/en-eu/products/100ml-guidance",inci:"Alcohol Denat, Parfum, Aqua, Limonene, Linalool, Benzyl Alcohol, Benzyl Benzoate, Geraniol, Citronellol, Eugenol"},
 182: {brand:"MARC-ANTOINE BARROIS",url:"https://marcantoinebarrois.com/en/products/tilia",inci:"ALCOHOL DENAT., PARFUM (FRAGRANCE), AQUA (WATER), TETRAMETHYL ACETYLOCTAHYDRONAPHTHALENES, ROSE KETONES, BENZYL ALCOHOL, LINALOOL, ISOEUGENYL ACETATE, BENZYL BENZOATE, ISOEUGENOL, FARNESOL"},
 93: {brand:"MARC-ANTOINE BARROIS",url:"https://marcantoinebarrois.com/en/products/ganymede",inci:"ALCOHOL DENAT., PARFUM (FRAGRANCE), AQUA (WATER), TETRAMETHYL ACETYLOCTAHYDRONAPHTHALENES, ALPHA-ISOMETHYL IONONE, LINALYL ACETATE, LIMONENE, PINENE, EUGENOL, TERPINEOL, BETA-CARYOPHYLLENE, ALPHA-TERPINENE, TERPINOLENE, ROSE KETONES, ISOEUGENOL, LINALOOL, HEXADECANOLACTONE, CITRONELLOL, GERANYL ACETATE, CITRAL, GERANIOL, CARVONE"},
};
type Translation = {language:string;activeIngredients?:string|null};
export function needsIngredientReview(text:string) {
 // Flag legacy labels for review. Never remove a substance to invent a new formula.
 return /but[ y]*[l|]phenyl\s*methylpropional|hydroxyisohexyl\s*3[- ]cyclohexene/i.test(text);
}
export function resolveIngredients(productId:number, translations:Translation[], locale:string) {
 const saved=translations.find(t=>t.language.toLowerCase()===locale.toLowerCase() && t.activeIngredients?.trim())?.activeIngredients?.trim()
  || translations.find(t=>t.activeIngredients?.trim())?.activeIngredients?.trim() || "";
 const source=references[productId];
 if(saved) return {inci:saved,review:needsIngredientReview(saved),source:undefined};
 return {inci:source?.inci || "",review:false,source};
}
