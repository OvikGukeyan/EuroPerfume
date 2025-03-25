import {
  Prisma,
  Languages,
  Gender,
  PerfumeConcentration,
  Brands,
  Notes,
  Classifications,
  DeliveryTypes,
  ContactForms,
  Aromas,
  Purpose,
  Finish,
  Texture,
  Formula,
  Effects,
  ApplicationMethod,
  PackagingFormat,
  SkinType,
} from "@prisma/client";

export const categories = [
  {
    name: "Perfumes",
    id: 1,
  },
  {
    name: "Makeup",
    id: 2,
  },
  {
    name: "Accessories",
    id: 3,
  }
];

export const productGroups = [
  {
    name: 'Sets',
    id: 1
  },
  {
    name: 'Unisex',
    id: 2
  },
  {
    name: 'Women',
    id: 3
  },
  {
    name: 'Men',
    id: 4
  }
]

export const products: Prisma.ProductCreateManyInput[] = [
  {
    name: "Chanel No. 5",
    imageUrl:
      "https://media.douglas.de/medias/zUsfEz1217085-0-dgl-DE.jpg?context=bWFzdGVyfGltYWdlc3w4Mzg1NnxpbWFnZS9qcGVnfGFHUXdMMmhsTmk4Mk16QTNNelEyT1RnNU1EVTVNQzk2VlhObVJYb3hNakUzTURnMVh6QmZaR2RzTFVSRkxtcHdad3wyYmMxMGVhZGQ5ZjdiNWRjZDMyZDU1Y2QwMTQ4MWY4MzE4NjhkYTJiZjNkODU0MGE3ZTQxOTk4NzA0YWUyYzE4&grid=true&imPolicy=grayScaled&imdensity=1&imwidth=775",
    description:
      "Chanel No. 5 – это легендарный аромат, который уже более века символизирует изысканную элегантность и неподвластную времени женственность. Его уникальная композиция объединяет свежие цитрусовые и зеленые ноты с насыщенными аккордами цветочных букетов, в которых жасмин и роза играют главные роли. Тонкие нюансы древесных и амбровых оттенков создают ощущение глубины и загадочности, превращая аромат в настоящий шедевр парфюмерного искусства. Этот парфюм – идеальный выбор для тех, кто стремится подчеркнуть свою индивидуальность и безупречный вкус.",
    price: 15,
    available: true,
    gender: Gender.FEMALE,
    concentration: "EAU_DE_PARFUM",
    brand: "CHANEL",
    topNotes: ["CITRUS"],
    heartNotes: ["GREEN"],
    baseNotes: ["MUSK"],
    releaseYear: 1921,
    classification: ["DESIGNER"],
    aromas: [Aromas.FLORAL],
    brandCountry: "France",
    manufacturingCountry: "France",
    perfumer: "Ernest Beaux",
    categoryId: 1,
    productGroupId: 1,
  },
  {
    name: "Dior Sauvage",
    imageUrl:
      "https://media.douglas.de/medias/teTvKF1217080-0-dgl-DE.png?context=bWFzdGVyfGltYWdlc3w3OTYzMjN8aW1hZ2UvcG5nfGFHTTRMMmhrWVM4Mk1qQTJNamMxTURRek16TXhNQzkwWlZSMlMwWXhNakUzTURnd1h6QmZaR2RzTFVSRkxuQnVad3w4NTlmNDNkOWI2ODAyODZhOGI1Mjc1ZTFkMDlhNGE1ZmFiNGZmYzU1YThlOWI0ZmQ1MmFlMTRhNjczMjhhNzRm",
    description:
      "Dior Sauvage – это современный, смелый и динамичный аромат, созданный для мужчин, ценящих свободу и приключения. Его композиция начинается с ярких цитрусовых аккордов, плавно переходящих в теплые, слегка пряные ноты, которые затем обволакиваются глубокими древесными оттенками. Этот аромат обладает высокой стойкостью и эволюционирует на коже, оставляя за собой незабываемый шлейф, который подчеркивает харизму и уверенность в себе.",
    price: 16,
    available: true,
    gender: Gender.FEMALE,
    concentration: "EAU_DE_TOILETTE",
    brand: "DIOR",
    topNotes: ["CITRUS"],
    heartNotes: ["SPICY"],
    baseNotes: ["WOODY"],
    releaseYear: 2015,
    classification: ["DESIGNER"],
    aromas: [Aromas.ORIENTAL],
    brandCountry: "France",
    manufacturingCountry: "France",
    perfumer: "Francois Demachy",
    categoryId: 1,
    productGroupId: 1,
  },
  {
    name: "Gucci Bloom",
    imageUrl:
      "https://media.douglas.de/medias/1W3Iiz1206949-0-dgl-DE.jpg?context=bWFzdGVyfGltYWdlc3w3MjQwNHxpbWFnZS9qcGVnfGFETmhMMmczTUM4Mk1qZzJNell4TkRBeE56VTJOaTh4VnpOSmFYb3hNakEyT1RRNVh6QmZaR2RzTFVSRkxtcHdad3w2ZTFjNjA1ZGE1OGY2NjQ4Zjk5NmI5OGUxYWE3NTE2ZmRiYWNmMjcyYjA5NGY5OGU5MjM1ZTgyZTUxY2Y5OGIy",
    description:
      "Gucci Bloom – это богатый, женственный аромат, который переносит вас в сад свежих, нежных цветов. Его уникальная композиция сочетает яркость и силу цветочных нот с мягкой, романтичной базой, создавая аромат, полный свежести и элегантности. Gucci Bloom идеально подходит для современной женщины, которая ценит утонченность, а его стойкость и насыщенность оставляют долгий, чарующий шлейф.",
    price: 14,
    available: true,
    gender: Gender.FEMALE,
    concentration: "PERFUME",
    brand: "GUCCI",
    topNotes: ["FLORAL"],
    heartNotes: ["MUSK"],
    baseNotes: ["AQUATIC"],
    releaseYear: 2017,
    classification: ["CELEBRITY"],
    aromas: [Aromas.FLORAL],
    brandCountry: "Italy",
    manufacturingCountry: "Italy",
    perfumer: "Alessandro Michele",
    categoryId: 1,
    productGroupId: 1,
  },
  {
    name: "Tom Ford Black Orchid",
    imageUrl:
      "https://media.douglas.de/medias/fX36ww289690-0-dgl-DE.jpg?context=bWFzdGVyfGltYWdlc3w4NTg3MHxpbWFnZS9qcGVnfGFEQTVMMmhrTXk4ek5EWTNNVEV5TXpreU1qazNOQzltV0RNMmQzY3lPRGsyT1RCZk1GOWtaMnd0UkVVdWFuQm58OTA0MDJmM2NkYTRmYWY2M2Y4MDAyZTdiNDZkZGY3MmY2OTU2ZmUzODgyZWQ5OWRjYjFjM2I5MTQzYmRiODU0OQ",
    description:
      "Tom Ford Black Orchid – это роскошный и загадочный аромат, созданный для тех, кто ищет неповторимую экстравагантность. В его композиции чувственные нотки черной орхидеи сочетаются с глубокими, насыщенными оттенками шоколада, специй и древесных нот, создавая атмосферу таинственности и элегантности. Этот аромат – настоящий символ утонченного вкуса и изысканной роскоши.",
    price: 20,
    available: true,
    gender: Gender.FEMALE,
    concentration: "EXTRAIT",
    brand: "TOM_FORD",
    topNotes: ["ORIENTAL"],
    heartNotes: ["MUSK"],
    baseNotes: ["FLORAL"],
    releaseYear: 2006,
    classification: ["NICHE"],
    aromas: [Aromas.ORIENTAL],
    brandCountry: "USA",
    manufacturingCountry: "USA",
    perfumer: "Tom Ford",
    categoryId: 1,
    productGroupId: 1,
  },
  {
    name: "YSL Libre",
    imageUrl:
      "https://media.douglas.de/medias/https-media-prod-eu-1.mirakl.net-SOURCE-c25f678b853d40cf8426baeffbc0051a.jpg?context=bWFzdGVyfGltYWdlc3wxMTI5NzB8aW1hZ2UvanBlZ3xhRFV4TDJneFlpODJNekF6TlRrd01qazFNVFExTkM5b2RIUndjem92TDIxbFpHbGhMWEJ5YjJRdFpYVXRNUzV0YVhKaGEyd3VibVYwTDFOUFZWSkRSUzlqTWpWbU5qYzRZamcxTTJRME1HTm1PRFF5Tm1KaFpXWm1ZbU13TURVeFlRfDAzYTIxNjFkYTMzNjg0NTAyZjkxYTIwNmM2MTkyZjM3OGVjMmFmMzg4MjI2MjQ1MjViNGVhNTBlZDhlZDQwMjY",
    description:
      "YSL Libre – это современный и смелый аромат, который объединяет в себе свежесть и чувственность. Его композиция наполнена яркими цветочными нотами, дополненными свежими цитрусовыми аккордами и теплой базой, создающей впечатление свободы и дерзости. Аромат Libre предназначен для уверенной в себе женщины, которая ценит стиль и индивидуальность.",
    price: 15,
    available: true,
    gender: Gender.FEMALE,
    concentration: "EAU_DE_PARFUM",
    brand: "YSL",
    topNotes: ["FLORAL"],
    heartNotes: ["CITRUS"],
    baseNotes: ["FLORAL"],
    releaseYear: 2019,
    classification: ["DESIGNER"],
    aromas: [Aromas.FLORAL],
    brandCountry: "France",
    manufacturingCountry: "France",
    perfumer: "Anne Flipo",
    categoryId: 1,
    productGroupId: 1,
  },
  {
    name: "Versace Eros",
    imageUrl:
      "https://media.douglas.de/medias/Bt0apQ818762-0-dgl-DE.jpg?context=bWFzdGVyfGltYWdlc3wyMjQ5MzJ8aW1hZ2UvanBlZ3xhREEyTDJnNU1TODBPVEF4T1RJeU9UWTJOek0xT0M5Q2REQmhjRkU0TVRnM05qSmZNRjlrWjJ3dFJFVXVhbkJufDE2MzZhOThhNmY0NDU5NzZmODcxNGUzOGJkODNiMTI5YjQ2ZTU4ZGY1NmI0YmQ3MzNjNWEwZTczZjIxZmYzZGU",
    description:
      "Versace Eros – это страстный и энергичный аромат, который идеально отражает динамику современного мужчины. Композиция аромата построена на ярких и свежих цитрусовых нотах, обогащенных теплыми древесными и пряными аккордами, создающими неповторимый, запоминающийся шлейф. Этот аромат предназначен для тех, кто стремится к свободе, уверен в себе и не боится выделяться из толпы.",
    price: 14,
    available: true,
    gender: Gender.FEMALE,
    concentration: "EAU_DE_TOILETTE",
    brand: "VERSACE",
    topNotes: ["CITRUS"],
    heartNotes: ["WOODY"],
    baseNotes: ["SPICY"],
    releaseYear: 2012,
    classification: ["CELEBRITY"],
    aromas: [Aromas.ORIENTAL],
    brandCountry: "Italy",
    manufacturingCountry: "Italy",
    perfumer: "Versace Perfumer",
    categoryId: 1,
    productGroupId: 1,
  },
  {
    name: "Armani Code",
    imageUrl:
      "https://media.douglas.de/medias/VQ1jvL242838-0-global.jpg?context=bWFzdGVyfGltYWdlc3w0ODE3Njl8aW1hZ2UvanBlZ3xhRGd6TDJoaE1DODJNamM0TWpReU9URTJOelkwTmk5V1VURnFka3d5TkRJNE16aGZNRjluYkc5aVlXd3VhbkJufDI1MGFjMDMwNjhjNTFlZjQxY2Q1Yjg4M2VmOTVlYjdmNGFjNzM5ZTk2MWY0YWNkMzE0MTI2MTk3NTU3NzRkMWQ",
    description:
      "Armani Code – это элегантный и чувственный аромат, который воплощает в себе утонченную гармонию свежести и теплоты. Композиция аромата включает яркие цитрусовые ноты, дополненные пряными аккордами и мягкими древесными оттенками, создавая образ стильного и уверенного в себе мужчины. Этот парфюм подчеркивает индивидуальность и придает дополнительный шарм в любом окружении.",
    price: 16,
    available: true,
    gender: Gender.FEMALE,
    concentration: "EAU_DE_PARFUM",
    brand: "ARMANI",
    topNotes: ["CITRUS"],
    heartNotes: ["SPICY"],
    baseNotes: ["MUSK"],
    releaseYear: 2004,
    classification: ["DESIGNER"],
    aromas: [Aromas.ORIENTAL],
    brandCountry: "Italy",
    manufacturingCountry: "Italy",
    perfumer: "Armani",
    categoryId: 1,
    productGroupId: 1,
  },
  {
    name: "Givenchy Dahlia Divin",
    imageUrl:
      "https://media.douglas.de/medias/83hfnR695892-0-global.jpg?context=bWFzdGVyfGltYWdlc3wyNDA1MTR8aW1hZ2UvanBlZ3xhRE5qTDJnd05DODJNelkwTXpVeE56WXhOakUxT0M4NE0yaG1ibEkyT1RVNE9USmZNRjluYkc5aVlXd3VhbkJufDY2ZmQwNjk5MTI0NGMzNjY5NWUzMzBkMjc1NzViZWJmY2UzYjYyMmZiMTI2YjY2OWY3MTQzNWIzMDFhZjAwN2Q",
    description:
      "Givenchy Dahlia Divin – это утонченный и изысканный аромат, который рассказывает историю женственности, элегантности и чувственности. Его сложная композиция объединяет в себе свежие цветочные ноты с глубокими и теплыми аккордами, создавая аромат, способный подчеркнуть индивидуальность и изысканный вкус. Этот парфюм оставляет за собой шлейф незабываемых эмоций и является истинным выражением стиля и утонченности.",
    price: 15,
    available: true,
    gender: Gender.FEMALE,
    concentration: "PERFUME",
    brand: "GIVENCHY",
    topNotes: ["FLORAL"],
    heartNotes: ["AQUATIC"],
    baseNotes: ["FLORAL"],
    releaseYear: 2015,
    classification: ["CELEBRITY"],
    aromas: [Aromas.ORIENTAL],
    brandCountry: "France",
    manufacturingCountry: "France",
    perfumer: "Givenchy Perfumer",
    categoryId: 1,
    productGroupId: 1,
  },
];

