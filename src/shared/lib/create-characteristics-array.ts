import {
  concentrations,
  genders,
} from "@/../../prisma/constants";
import { NoteType } from "@prisma/client";
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
  const labelLocale = locale === "ru" ? "labelRu" : "labelDe";
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
    .map((note) => note.note[labelLocale])
    .join(", ");
  const currentHeartNotes = productNotes
    .filter((note) => note.noteType === NoteType.HEART)
    .map((note) => note.note[labelLocale])
    .join(", ");
  const currentBaseNotes = productNotes
    .filter((note) => note.noteType === NoteType.BASE)
    .map((note) => note.note[labelLocale])
    .join(", ");
  const currentAroma = aromas.map((item) => item[labelLocale]).join(", ");
  const currentClassification = classification.map((item) => item[labelLocale]).join(", ");
  const currentConcentration = concentrations.find(
    (item) => item.value === concentration
  )?.name;

  const currentPurpose = purpose.map((item) => item[labelLocale]).join(", ");
  const currentFinish = finish.map((item) => item[labelLocale]).join(", ");
  const currentTexture = texture.map((item) => item[labelLocale]).join(", ");
  const currentFormula = formula.map((item) => item[labelLocale]).join(", ");
  const currentEffect = effect.map((item) => item[labelLocale]).join(", ");
  const isHypoallergenic = hypoallergenic ? (locale === "ru" ? "Да" : "Ja") : (locale === "ru" ? "Нет" : "Nein");
  const currentApplicationMethod = applicationMethod.map((item) => item[labelLocale]).join(", ");
  const currentPackagingFormat = packagingFormat.map((item) => item[labelLocale]).join(", ");
  const currentSkinType = skinType.map((item) => item[labelLocale]).join(", ");
  const currentGender = genders.find((item) => item.value === gender)?.label[locale];

  const characteristics = [
    { name: (locale === "ru" ? "Бренд" : "Marke"), value: brand.name },
    { name: (locale === "ru" ? "Аромат" : "Aroma"), value: currentAroma },
    { name: (locale === "ru" ? "Классификация" : "Klassifikation"), value: currentClassification },
    { name: (locale === "ru" ? "Концентрация" : "Konzentration"), value: currentConcentration || undefined },
    { name: (locale === "ru" ? "Базовая нота" : "Basisnote"), value: currentBaseNotes },
    { name: (locale === "ru" ? "Верхняя нота" : "Topnote"), value: currentTopNotes },
    { name: (locale === "ru" ? "Средняя нота" : "Herznote"), value: currentHeartNotes },
    { name: (locale === "ru" ? "Пол" : "Geschlecht"), value: currentGender || undefined },
    { name: (locale === "ru" ? "Год выпуска" : "Jahr"), value: releaseYear?.toString() || undefined },
    { name: (locale === "ru" ? "Парфюмер" : "Parfumer"), value: perfumer || undefined },
    { name: (locale === "ru" ? "Страна бренда" : "Land der Marke"), value: translation?.brandCountry },
    { name: (locale === "ru" ? "Страна производства" : "Land der Herstellung"), value: translation?.manufacturingCountry },
    { name: (locale === "ru" ? "Возраст" : "Alter"), value: age?.toString() || undefined },
    { name: (locale === "ru" ? "Серия" : "Serie"), value: series || undefined },
    { name: (locale === "ru" ? "Цель" : "Zweck"), value: currentPurpose || undefined },
    { name: (locale === "ru" ? "Цветовая палитра" : "Farbpalette"), value: translation?.colorPalette || undefined },
    { name: (locale === "ru" ? "Финиш" : "Finish"), value: currentFinish || undefined },
    { name: (locale === "ru" ? "Текстура" : "Textur"), value: currentTexture || undefined },
    { name: (locale === "ru" ? "Формула" : "Formel"), value: currentFormula || undefined },
    {
      name: (locale === "ru" ? "Состав" : "Zusammenstellung"),
      value: translation?.compositionFeatures || undefined,
    },
    {
      name: (locale === "ru" ? "Активные ингредиенты" : "Aktive Zutaten"),
      value: translation?.activeIngredients || undefined,
    },
    { name: (locale === "ru" ? "Эффект" : "Effekt"), value: currentEffect || undefined },
    { name: (locale === "ru" ? "Продолжительность эффекта" : "Dauer des Effekts"), value: effectDuration?.toString() || undefined },
    { name: (locale === "ru" ? "Гипоаллергенность" : "Hypoallergeneit"), value: isHypoallergenic },
    { name: (locale === "ru" ? "Сертификаты" : "Zertifikate"), value: translation?.certificates || undefined },
    { name: (locale === "ru" ? "Этика" : "Ethik"), value: translation?.ethics || undefined },
    {
      name: (locale === "ru" ? "Метод применения" : "Anwendungsmethode"),
      value: currentApplicationMethod || undefined,
    },
    { name: (locale === "ru" ? "Упаковка" : "Packung"), value: currentPackagingFormat || undefined },
    { name: (locale === "ru" ? "Объем" : "Volumen"), value: volume?.toString() || undefined },
    { name: (locale === "ru" ? "Тип кожи" : "Köhltyp"), value: currentSkinType || undefined },
    { name: (locale === "ru" ? "Материал" : "Material"), value: translation?.material || undefined },
  ];

  return characteristics.filter(
    (item) => item.value && item.value.toString().trim() !== ""
  ) as ReturnProps;
};
