import {
  ApplicationMethod,
  Aromas,
  Brands,
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
    image: formData.get("image") as File,
    variations: formData.getAll("variations") as File[],
    descriptionRu: getString("descriptionRu"),
    descriptionDe: getString("descriptionDe"),
    price: getNumber("price")!,
    gender: getString("gender") as Gender,
    concentration: getString("concentration") as PerfumeConcentration,
    brand: getString("brand") as Brands,
    topNotes: getJsonArray("topNotes") as Notes[],
    heartNotes: getJsonArray("heartNotes") as Notes[],
    baseNotes: getJsonArray("baseNotes") as Notes[],
    aromas: getJsonArray("aromas") as Aromas[],
    brandCountry: getString("brandCountry"),
    manufacturingCountry: getString("manufacturingCountry"),
    perfumer: getString("perfumer"),
    classification: getJsonArray("classification") as Classifications[],
    releaseYear: getNumber("releaseYear")!,
    categoryId: getNumber("categoryId")!,
    productGroupId: getNumber("productGroupId")!,
    age: getNumber("age"),
    series: getString("series"),
    purpose: getString("purpose") as Purpose,
    colorPalette: getString("colorPalette"),
    finish: getString("finish") as Finish,
    texture: getString("texture") as Texture,
    formula: getString("formula") as Formula,
    compositionFeatures: getString("compositionFeatures"),
    activeIngredients: getString("activeIngredients"),
    effect: getString("effect") as Effects,
    effectDuration: getNumber("effectDuration"),
    hypoallergenic: getString("hypoallergenic") === "true",
    certificates: getString("certificates"),
    ethics: getString("ethics"),
    applicationMethod: getString("applicationMethod") as ApplicationMethod,
    packagingFormat: getString("packagingFormat") as PackagingFormat,
    volume: getString("volume"),
    skinType: getString("skinType") as SkinType,
  };
}