export const productTranslations: Prisma.ProductTranslationCreateManyInput[] = [
  // Chanel No. 5 (productId: 1)
  {
    language: Languages.DE,
    description:
      "Das Eau de Parfum Born In Roma Donna von Valentino ist eine florientale Haute-Couture-Komposition von höchster Eleganz. Der Duft besticht durch die luxuriöse Kombination dreier femininer Jasmin-Noten, veredelt durch kostbare Bourbon-Vanille. Ein Trio aus warmen Hölzern verleiht dem Duft eine raffinierte Note, die noch lange nachhallt und inspiriert ist von der römischen Kultur. Als Hommage an die Architektur der Ewigen Stadt wurde der Flakon mit der legendären Valentino-Niete verziert – denn wie der Duft wurde auch das italienische Modehaus in Rom geboren.",
    productId: 1,
  },
  {
    language: Languages.RU,
    description: "Классический парфюм Chanel No. 5.",
    productId: 1,
  },
  // Dior Sauvage (productId: 2)
  {
    language: Languages.DE,
    description: "Ein frischer und würziger Duft von Dior Sauvage.",
    productId: 2,
  },
  {
    language: Languages.RU,
    description: "Свежий и пряный аромат Dior Sauvage.",
    productId: 2,
  },
  // Gucci Bloom (productId: 3)
  {
    language: Languages.DE,
    description: "Ein blumiger und eleganter Duft von Gucci Bloom.",
    productId: 3,
  },
  {
    language: Languages.RU,
    description: "Цветочный и элегантный аромат Gucci Bloom.",
    productId: 3,
  },
  // Tom Ford Black Orchid (productId: 4)
  {
    language: Languages.DE,
    description: "Ein opulenter und luxuriöser Duft von Tom Ford Black Orchid.",
    productId: 4,
  },
  {
    language: Languages.RU,
    description: "Роскошный и элегантный аромат Tom Ford Black Orchid.",
    productId: 4,
  },
  // YSL Libre (productId: 5)
  {
    language: Languages.DE,
    description: "Ein mutiger und blumiger Duft von YSL Libre.",
    productId: 5,
  },
  {
    language: Languages.RU,
    description: "Смелый и цветочный аромат YSL Libre.",
    productId: 5,
  },
  // Versace Eros (productId: 6)
  {
    language: Languages.DE,
    description: "Ein intensiver und frischer Duft von Versace Eros.",
    productId: 6,
  },
  {
    language: Languages.RU,
    description: "Интенсивный и свежий аромат Versace Eros.",
    productId: 6,
  },
  // Armani Code (productId: 7)
  {
    language: Languages.DE,
    description: "Ein eleganter und sinnlicher Duft von Armani Code.",
    productId: 7,
  },
  {
    language: Languages.RU,
    description: "Элегантный и чувственный аромат Armani Code.",
    productId: 7,
  },
  // Givenchy Dahlia Divin (productId: 8)
  {
    language: Languages.DE,
    description:
      "Ein femininer und strahlender Duft von Givenchy Dahlia Divin.",
    productId: 8,
  },
  {
    language: Languages.RU,
    description: "Женственный и сияющий аромат Givenchy Dahlia Divin.",
    productId: 8,
  },
];

