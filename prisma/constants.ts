import {
  Gender,
  PerfumeConcentration,
  DeliveryTypes,
  ContactForms,
  OrderStatus,
} from "@prisma/client";

export const categories = [
  {
    labelRu: "Парфюмерия",
    labelDe: "Parfümerie",
    id: 1,
  },
  {
    labelRu: "Косметика",
    labelDe: "Kosmetik",
    id: 2,
  },
  {
    labelRu: "Аксессуары",
    labelDe: "Accessoires",
    id: 3,
  },
];

export const productGroups = [
  {
    labelRu: "Унисекс",
    labelDe: "Unisex",
    id: 1,
    categoryId: 1,
  },
  {
    labelRu: "Женские",
    labelDe: "Damen",
    id: 2,
    categoryId: 1,
  },
  {
    labelRu: "Мужские",
    labelDe: "Herren",
    id: 3,
    categoryId: 1,
  },
  {
    labelRu: "Атомайзеры",
    labelDe: "Parfümzerstäuber",
    id: 4,
    categoryId: 1,
  },
  {
    labelRu: "Вся косметика",
    labelDe: "Alle Kosmetika",
    id: 5,
    categoryId: 2,
  },
];



export const genders = [
  {
    label: { ru: "Мужской", de: "Männlich" },
    value: Gender.MALE,
  },
  {
    label: { ru: "Женский", de: "Weiblich" },
    value: Gender.FEMALE,
  },
  {
    label: { ru: "Унисекс", de: "Unisex" },
    value: Gender.UNISEX,
  },
];

export type GendersType = typeof genders;

export const concentrations = [
  {
    name: "Perfume",
    value: PerfumeConcentration.PERFUME,
  },
  {
    name: "Extrait de Parfum",
    value: PerfumeConcentration.EXTRAIT,
  },
  {
    name: "Eau de Parfum",
    value: PerfumeConcentration.EAU_DE_PARFUM,
  },
  {
    name: "Eau de Toilette",
    value: PerfumeConcentration.EAU_DE_TOILETTE,
  },
  {
    name: "Eau de Cologne",
    value: PerfumeConcentration.EAU_DE_COLOGNE,
  },
];


export const deliveryTypes = [
  {
    name: "Paket bis Haftung",
    value: DeliveryTypes.PBH,
    price: 6.2,
  },
  {
    name: "Großbrief",
    value: DeliveryTypes.GB,
    price: 3,
  },

  {
    name: "Einschreiben",
    value: DeliveryTypes.ES,
    price: 5,
  },
];



export type DeliveryTypesType = typeof deliveryTypes;

export const contactForms = [
  { name: "Whats App", value: ContactForms.WA },
  {
    name: "Telegram",
    value: ContactForms.TG,
  },
  {
    name: "Viber",
    value: ContactForms.VB,
  },
];

export type ContactFormsType = typeof contactForms;


