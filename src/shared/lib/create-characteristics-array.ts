import {
  applicationMethods,
  classifications,
  concentrations,
  effects,
  finishes,
  formulas,
  packagingFormats,
  purposes,
  skinTypes,
  textures,
} from "@/../../prisma/constants";
import { NoteType } from "@prisma/client";
import { useLocale } from "next-intl";
import { ProductWithTranslations } from "../components/shared/choose-product-form";

type ReturnProps = {
  name: string;
  value: string;
}[];

export const createCharacteristicsArray = (
  product: ProductWithTranslations,
  locale: "ru" | "de"
): ReturnProps => {
  const translation = product.translations.find(
    (translation) =>
      translation.language.toLocaleLowerCase() === locale.toLocaleLowerCase()
  );
  const {
    brand,
    classification,
    concentration,
    gender,
    releaseYear,
    perfumer,
    productNotes,
    aromas,
    age,
    series,
    purpose,
    finish,
    texture,
    formula,
    effect,
    effectDuration,
    hypoallergenic,
    applicationMethod,
    packagingFormat,
    volume,
    skinType,
  } = product;
  const currentTopNotes = productNotes
    .filter((note) => note.noteType === NoteType.TOP)
    .map((note) => note.note?.labelRu)
    .join(", ");
  const currentHeartNotes = productNotes
    .filter((note) => note.noteType === NoteType.HEART)
    .map((note) => note.note?.labelRu)
    .join(", ");
  const currentBaseNotes = productNotes
    .filter((note) => note.noteType === NoteType.BASE)
    .map((note) => note.note?.labelRu)
    .join(", ");
  const currentAroma = aromas.map((item) => item.labelRu).join(", ");
  const currentClassification = classifications
    .filter((item) => classification.includes(item.value))
    .map(({ label: { ru } }) => ru)
    .join(", ");
  const currentConcentration = concentrations.find(
    (item) => item.value === concentration
  )?.name;

  const currentPurpose = purposes.find((item) => item.value === purpose)?.label
    .ru;
  const currentFinish = finishes.find((item) => item.value === finish)?.label
    .ru;
  const currentTexture = textures.find((item) => item.value === texture)?.label
    .ru;
  const currentFormula = formulas.find((item) => item.value === formula)?.label
    .ru;
  const currentEffect = effects.find((item) => item.value === effect)?.label.ru;
  const isHypoallergenic = hypoallergenic ? "Да" : "Нет";
  const currentApplicationMethod = applicationMethods.find(
    (item) => item.value === applicationMethod
  )?.label.ru;
  const currentPackagingFormat = packagingFormats.find(
    (item) => item.value === packagingFormat
  )?.label.ru;
  const currentSkinType = skinTypes.find((item) => item.value === skinType)
    ?.label.ru;

  const characteristics = [
    {name: "Description", value: translation?.description || ""},
    { name: "Brand", value: brand.name },
    { name: "Aroma", value: currentAroma },
    { name: "Classification", value: currentClassification },
    { name: "Concentration", value: currentConcentration || undefined },
    { name: "Base Note", value: currentBaseNotes },
    { name: "Top Note", value: currentTopNotes },
    { name: "Heart Note", value: currentHeartNotes },
    { name: "Gender", value: gender || undefined },
    { name: "Release year", value: releaseYear?.toString() || undefined },
    { name: "Perfumer", value: perfumer || undefined },
    { name: "Brand Country", value: translation?.brandCountry },
    { name: "Manufacturing Country", value: translation?.manufacturingCountry },
    { name: "Age", value: age?.toString() || undefined },
    { name: "Series", value: series || undefined },
    { name: "Purpose", value: currentPurpose || undefined },
    { name: "Color Palette", value: translation?.colorPalette || undefined },
    { name: "Finish", value: currentFinish || undefined },
    { name: "Texture", value: currentTexture || undefined },
    { name: "Formula", value: currentFormula || undefined },
    {
      name: "Composition Features",
      value: translation?.compositionFeatures || undefined,
    },
    {
      name: "Active Ingredients",
      value: translation?.activeIngredients || undefined,
    },
    { name: "Effect", value: currentEffect || undefined },
    { name: "Effect Duration", value: effectDuration?.toString() || undefined },
    { name: "Hypoallergenic", value: isHypoallergenic },
    { name: "Certificates", value: translation?.certificates || undefined },
    { name: "Ethics", value: translation?.ethics || undefined },
    {
      name: "Application Method",
      value: currentApplicationMethod || undefined,
    },
    { name: "Packaging Format", value: currentPackagingFormat || undefined },
    { name: "Volume", value: volume?.toString() || undefined },
    { name: "Skin Type", value: currentSkinType || undefined },
    { name: "Material", value: translation?.material || undefined },
  ];

  return characteristics.filter(
    (item) => item.value && item.value.toString().trim() !== ""
  ) as ReturnProps;
};
