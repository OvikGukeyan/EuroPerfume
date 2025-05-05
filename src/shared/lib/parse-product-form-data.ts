import {
  ApplicationMethod,
  Aromas,
  Classifications,
  Effects,
  Finish,
  Formula,
  Gender,
  Notes,
  PackagingFormat,
  PerfumeConcentration,
  Purpose,
  SkinType,
  Texture,
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
    brand: getString("brand") ,
    topNotes: getJsonArray("topNotes") as Notes[],
    heartNotes: getJsonArray("heartNotes") as Notes[],
    baseNotes: getJsonArray("baseNotes") as Notes[],
    aromas: getJsonArray("aromas") as Aromas[],
    perfumer: getString("perfumer"),
    classification: getJsonArray("classification") as Classifications[],
    releaseYear: getNumber("releaseYear")!,
    categoryId: getNumber("categoryId")!,
    productGroupId: getNumber("productGroupId")!,
    age: getNumber("age"),
    series: getString("series"),
    purpose: getString("purpose") as Purpose,
    finish: getString("finish") as Finish,
    texture: getString("texture") as Texture,
    formula: getString("formula") as Formula,
    effect: getString("effect") as Effects,
    effectDuration: getNumber("effectDuration"),
    hypoallergenic: getString("hypoallergenic") === "true",
    applicationMethod: getString("applicationMethod") as ApplicationMethod,
    packagingFormat: getString("packagingFormat") as PackagingFormat,
    volume: getString("volume"),
    skinType: getString("skinType") as SkinType,
  };
}
