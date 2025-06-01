import {
  Gender,
  PerfumeConcentration,
  DeliveryTypes,
  ContactForms,
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
    labelDe: "Atomizer",
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
    name: "Extract",
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

// export const perfumeAromas: {
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

// export const notes: { value: Notes; label: { ru: string; de: string } }[] = [
//   { value: Notes.AMBROXAN, label: { ru: "Амброксан", de: "Ambroxan" } },
//   { value: Notes.BELANIS, label: { ru: "Беланис", de: "Belanis" } },
//   { value: Notes.CALONE, label: { ru: "Калоне", de: "Calone" } },
//   { value: Notes.CALYPSONE, label: { ru: "Калипсон", de: "Calypsone" } },
//   {
//     value: Notes.CANDIED_LEMON,
//     label: { ru: "Кэнди Лемон", de: "Candied Lemon" },
//   },
//   {
//     value: Notes.CHERRY_LIQUEUR,
//     label: { ru: "Вишневый ликёр", de: "Cherry Liqueur" },
//   },
//   { value: Notes.ISO_E_SUPER, label: { ru: "Iso E Super", de: "Iso E Super" } },
//   { value: Notes.JAVANOL, label: { ru: "Джаванол", de: "Javanol" } },
//   { value: Notes.LEMON_SODA, label: { ru: "Лимонная сода", de: "Lemon Soda" } },
//   { value: Notes.LYSYLANG, label: { ru: "Лизилан", de: "Lysylang" } },
//   { value: Notes.MYSTIKAL, label: { ru: "Мистикал", de: "Mystikal" } },
//   {
//     value: Notes.WILLIAMS_PEAR,
//     label: { ru: "Williams Pear", de: "Williams Pear" },
//   },
//   { value: Notes.ABRIKOS, label: { ru: "Абрикос", de: "Apricot" } },
//   { value: Notes.ABSENT, label: { ru: "Абсент", de: "Absinthe" } },
//   {
//     value: Notes.ABSOLYU_ROZY,
//     label: { ru: "Абсолю розы", de: "Absolute Rose" },
//   },
//   {
//     value: Notes.ABSOLYU_VANILI,
//     label: { ru: "Абсолют ванили", de: "Absolute Vanilla" },
//   },
//   { value: Notes.AGAR, label: { ru: "Агар", de: "Agar" } },
//   { value: Notes.AYVA, label: { ru: "Айва", de: "Quince" } },
//   { value: Notes.ACACIA, label: { ru: "акация", de: "Akazie" } },
//   {
//     value: Notes.AQUATIC_NOTES,
//     label: { ru: "Акватические ноты", de: "Aquatische Noten" },
//   },
//   { value: Notes.AKVOZON, label: { ru: "аквозон", de: "Akvozön" } },
//   {
//     value: Notes.RUSSIAN_LEATHER_CHORD,
//     label: { ru: 'аккорд "русской кожи"', de: "Russischer Lederakkord" },
//   },
//   { value: Notes.ALOE_VERA, label: { ru: "Алоэ вера", de: "Aloe Vera" } },
//   { value: Notes.ALDEHYDES, label: { ru: "альдегиды", de: "Aldehyde" } },
//   { value: Notes.AMARETTO, label: { ru: "Амаретто", de: "Amaretto" } },
//   { value: Notes.AMBRA, label: { ru: "амбра", de: "Amber" } },
//   {
//     value: Notes.AMBRA_AMBER,
//     label: { ru: "амбра (янтарь)", de: "Amber (Tage)" },
//   },
//   { value: Notes.AMBRETTA, label: { ru: "Амбретта", de: "Ambrett" } },
//   { value: Notes.AMBROKSAN, label: { ru: "амброксан", de: "Ambroxan" } },
//   { value: Notes.AMIRIS, label: { ru: "амирис", de: "Amiris" } },
//   { value: Notes.PINEAPPLE, label: { ru: "Ананас", de: "Ananas" } },
//   { value: Notes.ANGELICA, label: { ru: "ангелика", de: "Angelika" } },
//   {
//     value: Notes.ENGLISH_LAVENDER,
//     label: { ru: "Английская лаванда", de: "Englischer Lavendel" },
//   },
//   {
//     value: Notes.ANIMALISTIC,
//     label: { ru: "анималистические оттенки", de: "Animalistische Nuancen" },
//   },
//   { value: Notes.ANIS, label: { ru: "Анис", de: "Anis" } },
//   {
//     value: Notes.VIOLET_EYED,
//     label: { ru: "анютины глазки", de: "Stiefmütterchen" },
//   },
//   {
//     value: Notes.ORANGE_PEEL,
//     label: { ru: "Апельсиновая кожура", de: "Orangenschale" },
//   },
//   {
//     value: Notes.BEDLINEN_FRAGRANCE,
//     label: { ru: "аромат постельного белья", de: "Bettwäscheduft" },
//   },
//   {
//     value: Notes.AROMATIC_NOTES,
//     label: { ru: "ароматические ноты", de: "Aromatische Noten" },
//   },
//   { value: Notes.ARTEMISIA, label: { ru: "Артемизия", de: "Artemisia" } },
//   {
//     value: Notes.AFRICAN_ORANGE,
//     label: { ru: "Африканский апельсиновый цвет", de: "Afrikanische Orange" },
//   },
//   { value: Notes.BANANA, label: { ru: "Банан", de: "Banane" } },
//   { value: Notes.MERINGUE, label: { ru: "Безе", de: "Baiser" } },
//   { value: Notes.WHITE_PEAR, label: { ru: "Белая груша", de: "Weiße Birne" } },
//   { value: Notes.WHITE_LILY, label: { ru: "Белая лилия", de: "Weiße Lilie" } },
//   { value: Notes.WHITE_ROSE, label: { ru: "Белая роза", de: "Weiße Rose" } },
//   {
//     value: Notes.WHITE_BLACKCURRANT,
//     label: { ru: "Белая смородина", de: "Weiße Johannisbeere" },
//   },
//   {
//     value: Notes.WHITE_VIOLET,
//     label: { ru: "Белая фиалка", de: "Weiße Veilchen" },
//   },
//   {
//     value: Notes.WHITE_FREESIA,
//     label: { ru: "Белая фрезия", de: "Weiße Freesie" },
//   },
//   { value: Notes.WHITE_WINE, label: { ru: "Белое вино", de: "Weißwein" } },
//   {
//     value: Notes.WHITE_FLOWERS,
//     label: { ru: "Белые цветы", de: "Weiße Blumen" },
//   },
//   {
//     value: Notes.WHITE_BERGAMOT,
//     label: { ru: "Белый бергамот", de: "Weißer Bergamotte" },
//   },
//   {
//     value: Notes.WHITE_GEDICHIUM,
//     label: { ru: "Белый гедихиум", de: "Weißer Gedihium" },
//   },
//   {
//     value: Notes.WHITE_HYACINTH,
//     label: { ru: "Белый гиацинт", de: "Weißer Hyazinth" },
//   },
//   { value: Notes.VODOROSLI, label: { ru: "Водоросли", de: "Algen" } },
//   {
//     value: Notes.VODYANAYA_LILIYA,
//     label: { ru: "Водяная лилия", de: "Wasserlilie" },
//   },
//   {
//     value: Notes.VODYANOY_JASMIN,
//     label: { ru: "Водяной жасмин", de: "Wasserjasmin" },
//   },
//   {
//     value: Notes.VOZDYUSHNAYA_KUKURUZA,
//     label: { ru: "Воздушная кукуруза", de: "Luftmais" },
//   },
//   {
//     value: Notes.VYSUSHENNAYA_DREVESINA,
//     label: { ru: "Высушенная древесина", de: "Getrocknetes Holz" },
//   },
//   { value: Notes.GALKA, label: { ru: "Галька", de: "Kiesel" } },
//   { value: Notes.GARDENIA, label: { ru: "Гардения", de: "Gardenie" } },
//   {
//     value: Notes.GVAIAKOVOE_DEREVO,
//     label: { ru: "Гваяковое дерево", de: "Guajakholz" },
//   },
//   {
//     value: Notes.GVOZDIKA_CVETOK,
//     label: { ru: "Гвоздика (цветок)", de: "Nelke (Blüte)" },
//   },
//   { value: Notes.GEDION, label: { ru: "Гедион", de: "Gedion" } },
//   { value: Notes.HELIOTROP, label: { ru: "Гелиотроп", de: "Heliotrop" } },
//   { value: Notes.GEOSMIN, label: { ru: "Геосмин", de: "Geosmin" } },
//   { value: Notes.GERANIY, label: { ru: "Герань", de: "Geranie" } },
//   { value: Notes.GIAZINT, label: { ru: "Гиацинт", de: "Hyazinthe" } },
//   { value: Notes.GIBISKUS, label: { ru: "Гибискус", de: "Hibiskus" } },
//   {
//     value: Notes.GIMALAYSKIY_MAK,
//     label: { ru: "Гималайский мак", de: "Himalayischer Mohn" },
//   },
//   {
//     value: Notes.GOLUBAYA_ROZA,
//     label: { ru: "Голубая роза", de: "Blaue Rose" },
//   },
//   {
//     value: Notes.GOLUBOY_BAZILIK,
//     label: { ru: "Голубой базилик", de: "Blauer Basilikum" },
//   },
//   { value: Notes.GORECHAVKA, label: { ru: "Горечавка", de: "Bitterkraut" } },
//   {
//     value: Notes.GORNYY_VOZDUKH,
//     label: { ru: "Горный воздух", de: "Bergluft" },
//   },
//   {
//     value: Notes.GORKIY_APELSIN,
//     label: { ru: "Горький апельсин", de: "Bittere Orange" },
//   },
//   {
//     value: Notes.GORKIY_MINDAL,
//     label: { ru: "Горький миндаль", de: "Bittermandel" },
//   },
//   { value: Notes.GRANAT, label: { ru: "Гранат", de: "Granatapfel" } },
//   { value: Notes.GRENADIN, label: { ru: "Гренадин", de: "Grenadine" } },
//   {
//     value: Notes.GRECHISHNIK,
//     label: { ru: "Гречишник", de: "Buchweizenkraut" },
//   },
//   {
//     value: Notes.GRUSHA_NASHI,
//     label: { ru: "Груша nashi", de: "Nashi Birne" },
//   },
//   {
//     value: Notes.GRUSHEVYY_NEKTAR,
//     label: { ru: "Грушевый нектар", de: "Birnennktar" },
//   },
//   { value: Notes.GUAVA, label: { ru: "Гуава", de: "Guave" } },
//   { value: Notes.DAVANA, label: { ru: "давана", de: "Davana" } },
//   {
//     value: Notes.DAMASK_ROSE,
//     label: { ru: "Дамасская роза", de: "Damask Rose" },
//   },
//   { value: Notes.DEREVO_AGAR, label: { ru: "Дерево агар", de: "Agarholz" } },
//   {
//     value: Notes.DEREVO_GUAYAK,
//     label: { ru: "Дерево гуаяк", de: "Guajakholz" },
//   },
//   {
//     value: Notes.DEREVO_MINDALYA,
//     label: { ru: "дерево миндаля", de: "Mandelholz" },
//   },
//   { value: Notes.DZHIN, label: { ru: "Джин", de: "Gin" } },
//   {
//     value: Notes.DIKAYA_ZEMLYANIKA,
//     label: { ru: "Дикая земляника", de: "Wilde Erdbeere" },
//   },
//   { value: Notes.DIKAYA_ROZA, label: { ru: "Дикая роза", de: "Wilde Rose" } },
//   {
//     value: Notes.DIKIY_BOYARYSHNIK,
//     label: { ru: "Дикий боярышник", de: "Wilder Weißdorn" },
//   },
//   {
//     value: Notes.DREVESNYE_AROMATY,
//     label: { ru: "Древесные ароматы", de: "Holzaromen" },
//   },
//   {
//     value: Notes.DREVESNYY_AKKORD,
//     label: { ru: "древесный аккорд", de: "Holzakkord" },
//   },
//   { value: Notes.DROK, label: { ru: "Дрок", de: "Drok" } },
//   { value: Notes.DUB, label: { ru: "Дуб", de: "Eiche" } },
//   { value: Notes.DUDNIK, label: { ru: "Дудник", de: "Dudnik" } },
//   { value: Notes.DURMAN, label: { ru: "Дурман", de: "Duran" } },
//   {
//     value: Notes.DUSHISTYY_GOROSHEK,
//     label: { ru: "Душистый горошек", de: "Duftender Erbse" },
//   },
//   {
//     value: Notes.DUSHISTYY_PEREC,
//     label: { ru: "Душистый перец", de: "Duftiger Pfeffer" },
//   },
//   { value: Notes.DYM, label: { ru: "дым", de: "Rauch" } },
//   {
//     value: Notes.DYMNYY_NOTY,
//     label: { ru: "Дымные ноты", de: "Rauchige Noten" },
//   },
//   { value: Notes.DYNYA, label: { ru: "Дыня", de: "Melone" } },
//   {
//     value: Notes.EGIPETSKIY_ZHASMINS,
//     label: { ru: "египетский жасмин", de: "Ägyptischer Jasmin" },
//   },
//   { value: Notes.EZHEVIKA, label: { ru: "ежевика", de: "Brombeere" } },
//   {
//     value: Notes.EZHEVIKA_SIZAYA,
//     label: { ru: "ежевика сизая", de: "Graubrombeere" },
//   },
//   { value: Notes.EL, label: { ru: "Ель", de: "Tanne" } },
//   {
//     value: Notes.ZHASMINSAMBAK,
//     label: { ru: "Жасмин самбак", de: "Sambac-Jasmin" },
//   },
//   {
//     value: Notes.ZHASMINSKIY_CHAI,
//     label: { ru: "Жасминовый чай", de: "Jasmintee" },
//   },
//   {
//     value: Notes.ZHEVATELNAYA_REZINKA,
//     label: { ru: "жевательная резинка", de: "Kaugummi" },
//   },
//   {
//     value: Notes.ZHELTYY_MANDARIN,
//     label: { ru: "Желтый мандарин", de: "Gelber Mandarine" },
//   },
//   {
//     value: Notes.ZHIVOTNYE_NOTY,
//     label: { ru: "животные ноты", de: "Tierische Noten" },
//   },
//   { value: Notes.ZHIMOLOST, label: { ru: "Жимолость", de: "Kapuzinerkresse" } },
//   {
//     value: Notes.ZAMOROZHENNAYA_MYATA,
//     label: { ru: "Замороженная мята", de: "Gefrorene Minze" },
//   },
//   { value: Notes.ZAMSHA, label: { ru: "Замша", de: "Wildleder" } },
//   {
//     value: Notes.ZASAKHARENNOE_YABLKO,
//     label: { ru: "засахаренное яблоко", de: "gezuckerter Apfel" },
//   },
//   {
//     value: Notes.ZASAKHARENNIE_FRUKTY,
//     label: { ru: "засахаренные фрукты", de: "gezuckerte Früchte" },
//   },
//   {
//     value: Notes.ZVEZDCHATYY_ANIS,
//     label: { ru: "Звездчатый анис", de: "Sternanis" },
//   },
//   {
//     value: Notes.ZELENAYA_LESTVA,
//     label: { ru: "Зеленая листва", de: "Grüne Blätter" },
//   },

//   { value: Notes.KIPARIS, label: { ru: "Кипарис", de: "Zypresse" } },
//   {
//     value: Notes.KITAYSKIY_GREIPFRUT,
//     label: { ru: "Китайский грейпфрут", de: "Chinesische Grapefruit" },
//   },
//   {
//     value: Notes.KITAYSKIY_OSMANTUS,
//     label: { ru: "китайский османтус", de: "Chinesischer Osmanthus" },
//   },
//   { value: Notes.KLEVER, label: { ru: "Клевер", de: "Klee" } },
//   { value: Notes.KLEMENTIN, label: { ru: "Клементин", de: "Klementine" } },
//   { value: Notes.KLUBNIKA, label: { ru: "Клубника", de: "Erdbeere" } },
//   { value: Notes.KLYUKVA, label: { ru: "Клюква", de: "Preiselbeere" } },
//   {
//     value: Notes.KLYUKVA_OBRAZYUT,
//     label: { ru: "клюква образуют", de: "Preiselbeeren bilden" },
//   },
//   {
//     value: Notes.KOZHURA_APELSINA,
//     label: { ru: "Кожура апельсина", de: "Orangenschale" },
//   },
//   { value: Notes.KOKAKOLA, label: { ru: "кока-кола", de: "Cola" } },
//   {
//     value: Notes.KOKOS_YABLOKO,
//     label: { ru: "кокос яблоко", de: "Kokosapfel" },
//   },
//   {
//     value: Notes.KOKOSOVAYA_VODA,
//     label: { ru: "Кокосовая вода", de: "Kokoswasser" },
//   },
//   {
//     value: Notes.KOKOSOVOE_MOLOCHKO,
//     label: { ru: "кокосовое молочко", de: "Kokosmilch" },
//   },
//   {
//     value: Notes.KOKOSOVYY_NEKTAR,
//     label: { ru: "кокосовый нектар", de: "Kokosnektar" },
//   },
//   { value: Notes.KOLOKOLNIK, label: { ru: "Колокольчик", de: "Glockenblume" } },
//   { value: Notes.KONOPLYA, label: { ru: "Конопля", de: "Hanf" } },
//   { value: Notes.KONYAK, label: { ru: "коньяк", de: "Cognac" } },
//   {
//     value: Notes.KOPAKHU_BALZAM,
//     label: { ru: "копаху бальзам", de: "Kopahu-Balsam" },
//   },
//   { value: Notes.KOREN_IRISA, label: { ru: "корень ириса", de: "Iriswurzel" } },
//   { value: Notes.KORIANDR, label: { ru: "Кориандр", de: "Koriander" } },
//   {
//     value: Notes.KORIANDROVYY_ALDEGID,
//     label: { ru: "кориандровый альдегид", de: "Korianderaldehyd" },
//   },
//   {
//     value: Notes.KRASNAYA_SMORODINA,
//     label: { ru: "Красная смородина", de: "Rote Johannisbeere" },
//   },
//   {
//     value: Notes.KRASNAYA_FREZIA,
//     label: { ru: "Красная фрезия", de: "Rote Freesie" },
//   },
//   { value: Notes.KRASNOE_VINO, label: { ru: "Красное вино", de: "Rotwein" } },
//   {
//     value: Notes.KRASNOE_YABLOKO,
//     label: { ru: "Красное яблоко", de: "Roter Apfel" },
//   },
//   {
//     value: Notes.KRASNYE_VODOROSLI,
//     label: { ru: "красные водоросли", de: "Rote Algen" },
//   },
//   {
//     value: Notes.KRASNYE_FRUKTY,
//     label: { ru: "Красные фрукты", de: "Rote Früchte" },
//   },
//   {
//     value: Notes.KRASNY_APELSIN,
//     label: { ru: "Красный апельсин", de: "Rote Orange" },
//   },
//   {
//     value: Notes.KRASNY_GREIPFRUT,
//     label: { ru: "Красный грейпфрут", de: "Roter Grapefruit" },
//   },
//   {
//     value: Notes.KRASNY_ZHASMINS,
//     label: { ru: "Красный жасмин", de: "Roter Jasmin" },
//   },
//   {
//     value: Notes.KRASNY_MANDARIN,
//     label: { ru: "Красный мандарин", de: "Roter Mandarine" },
//   },
//   {
//     value: Notes.KRASNY_PEREC,
//     label: { ru: "Красный перец", de: "Roter Pfeffer" },
//   },
//   {
//     value: Notes.KRASNY_PEREC_CHILI,
//     label: { ru: "Красный перец чили", de: "Chili-Pfeffer" },
//   },
//   {
//     value: Notes.KRASNY_SANDAL,
//     label: { ru: "Красный сандал", de: "Roter Sandelholz" },
//   },
//   {
//     value: Notes.KRASNY_TIMYAN,
//     label: { ru: "Красный тимьян", de: "Roter Thymian" },
//   },
//   { value: Notes.KRASNY_CHAI, label: { ru: "Красный чай", de: "Roter Tee" } },
//   { value: Notes.KUBEBA, label: { ru: "кубеба", de: "Kubeba" } },
//   { value: Notes.KUVSHINKA, label: { ru: "Кувшинка", de: "Kuvshinka" } },
//   { value: Notes.KUMKVAT, label: { ru: "Кумкват", de: "Kumquat" } },
//   { value: Notes.KURKUMA, label: { ru: "Куркума", de: "Kurkuma" } },
//   { value: Notes.LABDANUM, label: { ru: "Лабданум", de: "Labdanum" } },
//   { value: Notes.LAVR, label: { ru: "Лавр", de: "Lorbeer" } },
//   { value: Notes.LADANNIK, label: { ru: "Ладанник", de: "Ladanik" } },
//   { value: Notes.LAYM, label: { ru: "Лайм", de: "Limette" } },
//   { value: Notes.LAMINARIYA, label: { ru: "Ламинария", de: "Algen" } },
//   { value: Notes.LAOSSKIY_UD, label: { ru: "Лаосский уд", de: "Laossud" } },
//   { value: Notes.LED, label: { ru: "Лед", de: "Eis" } },
//   {
//     value: Notes.LEDYANOY_LIMON,
//     label: { ru: "Ледяной лимон", de: "Eisiger Zitrone" },
//   },
//   { value: Notes.LEMONGRASS, label: { ru: "Лемонграсс", de: "Zitronengras" } },
//   { value: Notes.LEN, label: { ru: "Лен", de: "Leinen" } },
//   {
//     value: Notes.LEPESTKI_BOLGARSKOY_ROZY,
//     label: { ru: "Лепестки болгарской розы", de: "Bulgarische Rosenblätter" },
//   },
//   {
//     value: Notes.LEPESTKI_MAGNOLII,
//     label: { ru: "Лепестки магнолии", de: "Magnolienblätter" },
//   },
//   {
//     value: Notes.LEPESTKI_FREZII,
//     label: { ru: "Лепестки фрезии", de: "Freesienblätter" },
//   },
//   { value: Notes.LESNOY_ORNEX, label: { ru: "Лесной орех", de: "Walnuss" } },
//   {
//     value: Notes.LESNYE_YAGODY,
//     label: { ru: "Лесные ягоды", de: "Waldbeeren" },
//   },
//   {
//     value: Notes.LIKER_IZ_CHERNOY_SMORODINY,
//     label: {
//       ru: "Ликер из черной смородины",
//       de: "Likör aus schwarzer Johannisbeere",
//     },
//   },
//   { value: Notes.LILII, label: { ru: "Лилия", de: "Lilie" } },
//   {
//     value: Notes.LIMON_PRIMOFIORE,
//     label: { ru: "Лимон Примофиоре", de: "Limon Primofiore" },
//   },
//   {
//     value: Notes.LIMONNAYA_TSEDRA,
//     label: { ru: "Лимонная цедра", de: "Zitronenzeste" },
//   },
//   { value: Notes.LIPA, label: { ru: "Липа", de: "Linde" } },
//   {
//     value: Notes.LIPA_CVTETY,
//     label: { ru: "Липа (цветы)", de: "Lindenblüten" },
//   },
//   {
//     value: Notes.LIPOVYY_CVET,
//     label: { ru: "Липовый цвет", de: "Lindenblüte" },
//   },
//   {
//     value: Notes.LIST_ANANASA,
//     label: { ru: "Лист ананаса", de: "Ananasblatt" },
//   },
//   {
//     value: Notes.LIST_GORKOGO_APELSINA,
//     label: { ru: "Лист горького апельсина", de: "Bitterorange Blatt" },
//   },
//   { value: Notes.LIST_INJIRA, label: { ru: "Лист инжира", de: "Feigenblatt" } },
//   { value: Notes.LIST_KORITSY, label: { ru: "Лист корицы", de: "Zimtblatt" } },
//   {
//     value: Notes.LIST_LIMONA,
//     label: { ru: "Лист лимона", de: "Zitronenblatt" },
//   },
//   { value: Notes.LIST_LOTOSA, label: { ru: "Лист лотоса", de: "Lotusblatt" } },
//   {
//     value: Notes.LIST_MANDARINA,
//     label: { ru: "Лист мандарина", de: "Mandarinenblatt" },
//   },
//   { value: Notes.LIST_PALMY, label: { ru: "Лист пальмы", de: "Palmblatt" } },
//   {
//     value: Notes.LIST_PACHULI,
//     label: { ru: "Лист пачули", de: "Patschuliblatt" },
//   },
//   {
//     value: Notes.LIST_REVENYA,
//     label: { ru: "лист ревеня", de: "Blatt von Rüben(?)" },
//   },
//   { value: Notes.LIST_TABAKA, label: { ru: "лист табака", de: "Tabakblatt" } },
//   {
//     value: Notes.LIST_TOMATA,
//     label: { ru: "Лист томата", de: "Tomatenblatt" },
//   },
//   {
//     value: Notes.LIST_FIALKI,
//     label: { ru: "лист фиалки", de: "Veilchenblatt" },
//   },
//   {
//     value: Notes.LIST_CHERNOY_SMORODINY,
//     label: { ru: "Лист черной смородины", de: "Blatt Schwarze Johannisbeere" },
//   },
//   {
//     value: Notes.LIST_APELSINA,
//     label: { ru: "Листья апельсина", de: "Orangenblätter" },
//   },
//   {
//     value: Notes.LIST_BANANA,
//     label: { ru: "Листья банана", de: "Bananenblätter" },
//   },
//   {
//     value: Notes.LIST_GERANI,
//     label: { ru: "Листья герани", de: "Geranienblätter" },
//   },
//   {
//     value: Notes.LIST_ZELYONOY_ZEMLYANIKI,
//     label: { ru: "Листья земляники", de: "Erdbeerblätter" },
//   },
//   {
//     value: Notes.LIST_INDIYSKOGO_FINIKOVOGO_DEREVA,
//     label: {
//       ru: "листья индийского финикового дерева",
//       de: "Blätter Indischer Dattelpalme",
//     },
//   },
//   {
//     value: Notes.LIST_KEDRA,
//     label: { ru: "листья кедра", de: "Zedernblätter" },
//   },
//   {
//     value: Notes.LIST_KLEVERA,
//     label: { ru: "Листья клевера", de: "Kleeblätter" },
//   },
//   {
//     value: Notes.LIST_KLUBNIKI,
//     label: { ru: "листья клубники", de: "Erdbeerblätter" },
//   },
//   {
//     value: Notes.LIST_MALINY,
//     label: { ru: "Листья малины", de: "Himbeerblätter" },
//   },
//   {
//     value: Notes.LIST_MIMOZY,
//     label: { ru: "Листья мимозы", de: "Mimosenblätter" },
//   },
//   {
//     value: Notes.LIST_OLIVY,
//     label: { ru: "листья оливы", de: "Olivenblätter" },
//   },
//   { value: Notes.LIST_PLYUSHA, label: { ru: "Листья плюща", de: "Efeublatt" } },
//   {
//     value: Notes.LIST_SMORODINY,
//     label: { ru: "листья смородины", de: "Blätter schwarzer Johannisbeere" },
//   },
//   {
//     value: Notes.LIST_FIALKI_2,
//     label: { ru: "Листья фиалки", de: "Veilchenblätter" },
//   },
//   { value: Notes.LIST_CHAYA, label: { ru: "Листья чая", de: "Teeblätter" } },
//   { value: Notes.LITSEYA, label: { ru: "литцея", de: "Litsea" } },
//   {
//     value: Notes.LITSEYA_KUBEBA,
//     label: { ru: "Литцея Кубеба", de: "Litsea Kubeba" },
//   },
//   { value: Notes.LICHI, label: { ru: "Личи", de: "Litschi" } },
//   { value: Notes.LOTOS, label: { ru: "Лотос", de: "Lotus" } },
//   {
//     value: Notes.MADAGASKAR_VANIL,
//     label: { ru: "Мадагаскарская ваниль", de: "Madagaskar Vanille" },
//   },
//   {
//     value: Notes.MADAGASKAR_GVOZDIKA,
//     label: { ru: "мадагаскарская гвоздика", de: "Madagaskar Nelke" },
//   },
//   {
//     value: Notes.MADAGASKAR_PEREC,
//     label: { ru: "мадагаскарский перец", de: "Madagaskar Pfeffer" },
//   },
//   { value: Notes.MAYORAN, label: { ru: "Майоран", de: "Majoran" } },
//   {
//     value: Notes.MAYSKAYA_ROZA,
//     label: { ru: "Майская роза", de: "Maienrose" },
//   },
//   {
//     value: Notes.MALINOVYY_LIST,
//     label: { ru: "Малиновый лист", de: "Himbeerblatt" },
//   },
//   { value: Notes.MANGO, label: { ru: "Манго", de: "Mango" } },
//   {
//     value: Notes.MANDARIN_I_ROZY_PEREC,
//     label: { ru: "мандарин и розовый перец", de: "Mandarine & Rosa Pfeffer" },
//   },
//   {
//     value: Notes.MANDARIN_NEPOLYA,
//     label: { ru: "мандарин из неаполя", de: "Napolitanische Mandarine" },
//   },
//   {
//     value: Notes.MAROKKANSKAYA_ROZA,
//     label: { ru: "Марокканская роза", de: "Marokkanische Rose" },
//   },
//   { value: Notes.MARSHMELLOU, label: { ru: "Маршмэллоу", de: "Marshmallow" } },
//   { value: Notes.MASE, label: { ru: "масе", de: "Mase" } },
//   {
//     value: Notes.MASLO_APELSINA,
//     label: { ru: "масло апельсина", de: "Orangenöl" },
//   },
//   { value: Notes.MASLO_KAKAO, label: { ru: "масло какао", de: "Kakaobutter" } },
//   {
//     value: Notes.MASLO_MOZHHEVELNIKA,
//     label: { ru: "масло можжевельника", de: "Wacholderöl" },
//   },
//   {
//     value: Notes.MASLO_YAVANSKOGO_VETIVERA,
//     label: { ru: "Масло яванского ветивера", de: "Javanese Vetiveröl" },
//   },

//   {
//     value: Notes.MASTIKOVOE_DEREVO,
//     label: { ru: "Мастиковое дерево", de: "Mastikovoye Derevo" },
//   },
//   { value: Notes.MATE, label: { ru: "Мате", de: "Mate" } },
//   { value: Notes.MATCHA_CHAI, label: { ru: "матча чай", de: "Matcha Tee" } },
//   { value: Notes.MAHAGONI, label: { ru: "Махагони", de: "Mahagoni" } },
//   {
//     value: Notes.MEDOVYE_SOTY,
//     label: { ru: "медовые соты", de: "Honigswaben" },
//   },
//   {
//     value: Notes.METALLICHESKIE_NOTY,
//     label: { ru: "металлические ноты", de: "Metallische Noten" },
//   },
//   { value: Notes.MIMOZA, label: { ru: "Мимоза", de: "Mimose" } },
//   { value: Notes.MINDAL, label: { ru: "миндаль", de: "Mandel" } },
//   { value: Notes.MINERALY, label: { ru: "минералы", de: "Mineralien" } },
//   {
//     value: Notes.MINERALNYE_NOTY,
//     label: { ru: "минеральные ноты", de: "Mineralnoten" },
//   },
//   { value: Notes.MIRT, label: { ru: "Мирт", de: "Myrte" } },
//   { value: Notes.MOZZHEVELNIK, label: { ru: "Можжевельник", de: "Wacholder" } },
//   {
//     value: Notes.MOZZHEVELNIK_KADE,
//     label: { ru: "можжевельник (каде)", de: "Wacholder (Kade)" },
//   },
//   { value: Notes.MORKOV, label: { ru: "морковь", de: "Karotte" } },
//   { value: Notes.MOROZHENOE, label: { ru: "Мороженое", de: "Eiscreme" } },
//   { value: Notes.MOROSHKA, label: { ru: "Морошка", de: "Mooshka" } },
//   {
//     value: Notes.MORSKAYA_VODA,
//     label: { ru: "Морская вода", de: "Meerwasser" },
//   },
//   { value: Notes.MORSKAYA_SOL, label: { ru: "Морская соль", de: "Meersalz" } },
//   {
//     value: Notes.MORSKIE_VODOROSLI,
//     label: { ru: "морские водоросли", de: "Meeresalgen" },
//   },
//   {
//     value: Notes.MORSKIE_NOTY,
//     label: { ru: "морские ноты", de: "Meeresnoten" },
//   },
//   {
//     value: Notes.MORSKOY_BRIZ,
//     label: { ru: "Морской бриз", de: "Meeresbrise" },
//   },
//   { value: Notes.MOH, label: { ru: "Мох", de: "Moos" } },
//   {
//     value: Notes.MUSKATNIY_GORIKH,
//     label: { ru: "мускатний горіх", de: "Muskatnuss (Walnuss)" },
//   },
//   {
//     value: Notes.MUSKATNY_ORYEH,
//     label: { ru: "мускатный орех", de: "Muskatnuss" },
//   },
//   {
//     value: Notes.MUSKATNY_SHALFEI,
//     label: { ru: "мускатный шалфей", de: "Muskat-Salbei" },
//   },
//   { value: Notes.MYLO, label: { ru: "мыло", de: "Seife" } },
//   {
//     value: Notes.MYATA_KOLOISTAYA,
//     label: { ru: "мята колосистая", de: "Raschelminze" },
//   },
//   {
//     value: Notes.MYATA_PERECHNAYA,
//     label: { ru: "Мята перечная", de: "Pfefferminze" },
//   },
//   { value: Notes.NEKTAR, label: { ru: "Нектар", de: "Nektar" } },
//   {
//     value: Notes.NEKTAR_CHERNOY_SMORODINY,
//     label: {
//       ru: "Нектар черной смородины",
//       de: "Nektar schwarzer Johannisbeere",
//     },
//   },
//   { value: Notes.NEKTARIN, label: { ru: "Нектарин", de: "Nektarin" } },
//   { value: Notes.NOGOTKI, label: { ru: "Ноготки", de: "Nagotki" } },
//   {
//     value: Notes.NOCHNOY_JASMIN_CESTRUM,
//     label: { ru: "ночной жасмин (цеструм)", de: "Nachtjasmin (Cestrum)" },
//   },
//   {
//     value: Notes.OBZHARENNYE_KOFEE,
//     label: { ru: "обжаренный кофе", de: "Gerösteter Kaffee" },
//   },
//   { value: Notes.OZON, label: { ru: "Озон", de: "Ozon" } },
//   { value: Notes.OLIBANUM, label: { ru: "Олибанум", de: "Olibanum" } },
//   {
//     value: Notes.OLIVKOVOE_DEREVO,
//     label: { ru: "оливковое дерево", de: "Olivenholz" },
//   },
//   { value: Notes.OREGANO, label: { ru: "орегано", de: "Oregano" } },
//   { value: Notes.ORKHIDEYA, label: { ru: "Орхидея", de: "Orchidee" } },
//   { value: Notes.OSMANTUS, label: { ru: "Османтус", de: "Osmanthus" } },
//   {
//     value: Notes.PAZHITNIK_FENUGREK,
//     label: { ru: "пажитник (фенугрек)", de: "Fenugreek" },
//   },
//   { value: Notes.PALISANDR, label: { ru: "Палисандр", de: "Palisander" } },
//   { value: Notes.PALO_SANTO, label: { ru: "пало санто", de: "Palo Santo" } },
//   { value: Notes.PALMA, label: { ru: "пальма", de: "Palme" } },
//   { value: Notes.PAPAIYA, label: { ru: "Папайя", de: "Papaya" } },
//   { value: Notes.PAPAROTNIK, label: { ru: "Папоротник", de: "Farn" } },
//   { value: Notes.PAPRIKA, label: { ru: "паприка", de: "Paprika" } },
//   {
//     value: Notes.PARAGUAYSKIY_PETITGREY,
//     label: { ru: "парагвайский петитгрей", de: "Paraguayischer Petitgrain" },
//   },
//   {
//     value: Notes.PARMSKAYA_FIALKA,
//     label: { ru: "Пармская фиалка", de: "Parma Veilchen" },
//   },
//   { value: Notes.PELARGONIYA, label: { ru: "Пеларгония", de: "Pelargonie" } },
//   {
//     value: Notes.PEREC_SICHAUYAN,
//     label: { ru: "перец сичауань", de: "Sichuan Pfeffer" },
//   },
//   {
//     value: Notes.PEREC_TIMUR,
//     label: { ru: "перец тимур (тимут)", de: "Timur Pfeffer" },
//   },
//   {
//     value: Notes.PEREC_CHERNYY,
//     label: { ru: "Перец черный", de: "Schwarzer Pfeffer" },
//   },
//   {
//     value: Notes.PERECHNAYA_MYTA,
//     label: { ru: "Перечная мята", de: "Pfefferminze" },
//   },
//   {
//     value: Notes.PERUANSKIY_PEREC,
//     label: { ru: "перуанский перец", de: "Peruanischer Pfeffer" },
//   },
//   { value: Notes.PESOK, label: { ru: "Песок", de: "Sand" } },
//   { value: Notes.PECHENYE, label: { ru: "печенье", de: "Kekse" } },
//   { value: Notes.PITAKHAIYA, label: { ru: "питахайя", de: "Pitahaya" } },
//   { value: Notes.PLAVNIK, label: { ru: "плавник", de: "Flosse" } },
//   {
//     value: Notes.PLODY_MOZHJEVELNIKA,
//     label: { ru: "Плоды можжевельника", de: "Wacholderbeeren" },
//   },
//   { value: Notes.PLYUMERIYA, label: { ru: "Плюмерия", de: "Plumeria" } },
//   { value: Notes.PLYUSHCH, label: { ru: "Плющ", de: "Efeu" } },
//   {
//     value: Notes.POLEVYE_CVETY,
//     label: { ru: "Полевые цветы", de: "Wiesenblumen" },
//   },
//   { value: Notes.POLYN, label: { ru: "полынь", de: "Wermut" } },
//   { value: Notes.POMELO, label: { ru: "помело", de: "Pomelo" } },
//   { value: Notes.POMIDOR, label: { ru: "Помидор", de: "Tomate" } },
//   { value: Notes.POPKORN, label: { ru: "Попкорн", de: "Popcorn" } },
//   { value: Notes.POROKH, label: { ru: "порох", de: "Pulver" } },
//   {
//     value: Notes.POCKI_CHERNOY_SMORODINY,
//     label: { ru: "Почки черной смородины", de: "Schwarze Johannisbeerknospen" },
//   },
//   {
//     value: Notes.PRYANYE_NOTY,
//     label: { ru: "Пряные ноты", de: "Gewürznoten" },
//   },
//   {
//     value: Notes.PUDROVYE_NOTY,
//     label: { ru: "пудровые ноты", de: "Pudrige Noten" },
//   },
//   { value: Notes.PUNSH, label: { ru: "пунш", de: "Punsch" } },
//   {
//     value: Notes.PCHELINYY_VOSK,
//     label: { ru: "Пчелиный воск", de: "Bienenwachs" },
//   },
//   { value: Notes.PARADISONE, label: { ru: "рaradisone", de: "Paradisone" } },
//   { value: Notes.RAZMARIN, label: { ru: "Размарин", de: "Rosmarin" } },
//   {
//     value: Notes.RAHAUT_LUKUM,
//     label: { ru: "Рахат-лукум", de: "Turkish Delight" },
//   },
//   { value: Notes.RIS, label: { ru: "Рис", de: "Reis" } },
//   {
//     value: Notes.ROZA_IZ_NEPALA,
//     label: { ru: "Роза из Непала", de: "Nepalesische Rose" },
//   },
//   {
//     value: Notes.ROZOVAYA_VODA,
//     label: { ru: "Розовая вода", de: "Rosa Wasser" },
//   },
//   {
//     value: Notes.ROZOVAYA_FREZIA,
//     label: { ru: "Розовая фрезия", de: "Rosa Freesie" },
//   },
//   {
//     value: Notes.ROZOVOE_DEREVO,
//     label: { ru: "розовое дерево", de: "Rosiges Holz" },
//   },
//   {
//     value: Notes.ROZOVOE_SHAMPANSKOE,
//     label: { ru: "Розовое шампанское", de: "Rosé Champagner" },
//   },
//   {
//     value: Notes.ROZOVYE_LEPESTKI,
//     label: { ru: "розовые лепестки", de: "Rosa Blütenblätter" },
//   },
//   {
//     value: Notes.ROZOVYY_GREIPFRUT,
//     label: { ru: "Розовый грейпфрут", de: "Rosa Grapefruit" },
//   },
//   {
//     value: Notes.ROZOVYY_OLEANDER,
//     label: { ru: "розовый олеандр", de: "Rosa Oleander" },
//   },
//   { value: Notes.ROZOVYY_PERE, label: { ru: "розовый пере", de: "Rosa Péré" } },
//   {
//     value: Notes.ROZOVYY_PEREC,
//     label: { ru: "розовый перец", de: "Rosa Pfeffer" },
//   },
//   {
//     value: Notes.ROZOVYY_PEREC_RED_BERRIES,
//     label: {
//       ru: "розовый перец (красные ягоды)",
//       de: "Rosa Pfeffer (rote Beeren)",
//     },
//   },
//   {
//     value: Notes.ROZOVYY_PEREC_SMORODINA,
//     label: {
//       ru: "розовый перец и черная смородина",
//       de: "Rosa Pfeffer und schwarze Johannisbeere",
//     },
//   },
//   { value: Notes.SAMBAC, label: { ru: "Самбак", de: "Sambac" } },
//   {
//     value: Notes.SAMBACK_SKY,
//     label: { ru: "самбакский жасмин", de: "Sambac Jasmin" },
//   },
//   { value: Notes.SANTOLINA, label: { ru: "сантолина", de: "Santolina" } },
//   { value: Notes.SAPODILLA, label: { ru: "Саподилла", de: "Sapodilla" } },
//   {
//     value: Notes.SAHARNYY_TROSTNIK,
//     label: { ru: "Сахарный тростник", de: "Zuckerrohr" },
//   },
//   {
//     value: Notes.SVEZHAYA_EZHEVIKA,
//     label: { ru: "свежая ежевика", de: "Frische Brombeere" },
//   },
//   {
//     value: Notes.SVETLOE_DEREVO,
//     label: { ru: "светлое дерево", de: "Helles Holz" },
//   },
//   {
//     value: Notes.SEMENA_MORKOVI,
//     label: { ru: "Семена моркови", de: "Karottensamen" },
//   },
//   {
//     value: Notes.SEMENA_SELYDERYA,
//     label: { ru: "семена сельдерея", de: "Selleriesamen" },
//   },
//   { value: Notes.SENO, label: { ru: "Сено", de: "Heu" } },
//   {
//     value: Notes.SERAYA_AMBRA,
//     label: { ru: "серая амбра", de: "Graue Amber" },
//   },
//   {
//     value: Notes.SIBIRSKAYA_SOSNA,
//     label: { ru: "Сибирская сосна", de: "Sibirische Kiefer" },
//   },
//   { value: Notes.SIREN, label: { ru: "Сирень", de: "Flieder" } },
//   {
//     value: Notes.SIROP_CHERNOY_SMORODINA,
//     label: { ru: "сироп черной смородины", de: "Sirup Schwarze Johannisbeere" },
//   },
//   {
//     value: Notes.SICYLIYSKIY_APELSIN,
//     label: { ru: "сицилийский апельсин", de: "Sizilianische Orange" },
//   },
//   {
//     value: Notes.SICYLIYSKIY_BERGAMOT,
//     label: { ru: "Сицилийский бергамот", de: "Sizilianischer Bergamotte" },
//   },
//   {
//     value: Notes.SICYLIYSKIY_LEMON,
//     label: { ru: "сицилийский лимон", de: "Sizilianische Zitrone" },
//   },
//   {
//     value: Notes.SICYLIYSKIY_MANDARIN,
//     label: { ru: "сицилийский мандарин", de: "Sizilianische Mandarine" },
//   },
//   {
//     value: Notes.SICYLIYSKIY_CITRUS,
//     label: { ru: "сицилийский цитрусы", de: "Sizilianische Zitrusfrüchte" },
//   },
//   {
//     value: Notes.SLAADKIE_NOTY,
//     label: { ru: "Сладкие ноты", de: "Süße Noten" },
//   },
//   {
//     value: Notes.SLAADKIY_APELSIN,
//     label: { ru: "Сладкий апельсин", de: "Süße Orange" },
//   },
//   {
//     value: Notes.SLAADKIY_GOROSHEK,
//     label: { ru: "Сладкий горошек", de: "Süßer Erbse" },
//   },
//   {
//     value: Notes.SLAADKIY_MINDAL,
//     label: { ru: "сладкий миндаль", de: "Süßer Mandel" },
//   },
//   { value: Notes.SLAADOSTI, label: { ru: "Сладости", de: "Süßigkeiten" } },
//   {
//     value: Notes.SLIVA_MIRABEL,
//     label: { ru: "слива мирабель", de: "Mirabelle" },
//   },
//   {
//     value: Notes.SLIVA_PERETS_TIMUR,
//     label: { ru: "слива. перец тимур (тимут)", de: "Pflaume, Timur Pfeffer" },
//   },
//   {
//     value: Notes.SLIVOCHNIY_JASMIN,
//     label: { ru: "Сливочный жасмин", de: "Cremiger Jasmin" },
//   },
//   { value: Notes.SMOLA_ELEMI, label: { ru: "Смола элеми", de: "Elemi Harz" } },
//   {
//     value: Notes.SMORODINOVYE_POCKI,
//     label: { ru: "Смородиновые почки", de: "Johannisbeerknospen" },
//   },
//   {
//     value: Notes.SOLEYANAYA_VANIL,
//     label: { ru: "Соленая ваниль", de: "Salzige Vanille" },
//   },
//   {
//     value: Notes.SOLEYANNIE_NOTY,
//     label: { ru: "Солнечные ноты", de: "Sonnige Noten" },
//   },
//   { value: Notes.SOLOD, label: { ru: "Солод", de: "Malz" } },
//   { value: Notes.SOL, label: { ru: "соль", de: "Salz" } },
//   { value: Notes.SORBET, label: { ru: "Сорбет", de: "Sorbet" } },
//   { value: Notes.SOSNA, label: { ru: "Сосна", de: "Kiefer" } },
//   {
//     value: Notes.SOSNOVYE_IGOLKI,
//     label: { ru: "Сосновые иголки", de: "Kiefernnadeln" },
//   },
//   { value: Notes.STIRAKS, label: { ru: "Стиракс", de: "Styrax" } },
//   {
//     value: Notes.STRASTOTSVET,
//     label: { ru: "Страстоцвет", de: "Passionsblume" },
//   },
//   {
//     value: Notes.STRUCHKOVYI_PERETS,
//     label: { ru: "Стручковый перец", de: "Schotenpfeffer" },
//   },
//   {
//     value: Notes.STRUCHKOVYI_CHILI_PERETS,
//     label: { ru: "стручковый перец чили", de: "Chilischotenpfeffer" },
//   },
//   {
//     value: Notes.STRUCHOK_VANILI,
//     label: { ru: "стручок ванили", de: "Vanilleschote" },
//   },
//   { value: Notes.SUMAH, label: { ru: "Сумах", de: "Sumach" } },
//   {
//     value: Notes.SUKHOFRUKTY,
//     label: { ru: "Сухофрукты", de: "Trockenfrüchte" },
//   },
//   {
//     value: Notes.SYCHUANSKIY_PERETS,
//     label: { ru: "сычуанский перец", de: "Szechuan Pfeffer" },
//   },
//   { value: Notes.TAMARIND, label: { ru: "Тамаринд", de: "Tamarinde" } },
//   { value: Notes.TANZHELO, label: { ru: "танжело", de: "Tangelo" } },
//   { value: Notes.TANZHERIN, label: { ru: "Танжерин", de: "Tangerine" } },
//   {
//     value: Notes.TANZHERIN_ROZOVYI_PEREC,
//     label: { ru: "танжерин и розовый перец", de: "Tangerine und rosa Pfeffer" },
//   },
//   { value: Notes.TARKHUN, label: { ru: "тархун", de: "Estragon" } },
//   {
//     value: Notes.TEMNYY_SHOKOLAD,
//     label: { ru: "темный шоколад", de: "Dunkle Schokolade" },
//   },
//   { value: Notes.TIARE, label: { ru: "Тиаре", de: "Tiara" } },
//   { value: Notes.TIMYANY, label: { ru: "Тимьян", de: "Thymian" } },
//   {
//     value: Notes.TINKTURA_ZEMLI,
//     label: { ru: "тинктура земли", de: "Erdentinktur" },
//   },
//   { value: Notes.TMIN, label: { ru: "Тмин", de: "Kümmel" } },
//   { value: Notes.TOLU_BALZAM, label: { ru: "толу бальзам", de: "Tolubalsam" } },
//   { value: Notes.TOMAT, label: { ru: "Томат", de: "Tomate" } },
//   { value: Notes.TONIK, label: { ru: "тоник", de: "Tonic" } },
//   {
//     value: Notes.TOPOLINYE_POCKI,
//     label: { ru: "тополиные почки", de: "Pappelknospen" },
//   },
//   {
//     value: Notes.TOSKANSKIY_IRIS,
//     label: { ru: "тосканский ирис", de: "Toskanischer Iris" },
//   },
//   { value: Notes.TOFFI, label: { ru: "тоффи", de: "Toffee" } },
//   { value: Notes.TRAWA, label: { ru: "трава", de: "Gras" } },
//   { value: Notes.TRAY, label: { ru: "травы", de: "Kräuter" } },
//   {
//     value: Notes.TROPICHESKIE_FRUKTY,
//     label: { ru: "Тропические фрукты", de: "Tropische Früchte" },
//   },
//   { value: Notes.TROSTNIK, label: { ru: "Тростник", de: "Schilfrohr" } },
//   {
//     value: Notes.TROSTNIK_SUGAR,
//     label: { ru: "тростниковый сахар", de: "Schilfrohr-Sirup" },
//   },
//   { value: Notes.TRYUFEL, label: { ru: "Трюфель", de: "Trüffel" } },
//   {
//     value: Notes.TUNISSKIY_APELSINOVYY_CVET,
//     label: {
//       ru: "тунисский апельсиновый цвет",
//       de: "Tunesischer Orangenblüte",
//     },
//   },
//   {
//     value: Notes.TUNISSKIY_NEROLI,
//     label: { ru: "тунисский нероли", de: "Tunesischer Neroli" },
//   },
//   {
//     value: Notes.TURETSKAYA_ROZA,
//     label: { ru: "турецкая роза", de: "Türkische Rose" },
//   },
//   {
//     value: Notes.TUTTI_FRUTTI,
//     label: { ru: "Тутти Фрутти", de: "Tutti Frutti" },
//   },
//   { value: Notes.TULIP, label: { ru: "Тюльпан", de: "Tulpe" } },
//   { value: Notes.UDO, label: { ru: "удовая древесина", de: "Holz" } },
//   { value: Notes.UKROP, label: { ru: "укроп", de: "Dill" } },
//   { value: Notes.FENHEL, label: { ru: "фенхель", de: "Fenchel" } },
//   {
//     value: Notes.FIALKA_LISTYA,
//     label: { ru: "фиалка (листья)", de: "Veilchenblätter" },
//   },
//   { value: Notes.FINIKI, label: { ru: "финики", de: "Datteln" } },
//   { value: Notes.FISTASHKI, label: { ru: "Фисташки", de: "Pistazien" } },
//   { value: Notes.FLE_RDORANZH, label: { ru: "Флердоранж", de: "Fleurdoranz" } },
//   {
//     value: Notes.ORANGEBLOSSOM,
//     label: { ru: "Апельсиновая цедра", de: "Orangenblüte" },
//   },
//   { value: Notes.ROSE, label: { ru: "Роза", de: "Rose" } },
//   { value: Notes.JASMINE, label: { ru: "Жасмин", de: "Jasmin" } },
//   { value: Notes.FREZIYA, label: { ru: "Фрезия", de: "Frezia" } },
//   {
//     value: Notes.FRUKTOVAYA_VODA,
//     label: { ru: "фруктовая вода", de: "Fruchtwasser" },
//   },
//   {
//     value: Notes.FRUKTOVYE_NOTY,
//     label: { ru: "фруктовые ноты", de: "Fruchtige Noten" },
//   },
//   {
//     value: Notes.FUZHERNYE_NOTY,
//     label: { ru: "Фужерные ноты", de: "Fougère Noten" },
//   },
//   { value: Notes.HIMONANTUS, label: { ru: "Химонантус", de: "Himonantus" } },
//   { value: Notes.HURMA, label: { ru: "Хурма", de: "Dattelpflaume" } },

//   {
//     value: Notes.CVET_PERSIKA,
//     label: { ru: "цвет персика", de: "Pfirsichblüte" },
//   },
//   {
//     value: Notes.CVTKA_APELSINA,
//     label: { ru: "цветка апельсина", de: "Orangenblüte" },
//   },
//   {
//     value: Notes.CVETOK_ABRIKOSA,
//     label: { ru: "Цветок абрикоса", de: "Aprikosenblüte" },
//   },
//   {
//     value: Notes.CVETOK_APELSINA,
//     label: { ru: "цветок апельсина", de: "Orangenblüte" },
//   },
//   {
//     value: Notes.CVETOK_BERGAMOTA,
//     label: { ru: "Цветок Бергамота", de: "Bergamottenblüte" },
//   },
//   {
//     value: Notes.CVETOK_VANILI,
//     label: { ru: "цветок ванили", de: "Vanilleblüte" },
//   },
//   {
//     value: Notes.CVETOK_VISHNI,
//     label: { ru: "Цветок вишни", de: "Kirschblüte" },
//   },
//   {
//     value: Notes.CVETOK_GRUSHI,
//     label: { ru: "цветок груши", de: "Birnenblüte" },
//   },
//   {
//     value: Notes.CVETOK_IMBIRYA,
//     label: { ru: "Цветок имбиря", de: "Ingwerblüte" },
//   },
//   { value: Notes.CVETOK_IRISA, label: { ru: "цветок ириса", de: "Irisblüte" } },
//   {
//     value: Notes.CVETOK_KAKTUSA,
//     label: { ru: "Цветок кактуса", de: "Kaktusblüte" },
//   },
//   {
//     value: Notes.CVETOK_LIMONA,
//     label: { ru: "Цветок лимона", de: "Zitronenblüte" },
//   },
//   {
//     value: Notes.CVETOK_MALINY,
//     label: { ru: "цветок малины", de: "Himbeerblüte" },
//   },
//   {
//     value: Notes.CVETOK_MANGO,
//     label: { ru: "Цветок манго", de: "Mangoblüte" },
//   },
//   {
//     value: Notes.CVETOK_MINDALYA,
//     label: { ru: "Цветок миндаля", de: "Mandelblüte" },
//   },
//   {
//     value: Notes.CVETOK_MUSKAT_ORN,
//     label: { ru: "цветок мускатного ореха", de: "Muskatnussblüte" },
//   },
//   {
//     value: Notes.CVETOK_PAPAYI,
//     label: { ru: "Цветок папайи", de: "Papayablüte" },
//   },
//   {
//     value: Notes.CVETOK_PERSIKA,
//     label: { ru: "Цветок персика", de: "Pfirsichblüte" },
//   },
//   {
//     value: Notes.CVETOK_FRANZHIPANI,
//     label: { ru: "Цветок франжипани", de: "Frangipani-Blüte" },
//   },
//   {
//     value: Notes.CVETOK_CHERNOY_SMORODINY,
//     label: {
//       ru: "Цветок черной смородины",
//       de: "Schwarze Johannisbeerenblüte",
//     },
//   },
//   {
//     value: Notes.CVETOK_SHELKOVOGO_DEREVA,
//     label: { ru: "цветок шелкового дерева", de: "Seidenbaumblüte" },
//   },
//   {
//     value: Notes.CVETOCHNYE_AKKORDY,
//     label: { ru: "Цветочные аккорды", de: "Blumige Akkorde" },
//   },
//   {
//     value: Notes.CVETOCHNYE_LEPESTKI,
//     label: { ru: "Цветочные лепестки", de: "Blumenblätter" },
//   },
//   {
//     value: Notes.CVETOCHNYE_NOTY,
//     label: { ru: "цветочные ноты", de: "Blumige Noten" },
//   },
//   {
//     value: Notes.CVETOCHNYE_STEBLI,
//     label: { ru: "Цветочные стебли", de: "Blumenstängel" },
//   },
//   {
//     value: Notes.CVETY_APELSINA,
//     label: { ru: "Цветы апельсина", de: "Orangenblüten" },
//   },
//   {
//     value: Notes.CVETY_LIMONA,
//     label: { ru: "Цветы лимона", de: "Zitronenblüten" },
//   },
//   {
//     value: Notes.CVETY_MANDARINA,
//     label: { ru: "Цветы мандарина", de: "Mandarinenblüten" },
//   },
//   {
//     value: Notes.CVETY_PERSIKA,
//     label: { ru: "Цветы персика", de: "Pfirsichblüten" },
//   },
//   {
//     value: Notes.CVETY_POMERANCA,
//     label: { ru: "Цветы померанца", de: "Pomeranzenblüten" },
//   },
//   {
//     value: Notes.TSEDRA_APELSINA,
//     label: { ru: "Цедра апельсина", de: "Orangenschale" },
//   },
//   {
//     value: Notes.TSEDRA_LIMONA,
//     label: { ru: "цедра лимона", de: "Zitronenschale" },
//   },
//   {
//     value: Notes.TSEDRA_MANDARINA,
//     label: { ru: "Цедра мандарина", de: "Mandarinenschale" },
//   },
//   {
//     value: Notes.TSEDRA_CITRUSOVYKH,
//     label: { ru: "цедра цитрусовых", de: "Zitrusschale" },
//   },
//   {
//     value: Notes.TSEILONSKAYA_KORITSA,
//     label: { ru: "цейлонская корица", de: "Ceylon-Zimt" },
//   },
//   { value: Notes.TSETALOX, label: { ru: "цеталокс", de: "Cetalox" } },
//   { value: Notes.TSIBETIN, label: { ru: "цибетин", de: "Tsibetine" } },
//   { value: Notes.TSIVETTA, label: { ru: "Циветта", de: "Civetta" } },
//   { value: Notes.TSIKLAMEN, label: { ru: "Цикламен", de: "Zyklamen" } },
//   { value: Notes.TSITRON, label: { ru: "Цитрон", de: "Citron" } },
//   { value: Notes.TSITRON_YUZU, label: { ru: "цитрон юзу", de: "Citron Yuzu" } },
//   { value: Notes.TSITRUS, label: { ru: "Цитрус", de: "Zitrus" } },
//   {
//     value: Notes.TSITRUSOVYE_NOTY,
//     label: { ru: "Цитрусовые ноты", de: "Zitrusnoten" },
//   },
//   { value: Notes.TSITRUSY, label: { ru: "цитрусы", de: "Zitrusfrüchte" } },
//   { value: Notes.CHABRETS, label: { ru: "чабрец", de: "Thymian" } },
//   { value: Notes.TCHAI_ULUN, label: { ru: "чай улун", de: "Ulun-Tee" } },
//   { value: Notes.TCHAI_LIST, label: { ru: "чайный лист", de: "Teeblatt" } },
//   { value: Notes.TCHAIOT, label: { ru: "чайот", de: "Tchayot" } },
//   { value: Notes.CHAMPAKA, label: { ru: "чампака", de: "Champaka" } },
//   {
//     value: Notes.CHERNAYA_BUZINA,
//     label: { ru: "Черная бузина", de: "Schwarze Holunder" },
//   },
//   {
//     value: Notes.CHERNAYA_VANIL,
//     label: { ru: "черная ваниль", de: "Schwarze Vanille" },
//   },
//   {
//     value: Notes.CHERNAYA_VISHNYA,
//     label: { ru: "Черная вишня", de: "Schwarze Kirsche" },
//   },
//   {
//     value: Notes.CHERNAYA_KOZHA,
//     label: { ru: "черная кожа", de: "Schwarzes Leder" },
//   },
//   {
//     value: Notes.CHERNAYA_ORKHIDEYA,
//     label: { ru: "Черная орхидея", de: "Schwarze Orchidee" },
//   },
//   {
//     value: Notes.CHERNAYA_ROZA,
//     label: { ru: "Черная роза", de: "Schwarze Rose" },
//   },
//   {
//     value: Notes.CHERNAYA_SOLODKA,
//     label: { ru: "Черная солодка", de: "Schwarze Süßholzwurzel" },
//   },
//   { value: Notes.CHERNIKA, label: { ru: "Черника", de: "Heidelbeere" } },
//   { value: Notes.CHERNO_SLIV, label: { ru: "Чернослив", de: "Schneidel" } },
//   { value: Notes.CHERNYY, label: { ru: "черный", de: "Schwarz" } },
//   {
//     value: Notes.CHERNYY_I_BELYI_PEREC,
//     label: { ru: "черный и белый перец", de: "Schwarzer und weißer Pfeffer" },
//   },
//   {
//     value: Notes.CHERNYY_KARDAMON,
//     label: { ru: "Черный кардамон", de: "Schwarzer Kardamom" },
//   },
//   {
//     value: Notes.CHERNYY_PEREC,
//     label: { ru: "Черный перец", de: "Schwarzer Pfeffer" },
//   },
//   {
//     value: Notes.CHERNYY_TCHAI,
//     label: { ru: "Черный чай", de: "Schwarzer Tee" },
//   },
//   { value: Notes.SHALFEI, label: { ru: "шалфей", de: "Salbei" } },
//   { value: Notes.SHAMPANSKOE, label: { ru: "Шампанское", de: "Champagner" } },
//   { value: Notes.SHELKOVITSA, label: { ru: "Шелковица", de: "Maulbeere" } },
//   { value: Notes.SHINUS, label: { ru: "шинус", de: "Shinus" } },
//   { value: Notes.SHISO, label: { ru: "Шисо", de: "Shiso" } },
//   { value: Notes.EVKALIPT, label: { ru: "Эвкалипт", de: "Eukalyptus" } },
//   {
//     value: Notes.EKZOTICHESKIE_FRUKTY,
//     label: { ru: "Экзотические фрукты", de: "Exotische Früchte" },
//   },
//   {
//     value: Notes.EKZOTICHESKIE_CVETY,
//     label: { ru: "экзотические цветы", de: "Exotische Blumen" },
//   },
//   {
//     value: Notes.EKSTRAKT_MALINY,
//     label: { ru: "Экстракт малины", de: "Himbeerextrakt" },
//   },
//   { value: Notes.ELEM, label: { ru: "элем", de: "Elem" } },
//   { value: Notes.ELEMI, label: { ru: "элеми", de: "Elemis" } },
//   {
//     value: Notes.ESSENTSIA_KEDRA,
//     label: { ru: "эссенция кедра", de: "Zedernessenz" },
//   },
//   { value: Notes.EUKRIFIA, label: { ru: "эукрифия", de: "Eukrifia" } },
//   {
//     value: Notes.EFIRNOE_MASLO_SANDALA,
//     label: { ru: "Эфирное масло сандала", de: "Sandelöl" },
//   },
//   {
//     value: Notes.YAGODA_MOZHEVELNIKA,
//     label: { ru: "Ягода можевельника", de: "Wacholderbeere" },
//   },
//   {
//     value: Notes.YAGODY_MOZHEVELNIKA,
//     label: { ru: "Ягоды можжевельника", de: "Wacholderbeeren" },
//   },
//   { value: Notes.YANTAR, label: { ru: "Янтарь", de: "Bernstein" } },
// ];

// export const newNotes = notes.map((note) => {
//   const { value, label } = note;
//   return {
//     labelRu: label.ru,
//     labelDe: label.de,
//   };
// });

// export const brands = [
//   { name: "Aedes de Venustas", value: Brands.AEADESVENUSTAS },
//   { name: "Aether", value: Brands.AETHER },
//   { name: "Affinessence", value: Brands.AFFINESSENCE },
//   { name: "Agar Aura", value: Brands.AGAR_AURA },
//   { name: "Akro", value: Brands.AKRO },
//   { name: "Alexandria Fragrances", value: Brands.ALEXANDRIA_FRAGRANCES },
//   { name: "Alexandre.J", value: Brands.ALEXANDRE_J },
//   { name: "Allsaints (Metal Wave, Incense City)", value: Brands.ALLSAINTS },
//   { name: "Amouage", value: Brands.AMOUAGE },
//   { name: "Andrea Maack", value: Brands.ANDREA_MAACK },
//   { name: "Andy Tauer", value: Brands.ANDY_TAUER },
//   { name: "Anima Mundi", value: Brands.ANIMA_MUNDI },
//   { name: "Annick Goutal", value: Brands.ANNICK_GOUTAL },
//   { name: "April Aromatics", value: Brands.APRIL_AROMATICS },
//   { name: "Armani", value: Brands.ARMANI },
//   { name: "Armani Prive", value: Brands.ARMANI_PRIVE },
//   { name: "Atelier Cologne", value: Brands.ATELIER_COLOGNE },
//   { name: "Atelier des Ors", value: Brands.ATELIER_DES_ORS },
//   { name: "Atkinsons", value: Brands.ATKINSONS },
//   { name: "Aura Concept", value: Brands.AURA_CONCEPT },
//   { name: "Avestan", value: Brands.AVESTAN },
//   { name: "BDK Parfums", value: Brands.BDK_PARFUMS },
//   { name: "BeauFort London", value: Brands.BEAUFORT_LONDON },
//   { name: "Berdoues", value: Brands.BERDOUES },
//   { name: "Biehl Parfumkunstwerke", value: Brands.BIEHL_PARFUMKUNSTWERKE },
//   { name: "Björk & Berries", value: Brands.BJORK_AND_BERRIES },
//   { name: "Boadicea the Victorious", value: Brands.BOADICEA_THE_VICTORIOUS },
//   { name: "Bogue Profumo", value: Brands.BOGUE_PROFUMO },
//   { name: "Bois 1920", value: Brands.BOIS_1920 },
//   { name: "Bon Parfumeur", value: Brands.BON_PARFUMEUR },
//   { name: "Bond No. 9", value: Brands.BOND_NO_9 },
//   { name: "Bortnikoff", value: Brands.BORTNIKOFF },
//   { name: "Bruno Fazzolari", value: Brands.BRUNO_FAZZOLAR },
//   { name: "By Kilian", value: Brands.BY_KILIAN },
//   { name: "Byredo", value: Brands.BYREDO },
//   { name: "Calvin Klein", value: Brands.CALVIN_KLEIN },
//   { name: "Cartier (Les Heures de Parfum)", value: Brands.CARTIER },
//   { name: "Cacharel (Les Senteurs Gourmandes)", value: Brands.CACHAREL },
//   { name: "Caron", value: Brands.CARON },
//   { name: "Carner Barcelona", value: Brands.CARNER_BARCELONA },
//   { name: "Casamorati (Xerjoff)", value: Brands.CASAMORATI },
//   { name: "Chabaud Maison de Parfum", value: Brands.CHABAUD_MAISON_DE_PARFUM },
//   { name: "Chanel", value: Brands.CHANEL },
//   { name: "Chanel Les Exclusifs", value: Brands.CHANEL_LES_EXCLUSIFS },
//   { name: "Chris Collins", value: Brands.CHRIS_COLLINS },
//   { name: "Clive Christian", value: Brands.CLIVE_CHRISTIAN },
//   { name: "Comme des Garçons Parfum", value: Brands.COMME_DES_GARCONS_PARFUM },
//   { name: "Creed", value: Brands.CREED },
//   { name: "Creed Vintage (старые партии)", value: Brands.CREED_VINTAGE },
//   { name: "D.S. & Durga", value: Brands.DS_AND_DURGA },
//   { name: "Dame Perfumery", value: Brands.DAME_PERFUMERY },
//   { name: "Dasein", value: Brands.DASEIN },
//   { name: "David Jourquin", value: Brands.DAVID_JOURQUIN },
//   { name: "Dear Polly", value: Brands.DEAR_POLLY },
//   { name: "Dior", value: Brands.DIOR },
//   {
//     name: "Dior La Collection Privée",
//     value: Brands.DIOR_LA_COLLECTION_PRIVEE,
//   },
//   { name: "Diptyque (нишевая линия)", value: Brands.DIPTYQUE },
//   { name: "Dixit & Zak", value: Brands.DIXIT_AND_ZAK },
//   { name: "Dries Van Noten (парфюмерия)", value: Brands.DRIES_VAN_NOTEN },
//   { name: "Dr. Vranjes", value: Brands.DR_VRANJES },
//   { name: "Dusita", value: Brands.DUSITA },
//   { name: "E. Coudray", value: Brands.E_COUDRAY },
//   { name: "Eau d’Italie", value: Brands.EAU_DITALIE },
//   { name: "Electimuss", value: Brands.ELECTIMUSS },
//   { name: "ELDO (Etat Libre d'Orange)", value: Brands.ELDO },
//   { name: "Ellis Brooklyn", value: Brands.ELLIS_BROOKLYN },
//   { name: "Embruns", value: Brands.EMBRUNS },
//   { name: "Ensar Oud", value: Brands.ENSAR_OUD },
//   { name: "Erbario Toscano", value: Brands.ERBARIO_TOSCANO },
//   { name: "Escentric Molecules", value: Brands.ESCENTRIC_MOLECULES },
//   { name: "Ex Idolo", value: Brands.EX_IDOLO },
//   { name: "Ex Nihilo", value: Brands.EX_NIHILO },
//   { name: "Faconnable", value: Brands.FACONNABLE },
//   { name: "Farmacia SS. Annunziata", value: Brands.FARMACIA_SS_ANNUNZIATA },
//   { name: "Filippo Sorcinelli", value: Brands.FILIPPO_SORCINELLI },
//   { name: "Floris London", value: Brands.FLORIS_LONDON },
//   { name: "Fort & Manle", value: Brands.FORT_AND_MANLE },
//   { name: "Francesca Bianchi", value: Brands.FRANCESCA_BIANCHI },
//   { name: "Frederic Malle", value: Brands.FREDERIC_MALLE },
//   { name: "Fueguia 1833", value: Brands.FUEGUIA_1833 },
//   { name: "Gallivant", value: Brands.GALLIVANT },
//   { name: "Ganache Parfums", value: Brands.GANACHE_PARFUMS },
//   { name: "Giorgio Armani Privé", value: Brands.GIORGIO_ARMANI_PRIVÉ },
//   { name: "Giardino Benessere", value: Brands.GIARDINO_BENESSERE },
//   { name: "Givenchy", value: Brands.GIVENCHY },
//   { name: "Goutal Paris", value: Brands.GOUTAL_PARIS },
//   { name: "Gritti", value: Brands.GRITTI },
//   { name: "Guerlain (эксклюзивные выпуски)", value: Brands.GUERLAIN_EXCLUSIVE },
//   {
//     name: "Guerlain Les Absolus d’Orient",
//     value: Brands.GUERLAIN_LES_ABSOLUS_D_ORIENT,
//   },
//   { name: "Gucci", value: Brands.GUCCI },
//   { name: "Heeley", value: Brands.HEELEY },
//   { name: "Henry Jacques", value: Brands.HENRY_JACQUES },
//   { name: "Hermetica", value: Brands.HERMETICA },
//   { name: "Hiram Green", value: Brands.HIRAM_GREEN },
//   { name: "Histoires de Parfums", value: Brands.HISTOIRES_DE_PARFUMS },
//   { name: "Hugo Boss The Private Line", value: Brands.HUGO_BOSS_PRIVATE },
//   { name: "Imaginary Authors", value: Brands.IMAGINARY_AUTHORS },
//   { name: "Initio Parfums", value: Brands.INITIO_PARFUMS },
//   { name: "Isabey", value: Brands.ISABEY },
//   {
//     name: "Issey Miyake (L'Eau d'Issey Noir Argent и др.)",
//     value: Brands.ISSEY_MIYAKE,
//   },
//   { name: "Jacques Fath", value: Brands.JACQUES_FATH },
//   { name: "James Heeley", value: Brands.JAMES_HEELEY },
//   { name: "Jardin d’Ecrivains", value: Brands.JARDIN_DE_ECRIVAINS },
//   { name: "Jazmin Saraï", value: Brands.JAZMIN_SARAI },
//   {
//     name: "Jean-Claude Ellena (личные проекты)",
//     value: Brands.JEAN_CLAUDE_ELLENA,
//   },
//   { name: "Jeanne en Provence (люкс-линия)", value: Brands.JEANNE_EN_PROVENCE },
//   { name: "Jeroboam", value: Brands.JEROBOAM },
//   { name: "Jersey (Chanel Exclusifs)", value: Brands.JERSEY },
//   { name: "Jovoy Paris", value: Brands.JOVOY_PARIS },
//   { name: "Jul et Mad", value: Brands.JUL_ET_MAD },
//   { name: "Kerosene", value: Brands.KEROSENE },
//   { name: "Kilian (By Kilian)", value: Brands.KILIAN },
//   { name: "Krigler", value: Brands.KRIGLER },
//   { name: "L'Artisan Parfumeur", value: Brands.L_ARTISAN_PARFUMEUR },
//   {
//     name: "La Via del Profumo (AbdesSalaam Attar)",
//     value: Brands.LA_VIA_DEL_PROFUMO,
//   },
//   { name: "Laboratorio Olfattivo", value: Brands.LABORATORIO_OLFATTIVO },
//   { name: "Lancôme (La Collection)", value: Brands.LANCOME },
//   { name: "Le Galion", value: Brands.LE_GALION },
//   { name: "Le Jardin Retrouvé", value: Brands.LE_JARDIN_RETROUVE },
//   { name: "Les Indemodables", value: Brands.LES_INDEMODABLES },
//   { name: "Les Liquides Imaginaires", value: Brands.LES_LIQUIDES_IMAGINAIRES },
//   { name: "Liquides Imaginaires", value: Brands.LIQUIDES_IMAGINAIRES },
//   { name: "Loewe (эксклюзивная линия)", value: Brands.LOEWE },
//   { name: "Lubin", value: Brands.LUBIN },
//   { name: "LVNEA", value: Brands.LVNEA },
//   { name: "L'Orchestre Parfum", value: Brands.L_ORCHESTRE_PARFUM },
//   { name: "Maison Crivelli", value: Brands.MAISON_CRIVELLI },
//   { name: "Maison Francis Kurkdjian", value: Brands.MAISON_FRANCIS_KURKDJKIAN },
//   { name: "Maison Lancôme", value: Brands.MAISON_LANCOME },
//   { name: "Maison Margiela Replica", value: Brands.MAISON_MARGIELA_REPLICA },
//   {
//     name: "Maison Martin Margiela (Replica)",
//     value: Brands.MAISON_MARTIN_MARGIELA,
//   },
//   { name: "Maison Rebatchi", value: Brands.MAISON_REBATCHI },
//   { name: "Maison Tahité", value: Brands.MAISON_TAHITE },
//   { name: "Majda Bekkali", value: Brands.MAJDA_BEKKALI },
//   { name: "Mancera", value: Brands.MANCERA },
//   { name: "Manos Gerakinis", value: Brands.MANOS_GERAKINIS },
//   { name: "Marc-Antoine Barrois", value: Brands.MARC_ANTOINE_BARROIS },
//   { name: "Maria Candida Gentile", value: Brands.MARIA_CANDIDA_GENTILE },
//   { name: "Marissa Zappas", value: Brands.MARISSA_ZAPPAS },
//   { name: "Mark Buxton", value: Brands.MARK_BUXTON },
//   { name: "Masque Milano", value: Brands.MASQUE_MILANO },
//   { name: "Matière Première", value: Brands.MATIERE_PREMIERE },
//   { name: "MDCI Parfums", value: Brands.MDCI_PARFUMS },
//   { name: "Memo Paris", value: Brands.MEMO_PARIS },
//   { name: "Mendittorosa", value: Brands.MENDITTOROSA },
//   { name: "Miller Harris", value: Brands.MILLER_HARRIS },
//   { name: "Miya Shinma", value: Brands.MIYA_SHINMA },
//   { name: "Montale", value: Brands.MONTALIE },
//   { name: "Monograph", value: Brands.MONOGRAPH },
//   { name: "Moresque", value: Brands.MORESQUE },
//   { name: "Mugler Les Exceptions", value: Brands.MUGLER_LES_EXCEPTIONS },
//   { name: "Myrrhe & Délires", value: Brands.MYRRE_AND_DELIRES },
//   {
//     name: "Narciso Rodriguez (For Her & For Him)",
//     value: Brands.NARCISO_RODRIGUEZ,
//   },
//   { name: "Nasomatto", value: Brands.NASOMATTO },
//   {
//     name: "Nicolai Parfumeur Createur",
//     value: Brands.NICOLAI_PARFUMEUR_CREATEUR,
//   },
//   { name: "Nishane", value: Brands.NISHANE },
//   { name: "Note di Profumum", value: Brands.NOTE_DI_PROFUMUM },
//   { name: "O’Driù", value: Brands.ODRIU },
//   { name: "Olfactive Studio", value: Brands.OLFACTIVE_STUDIO },
//   { name: "Olibere Parfums", value: Brands.OLIBERE_PARFUMS },
//   { name: "Ormonde Jayne", value: Brands.ORMONDE_JAYNE },
//   { name: "Ormonde Jayne Montabaco", value: Brands.ORMONDE_JAYNE_MONTABACO },
//   { name: "Ormonde Man", value: Brands.ORMONDE_MAN },
//   {
//     name: "Oscar de la Renta (эксклюзивная линия)",
//     value: Brands.OSCAR_DE_LA_RENTA,
//   },
//   { name: "Osmofolia", value: Brands.OSMOFOLIA },
//   { name: "P. Seven", value: Brands.P_SEVEN },
//   { name: "Paco Rabanne (эксклюзивные выпуски)", value: Brands.PACO_RABANNE },
//   { name: "Parfum d’Empire", value: Brands.PARFUM_D_EMPIRE },
//   { name: "Parfum d’Orsay", value: Brands.PARFUM_D_ORSAY },
//   { name: "Parfums de Marly", value: Brands.PARFUMS_DE_MARLY },
//   { name: "Parfums Dusita", value: Brands.PARFUMS_DUSITA },
//   { name: "Parfums MDCI", value: Brands.PARFUMS_MDCI },
//   { name: "Parle Moi de Parfum", value: Brands.PARLE_MOI_DE_PARFUM },
//   { name: "Pekji", value: Brands.PEKJI },
//   { name: "Penhaligon’s", value: Brands.PENHALIGONS },
//   { name: "Perris Monte Carlo", value: Brands.PERRIS_MONTE_CARLO },
//   { name: "Phuong Dang", value: Brands.PHUONG_DANG },
//   { name: "Pierre Guillaume", value: Brands.PIERRE_GUILLAUME },
//   { name: "Pineward Perfumes", value: Brands.PINEWARD_PERFUMES },
//   { name: "Prissana", value: Brands.PRISSANA },
//   { name: "Profumum Roma", value: Brands.PROFUMUM_ROMA },
//   { name: "Puredistance", value: Brands.PUREDISTANCE },
//   { name: "Quartana", value: Brands.QUARTANA },
//   { name: "Ramon Monegal", value: Brands.RAMON_MONEGAL },
//   { name: "Rania J", value: Brands.RANIA_J },
//   { name: "Régime des Fleurs", value: Brands.REGIME_DES_FLEURS },
//   { name: "Robert Piguet", value: Brands.ROBERT_PIGUET },
//   { name: "Roja Dove", value: Brands.ROJA_DOVE },
//   { name: "Room 1015", value: Brands.ROOM_1015 },
//   { name: "Royal Crown", value: Brands.ROYAL_CROWN },
//   { name: "Salle Privée", value: Brands.SALLE_PRIVEE },
//   { name: "Santa Maria Novella", value: Brands.SANTA_MARIA_NOVELLA },
//   { name: "Santi Burgas", value: Brands.SANTI_BURGAS },
//   { name: "Scentrique", value: Brands.SCENTRIQUE },
//   { name: "Serge Lutens", value: Brands.SERGE_LUTENS },
//   { name: "Sixteen92", value: Brands.SIXTEEN92 },
//   { name: "Slumberhouse", value: Brands.SLUMBERHOUSE },
//   {
//     name: "Stephane Humbert Lucas 777",
//     value: Brands.STEPHANE_HUMBERT_LUCAS_777,
//   },
//   { name: "Strangers Parfumerie", value: Brands.STRANGERS_PARFUMERIE },
//   { name: "Stora Skuggan", value: Brands.STORA_SKUGGAN },
//   { name: "Sultan Pasha Attars", value: Brands.SULTAN_PASHA_ATTARS },
//   { name: "Tauer Perfumes", value: Brands.TAUER_PERFUMES },
//   { name: "The Different Company", value: Brands.THE_DIFFERENT_COMPANY },
//   { name: "The House of Oud", value: Brands.THE_HOUSE_OF_OUD },
//   { name: "The Nue Co.", value: Brands.THE_NUE_CO },
//   { name: "Tom Daxon", value: Brands.TOM_DAXON },
//   { name: "Tom Ford", value: Brands.TOM_FORD },
//   { name: "Versace", value: Brands.VERSACE },
//   { name: "Yves Saint Laurent", value: Brands.YVES_SAINT_LAURENT },
// ];
// export const newBrands = brands.map((brand) => {
//   return {name: brand.name}
// })