export const genders = [
  {
    name: "Male",
    value: Gender.MALE,
  },
  {
    name: "Female",
    value: Gender.FEMALE,
  },
  {
    name: "Unisex",
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

export const brands = [
  {
    name: "Chanel",
    value: Brands.CHANEL,
  },
  {
    name: "Dior",
    value: Brands.DIOR,
  },
  {
    name: "Gucci",
    value: Brands.GUCCI,
  },
  {
    name: "Tom Ford",
    value: Brands.TOM_FORD,
  },
  {
    name: "Yves Saint Laurent",
    value: Brands.YSL,
  },
  {
    name: "Versace",
    value: Brands.VERSACE,
  },
  {
    name: "Armani",
    value: Brands.ARMANI,
  },
  {
    name: "Givenchy",
    value: Brands.GIVENCHY,
  },
  {
    name: "Calvin Klein",
    value: Brands.CALVIN_KLEIN,
  },
  {
    name: "Louis Vuitton",
    value: Brands.LOUIS_VUITTON,
  },
];



export const classifications: { value: Classifications; label: { ru: string; de: string } }[] = [
  { value: Classifications.PROFESSIONAL, label: { ru: "Профессиональная", de: "Professionell" } },
  { value: Classifications.LUXURY, label: { ru: "Люкс", de: "Luxus" } },
  { value: Classifications.MASS_MARKET, label: { ru: "Масс-маркет", de: "Mass Market" } },
  { value: Classifications.NICHE, label: { ru: "Ниша", de: "Nische" } },
  { value: Classifications.ARABIAN, label: { ru: "Арабский", de: "Arabisch" } },
  { value: Classifications.DESIGNER, label: { ru: "Дизайнерский", de: "Designer" } },
  { value: Classifications.CELEBRITY, label: { ru: "Селебрити", de: "Celebrity" } },
  { value: Classifications.INDIE, label: { ru: "Инди", de: "Indie" } },
];

export const deliveryTypes = [
  {
    name: 'Großbrief',
    value: DeliveryTypes.GB,
    price: 3
  },

  {
    name: 'Einschreiben',
    value: DeliveryTypes.ES,
    price: 5
  },
  {
    name: 'Paket bis Haftung',
    value: DeliveryTypes.PBH,
    price: 6.2
  }
]

export const purposes: { value: Purpose; label: { ru: string; de: string } }[] = [
  { value: Purpose.FACE, label: { ru: "Для лица", de: "Für das Gesicht" } },
  { value: Purpose.EYES, label: { ru: "Для глаз", de: "Für die Augen" } },
  { value: Purpose.LIPS, label: { ru: "Для губ", de: "Für die Lippen" } },
  { value: Purpose.BODY, label: { ru: "Для тела", de: "Für den Körper" } },
];

export const finishes: { value: Finish; label: { ru: string; de: string } }[] = [
  { value: Finish.MATTE, label: { ru: "Матовый", de: "Matt" } },
  { value: Finish.GLOSSY, label: { ru: "Глянцевый", de: "Glänzend" } },
  { value: Finish.SATIN, label: { ru: "Сатиновый", de: "Satin" } },
  { value: Finish.METALLIC, label: { ru: "Металлик", de: "Metallic" } },
  { value: Finish.SHIMMER, label: { ru: "Шиммер", de: "Schimmernd" } },
];

export const textures: { value: Texture; label: { ru: string; de: string } }[] = [
  { value: Texture.CREAMY, label: { ru: "Кремовая", de: "Cremig" } },
  { value: Texture.GEL, label: { ru: "Гелевая", de: "Gelartig" } },
  { value: Texture.POWDERY, label: { ru: "Пудровая", de: "Pudrig" } },
  { value: Texture.LIQUID, label: { ru: "Жидкая", de: "Flüssig" } },
];

export const formulas: { value: Formula; label: { ru: string; de: string } }[] = [
  { value: Formula.LONG_LASTING, label: { ru: "Стойкая", de: "Langanhaltend" } },
  { value: Formula.HYDRATING, label: { ru: "Увлажняющая", de: "Feuchtigkeitsspendend" } },
  { value: Formula.LIGHT, label: { ru: "Легкая", de: "Leicht" } },
  { value: Formula.WATERPROOF, label: { ru: "Водостойкая", de: "Wasserfest" } },
  { value: Formula.NON_COMEDOGENIC, label: { ru: "Некомедогенная", de: "Nicht komedogen" } },
];

export const effects: { value: Effects; label: { ru: string; de: string } }[] = [
  { value: Effects.HYDRATING, label: { ru: "Увлажняет", de: "Spendet Feuchtigkeit" } },
  { value: Effects.VOLUMIZING, label: { ru: "Придаёт объём", de: "Verleiht Volumen" } },
  { value: Effects.TONE_BALANCING, label: { ru: "Выравнивает тон", de: "Gleicht den Teint aus" } },
  { value: Effects.DEFINING, label: { ru: "Подчеркивает форму", de: "Betont Konturen" } },
  { value: Effects.SMOOTHING, label: { ru: "Сглаживает", de: "Glättet" } },
  { value: Effects.MATIFYING, label: { ru: "Матирует", de: "Mattiert" } },
  { value: Effects.ILLUMINATING, label: { ru: "Придаёт сияние", de: "Verleiht Strahlkraft" } },
  { value: Effects.ANTIAGING, label: { ru: "Антивозрастной", de: "Anti-Aging" } },
];

export const applicationMethods: { value: ApplicationMethod; label: { ru: string; de: string } }[] = [
  { value: ApplicationMethod.BRUSH, label: { ru: "Кисть", de: "Pinsel" } },
  { value: ApplicationMethod.APPLICATOR, label: { ru: "Аппликатор", de: "Applikator" } },
  { value: ApplicationMethod.FINGERS, label: { ru: "Пальцами", de: "Mit den Fingern" } },
  { value: ApplicationMethod.BOTTLE, label: { ru: "Из флакона", de: "Aus dem Flakon" } },
  { value: ApplicationMethod.PENCIL, label: { ru: "Карандаш", de: "Stift" } },
];

export const packagingFormats: { value: PackagingFormat; label: { ru: string; de: string } }[] = [
  { value: PackagingFormat.STICK, label: { ru: "Стик", de: "Stick" } },
  { value: PackagingFormat.PENCIL, label: { ru: "Карандаш", de: "Stift" } },
  { value: PackagingFormat.TUBE, label: { ru: "Тюбик", de: "Tube" } },
  { value: PackagingFormat.BOTTLE, label: { ru: "Флакон", de: "Flakon" } },
  { value: PackagingFormat.JAR, label: { ru: "Баночка", de: "Dose" } },
];

export const skinTypes: { value: SkinType; label: { ru: string; de: string } }[] = [
  { value: SkinType.ALL, label: { ru: "Для всех типов", de: "Für alle Hauttypen" } },
  { value: SkinType.DRY, label: { ru: "Сухая", de: "Trocken" } },
  { value: SkinType.OILY, label: { ru: "Жирная", de: "Ölig" } },
  { value: SkinType.SENSITIVE, label: { ru: "Чувствительная", de: "Empfindlich" } },
];


export type DeliveryTypesType = typeof deliveryTypes;

export const contactForms = [
  { name: 'Whats App',
    value: ContactForms.WA
  },
  {
    name: 'Telegram',
    value: ContactForms.TG
  },
  {
    name: 'Viber',
    value: ContactForms.VB
  }
]

export type ContactFormsType = typeof contactForms
 
export const notes: { value: Notes; label: { ru: string; de: string } }[] = [
  {
    value: Notes.FLORAL,
    label: { ru: "Цветочный", de: "Blumig" },
  },
  {
    value: Notes.CITRUS,
    label: { ru: "Цитрусовый", de: "Zitrus" },
  },
  {
    value: Notes.GREEN,
    label: { ru: "Зелёный", de: "Grün" },
  },
  {
    value: Notes.FRUITY,
    label: { ru: "Фруктовый", de: "Fruchtig" },
  },
  {
    value: Notes.SPICY,
    label: { ru: "Пряный", de: "Würzig" },
  },
  {
    value: Notes.WOODY,
    label: { ru: "Древесный", de: "Holzig" },
  },
  {
    value: Notes.ORIENTAL,
    label: { ru: "Восточный", de: "Oriental" },
  },
  {
    value: Notes.MUSK,
    label: { ru: "Мускусный", de: "Moschus" },
  },
  {
    value: Notes.AQUATIC,
    label: { ru: "Водный", de: "Aquatisch" },
  },
];

export const perfumeAromas: { value: Aromas; label: { ru: string; de: string } }[] = [
  {
    value: Aromas.FOUGERE,
    label: { ru: "Фужерный", de: "Fougère" },
  },
  {
    value: Aromas.WOODY,
    label: { ru: "Древесный", de: "Holzig" },
  },
  {
    value: Aromas.ORIENTAL,
    label: { ru: "Восточный", de: "Oriental" },
  },
  {
    value: Aromas.FLORAL,
    label: { ru: "Цветочный", de: "Blumig" },
  },
  {
    value: Aromas.CITRUS,
    label: { ru: "Цитрусовый", de: "Zitrus" },
  },
  {
    value: Aromas.CHYPRE,
    label: { ru: "Шипровый", de: "Chypre" },
  },
  {
    value: Aromas.LEATHER,
    label: { ru: "Кожаный", de: "Leder" },
  },
  {
    value: Aromas.AQUATIC,
    label: { ru: "Водный", de: "Aquatisch" },
  },
  {
    value: Aromas.GREEN,
    label: { ru: "Зелёный", de: "Grün" },
  },
  {
    value: Aromas.GOURMAND,
    label: { ru: "Гурманский", de: "Gourmand" },
  },
];
export type AromasType = typeof perfumeAromas


export const yers = Array.from(
  { length: new Date().getFullYear() - 1990 },
  (_, index) => {
    const year = (index + 1991).toString();
    return { name: year, value: year };
  }
);