//   value: Aromas;
//   label: { ru: string; de: string };
// }[] = [
//   {
//     value: Aromas.ANIMALIC,
//     label: { ru: "Анималистический", de: "Animalisch" },
//   },
//   { value: Aromas.ALDHYDE, label: { ru: "Альдегидный", de: "Aldehydisch" } },
//   { value: Aromas.AROMATIC, label: { ru: "Ароматический", de: "Aromatisch" } },
//   { value: Aromas.CITRUS, label: { ru: "Цитрусовый", de: "Zitrus" } },
//   { value: Aromas.COFFEE, label: { ru: "Кофейный", de: "Kaffeeartig" } },
//   { value: Aromas.CARAMEL, label: { ru: "Карамельный", de: "Karamellig" } },
//   { value: Aromas.CHOCOLATE, label: { ru: "Шоколадный", de: "Schokoladig" } },
//   { value: Aromas.CHYPRE, label: { ru: "Шипровый", de: "Chypre" } },
//   { value: Aromas.DUSTY, label: { ru: "Пыльный", de: "Staubig" } },
//   { value: Aromas.EARTHY, label: { ru: "Землистый", de: "Erdig" } },
//   { value: Aromas.FRUITY, label: { ru: "Фруктовый", de: "Fruchtig" } },
//   { value: Aromas.FLORAL, label: { ru: "Цветочный", de: "Blumig" } },
//   { value: Aromas.FOUGERE, label: { ru: "Фужерный", de: "Fougère" } },
//   { value: Aromas.GOURMAND, label: { ru: "Гурманский", de: "Gourmand" } },
//   { value: Aromas.LEATHER, label: { ru: "Кожаный", de: "Leder" } },
//   { value: Aromas.METALLIC, label: { ru: "Металлический", de: "Metallisch" } },
//   { value: Aromas.MILKY, label: { ru: "Молочный", de: "Milchig" } },
//   { value: Aromas.OZONE, label: { ru: "Озоновый", de: "Ozonisch" } },
//   {
//     value: Aromas.ORIENTAL_AMBER,
//     label: { ru: "Восточный (амбровый)", de: "Oriental (Amber)" },
//   },
//   { value: Aromas.SPICY, label: { ru: "Пряный", de: "Würzig" } },
//   { value: Aromas.POWDERY, label: { ru: "Пудровый", de: "Pudrig" } },
//   { value: Aromas.SWEET, label: { ru: "Сладкий", de: "Süß" } },
//   { value: Aromas.RESINOUS, label: { ru: "Смолистый", de: "Harzig" } },
//   { value: Aromas.MARITIME, label: { ru: "Морской", de: "Maritim" } },
//   { value: Aromas.WOODY, label: { ru: "Древесный", de: "Holzig" } },
//   { value: Aromas.GREEN, label: { ru: "Зелёный", de: "Grün" } },
//   { value: Aromas.TOBACCO, label: { ru: "Табачный", de: "Tabakartig" } },

//   { value: Aromas.AMBER, label: { ru: "Амбровые", de: "Ambroxene" } },
//   { value: Aromas.BALSAMIC, label: { ru: "Бальзамические", de: "Balsamisch" } },
//   { value: Aromas.VANILLA, label: { ru: "Ванильные", de: "Vanillig" } },
//   { value: Aromas.SPRINGTIME, label: { ru: "Весенние", de: "Frühlings" } },
//   { value: Aromas.EVENING, label: { ru: "Вечерние", de: "Abendlich" } },
//   { value: Aromas.AQUATIC, label: { ru: "Водные", de: "Wasser" } },
//   { value: Aromas.ORIENTAL, label: { ru: "Восточные", de: "Oriental" } },
//   {
//     value: Aromas.ORIENTAL_GOURMAND,
//     label: { ru: "Восточные гурманские", de: "Oriental Gourmand" },
//   },
//   {
//     value: Aromas.ORIENTAL_SPICY,
//     label: { ru: "Восточные пряные", de: "Oriental Würzig" },
//   },
//   {
//     value: Aromas.ORIENTAL_FLORAL,
//     label: { ru: "Восточные цветочные", de: "Oriental Blumig" },
//   },
//   { value: Aromas.DAYTIME, label: { ru: "Дневные", de: "Tages" } },
//   {
//     value: Aromas.WOODY_FOUGÈRE,
//     label: { ru: "Древесные фужерные", de: "Holzig-fougère" },
//   },
//   { value: Aromas.CASHMERAN, label: { ru: "Кашмеран", de: "Cashmeran" } },
//   { value: Aromas.SUMMER, label: { ru: "Летние", de: "Sommer" } },
//   { value: Aromas.MUSKY, label: { ru: "Мускатные", de: "Muskatartig" } },
//   { value: Aromas.ROMANTIC, label: { ru: "Романтический", de: "Romantisch" } },
//   { value: Aromas.FRESH, label: { ru: "Свежие", de: "Frisch" } },
//   { value: Aromas.HERBAL, label: { ru: "Травяные", de: "Kräuter" } },
//   {
//     value: Aromas.FLORAL_WOODY,
//     label: { ru: "Цветочные древесные", de: "Blumig-holzig" },
//   },
// ];
// export type AromasType = typeof perfumeAromas;

export const yers = Array.from(
  { length: new Date().getFullYear() - 1990 },
  (_, index) => {
    const year = (index + 1991).toString();
    return { name: year, value: year };
  }
);

export enum OrderStatuses {
  NEW="Новый",
  PENDING = "В ожидании",
  SUCCEEDED = "Доставлен",
  CENCELLED = "Отменен",
}