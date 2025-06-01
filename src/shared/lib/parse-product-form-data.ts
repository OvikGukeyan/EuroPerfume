import {
  Gender,
  PerfumeConcentration,
} from "@prisma/client";

export function parseProductFormData(formData: FormData) {
  const getString = (key: string, defaultValue = ""): string =>
    formData.get(key)?.toString() || defaultValue;
  const getNumber = (key: string): number | undefined => {
    const val = formData.get(key);
    return val ? Number(val) : undefined;
  };

  const getJsonArray = <T>(key: string): T[] => 
    formData.get(key) ? JSON.parse(formData.get(key)!.toString()) : [];
  return {
    productName: getString("productName"),
    image: formData.getAll("image") as File[],
    video: getString("video"),
    variations: formData.getAll("variations") as File[],

    descriptionRu: getString("descriptionRu"),
    descriptionDe: getString("descriptionDe"),
    brandCountryRu: getString("brandCountryRu"),
    brandCountryDe: getString("brandCountryDe"),
    manufacturingCountryRu: getString("manufacturingCountryDe"),
    manufacturingCountryDe: getString("manufacturingCountryDe"),
    colorPaletteRu: getString("colorPaletteRu"),
    colorPaletteDe: getString("colorPaletteDe"),
    compositionFeaturesRu: getString("compositionFeaturesRu"),
    compositionFeaturesDe: getString("compositionFeaturesDe"),
    activeIngredientsRu: getString("activeIngredientsRu"),
    activeIngredientsDe: getString("activeIngredientsDe"),
    certificatesRu: getString("certificatesRu"),
    certificatesDe: getString("certificatesDe"),
    ethicsRu: getString("ethicsRu"),
    ethicsDe: getString("ethicsDe"),
    materialRu: getString("materialRu"),
    materialDe: getString("materialDe"),

    price: getNumber("price")!,
    gender: getString("gender") as Gender,
    concentration: getString("concentration") as PerfumeConcentration,
    brand: getString("brand"),
    topNotes: getJsonArray("topNotes") as Number[],
    heartNotes: getJsonArray("heartNotes") as Number[],
    baseNotes: getJsonArray("baseNotes") as Number[],
    aromas: getJsonArray("aromas") as Number[],
    perfumer: getString("perfumer"),
    classification: getJsonArray("classification") as Number[],
    releaseYear: getNumber("releaseYear")!,
    categoryId: getNumber("categoryId")!,
    productGroupId: getNumber("productGroupId")!,
    age: getNumber("age"),
    series: getString("series"),
    purpose: getJsonArray("purpose") as Number[],
    finish: getJsonArray("finish") as Number[],
    texture: getJsonArray("texture") as Number[],
    formula: getJsonArray("formula") as Number[],
    effect: getJsonArray("effect") as Number[],
    effectDuration: getNumber("effectDuration"),
    hypoallergenic: getString("hypoallergenic") === "true",
    applicationMethod: getJsonArray("applicationMethod") as Number[],
    packagingFormat: getJsonArray("packagingFormat") as Number[],
    volume: getString("volume"),
    skinType: getJsonArray("skinType") as Number[],
  };
}
