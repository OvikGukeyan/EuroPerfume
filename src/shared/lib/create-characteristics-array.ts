import {
  applicationMethods,
  classifications,
  concentrations,
  effects,
  finishes,
  formulas,
  packagingFormats,
  perfumeAromas,
  purposes,
  skinTypes,
  textures,
} from "prisma/constants";
import { NoteType } from "@prisma/client";
import { ProductDTO } from "../services/dto/product.dto";

type ReturnProps = {
  name: string;
  value: string;
}[];

export const createCharacteristicsArray = (product: ProductDTO): ReturnProps => {
  const {
    brand,
    classification,
    concentration,
    gender,
    releaseYear,
    perfumer,
    brandCountry,
    manufacturingCountry,
    productNotes,
    aromas,
    age,
    series,
    purpose,
    colorPalette,
    finish,
    texture,
    formula,
    compositionFeatures,
    activeIngredients,
    effect,
    effectDuration,
    hypoallergenic,
    certificates,
    ethics,
    applicationMethod,
    packagingFormat,
    volume,
    skinType,
  } = product ;
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
  const currentAroma = perfumeAromas
    .filter((aroma) => aromas.includes(aroma.value))
    .map(({ label: { ru } }) => ru)
    .join(", ");
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
    { name: "Brand", value: brand.name },
    { name: "Aroma", value: currentAroma },
    { name: "Classification", value: currentClassification },
    { name: "Concentration", value: currentConcentration || "" },
    { name: "Base Note", value: currentBaseNotes },
    { name: "Top Note", value: currentTopNotes },
    { name: "Heart Note", value: currentHeartNotes },
    { name: "Gender", value: gender },
    { name: "Release year", value: releaseYear.toString() },
    { name: "Perfumer", value: perfumer || "" },
    { name: "Brand Country", value: brandCountry },
    { name: "Manufacturing Country", value: manufacturingCountry },
    { name: "Age", value: age?.toString() || "" },
    { name: "Series", value: series || "" },
    { name: "Purpose", value: currentPurpose || "" },
    { name: "Color Palette", value: colorPalette || "" },
    { name: "Finish", value: currentFinish || "" },
    { name: "Texture", value: currentTexture || "" },
    { name: "Formula", value: currentFormula || "" },
    { name: "Composition Features", value: compositionFeatures || "" },
    { name: "Active Ingredients", value: activeIngredients || "" },
    { name: "Effect", value: currentEffect || "" },
    { name: "Effect Duration", value: effectDuration?.toString() || "" },
    { name: "Hypoallergenic", value: isHypoallergenic },
    { name: "Certificates", value: certificates || "" },
    { name: "Ethics", value: ethics || "" },
    { name: "Application Method", value: currentApplicationMethod || "" },
    { name: "Packaging Format", value: currentPackagingFormat || "" },
    { name: "Volume", value: volume?.toString() || "" },
    { name: "Skin Type", value: currentSkinType || "" },
  ];

  return characteristics.filter(
    (item) => item.value && item.value.toString().trim() !== ""
  );
};
