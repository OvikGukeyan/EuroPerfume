import {
  Prisma,
  Languages,
  Gender,
  PerfumeConcentration,
  Brands,
  Notes,
  Types,
  DeliveryTypes,
  ContactForms,
} from "@prisma/client";

export const categories = [
  {
    name: "Perfumes",
    id: 1,
  },
];

export const products: Prisma.ProductCreateManyInput[] = [
  {
    name: "Chanel No. 5",
    imageUrl:
      "https://media.douglas.de/medias/zUsfEz1217085-0-dgl-DE.jpg?context=bWFzdGVyfGltYWdlc3w4Mzg1NnxpbWFnZS9qcGVnfGFHUXdMMmhsTmk4Mk16QTNNelEyT1RnNU1EVTVNQzk2VlhObVJYb3hNakUzTURnMVh6QmZaR2RzTFVSRkxtcHdad3wyYmMxMGVhZGQ5ZjdiNWRjZDMyZDU1Y2QwMTQ4MWY4MzE4NjhkYTJiZjNkODU0MGE3ZTQxOTk4NzA0YWUyYzE4&grid=true&imPolicy=grayScaled&imdensity=1&imwidth=775",
    description: "Chanel No. 5 – это легендарный аромат, который уже более века символизирует изысканную элегантность и неподвластную времени женственность. Его уникальная композиция объединяет свежие цитрусовые и зеленые ноты с насыщенными аккордами цветочных букетов, в которых жасмин и роза играют главные роли. Тонкие нюансы древесных и амбровых оттенков создают ощущение глубины и загадочности, превращая аромат в настоящий шедевр парфюмерного искусства. Этот парфюм – идеальный выбор для тех, кто стремится подчеркнуть свою индивидуальность и безупречный вкус.",
    price: 15,
    available: true,
    gender: Gender.FEMALE,
    concentration: "EAU_DE_PARFUM",
    brand: "CHANEL",
    notes: ["CITRUS", "GREEN"],
    types: ["DESIGNER"],
    releaseYear: 1921,
    categoryId: 1,
  },
  {
    name: "Dior Sauvage",
    imageUrl:
      "https://media.douglas.de/medias/teTvKF1217080-0-dgl-DE.png?context=bWFzdGVyfGltYWdlc3w3OTYzMjN8aW1hZ2UvcG5nfGFHTTRMMmhrWVM4Mk1qQTJNamMxTURRek16TXhNQzkwWlZSMlMwWXhNakUzTURnd1h6QmZaR2RzTFVSRkxuQnVad3w4NTlmNDNkOWI2ODAyODZhOGI1Mjc1ZTFkMDlhNGE1ZmFiNGZmYzU1YThlOWI0ZmQ1MmFlMTRhNjczMjhhNzRm&grid=true&imPolicy=grayScaled&imdensity=1&imwidth=775",
    description: "Dior Sauvage – это современный, смелый и динамичный аромат, созданный для мужчин, ценящих свободу и приключения. Его композиция начинается с ярких цитрусовых аккордов, плавно переходящих в теплые, слегка пряные ноты, которые затем обволакиваются глубокими древесными оттенками. Этот аромат обладает высокой стойкостью и эволюционирует на коже, оставляя за собой незабываемый шлейф, который подчеркивает харизму и уверенность в себе.",
    price: 16,
    available: true,
    gender: Gender.FEMALE,
    concentration: "EAU_DE_TOILETTE",
    brand: "DIOR",
    notes: ["CITRUS", "SPICY"],
    types: ["DESIGNER"],
    releaseYear: 2015,
    categoryId: 1,
  },
  {
    name: "Gucci Bloom",
    imageUrl:
      "https://media.douglas.de/medias/1W3Iiz1206949-0-dgl-DE.jpg?context=bWFzdGVyfGltYWdlc3w3MjQwNHxpbWFnZS9qcGVnfGFETmhMMmczTUM4Mk1qZzJNell4TkRBeE56VTJOaTh4VnpOSmFYb3hNakEyT1RRNVh6QmZaR2RzTFVSRkxtcHdad3w2ZTFjNjA1ZGE1OGY2NjQ4Zjk5NmI5OGUxYWE3NTE2ZmRiYWNmMjcyYjA5NGY5OGU5MjM1ZTgyZTUxY2Y5OGIy",
    description: "Gucci Bloom – это богатый, женственный аромат, который переносит вас в сад свежих, нежных цветов. Его уникальная композиция сочетает яркость и силу цветочных нот с мягкой, романтичной базой, создавая аромат, полный свежести и элегантности. Gucci Bloom идеально подходит для современной женщины, которая ценит утонченность, а его стойкость и насыщенность оставляют долгий, чарующий шлейф.",
    price: 14,
    available: true,
    gender: Gender.FEMALE,
    concentration: "PERFUME",
    brand: "GUCCI",
    notes: ["FLORAL", "MUSK"],
    types: ["CELEBRITY"],
    releaseYear: 2017,
    categoryId: 1,
  },
  {
    name: "Tom Ford Black Orchid",
    imageUrl:
      "https://media.douglas.de/medias/fX36ww289690-0-dgl-DE.jpg?context=bWFzdGVyfGltYWdlc3w4NTg3MHxpbWFnZS9qcGVnfGFEQTVMMmhrTXk4ek5EWTNNVEV5TXpreU1qazNOQzltV0RNMmQzY3lPRGsyT1RCZk1GOWtaMnd0UkVVdWFuQm58OTA0MDJmM2NkYTRmYWY2M2Y4MDAyZTdiNDZkZGY3MmY2OTU2ZmUzODgyZWQ5OWRjYjFjM2I5MTQzYmRiODU0OQ",
    description: "Tom Ford Black Orchid – это роскошный и загадочный аромат, созданный для тех, кто ищет неповторимую экстравагантность. В его композиции чувственные нотки черной орхидеи сочетаются с глубокими, насыщенными оттенками шоколада, специй и древесных нот, создавая атмосферу таинственности и элегантности. Этот аромат – настоящий символ утонченного вкуса и изысканной роскоши.",
    price: 20,
    available: true,
    gender: Gender.FEMALE,
    concentration: "EXTRAIT",
    brand: "TOM_FORD",
    notes: ["ORIENTAL", "MUSK"],
    types: ["NICHE"],
    releaseYear: 2006,
    categoryId: 1,
  },
  {
    name: "YSL Libre",
    imageUrl:
      "https://media.douglas.de/medias/https-media-prod-eu-1.mirakl.net-SOURCE-c25f678b853d40cf8426baeffbc0051a.jpg?context=bWFzdGVyfGltYWdlc3wxMTI5NzB8aW1hZ2UvanBlZ3xhRFV4TDJneFlpODJNekF6TlRrd01qazFNVFExTkM5b2RIUndjem92TDIxbFpHbGhMWEJ5YjJRdFpYVXRNUzV0YVhKaGEyd3VibVYwTDFOUFZWSkRSUzlqTWpWbU5qYzRZamcxTTJRME1HTm1PRFF5Tm1KaFpXWm1ZbU13TURVeFlRfDAzYTIxNjFkYTMzNjg0NTAyZjkxYTIwNmM2MTkyZjM3OGVjMmFmMzg4MjI2MjQ1MjViNGVhNTBlZDhlZDQwMjY",
    description: "YSL Libre – это современный и смелый аромат, который объединяет в себе свежесть и чувственность. Его композиция наполнена яркими цветочными нотами, дополненными свежими цитрусовыми аккордами и теплой базой, создающей впечатление свободы и дерзости. Аромат Libre предназначен для уверенной в себе женщины, которая ценит стиль и индивидуальность.",
    price: 15,
    available: true,
    gender: Gender.FEMALE,
    concentration: "EAU_DE_PARFUM",
    brand: "YSL",
    notes: ["FLORAL", "CITRUS"],
    types: ["DESIGNER"],
    releaseYear: 2019,
    categoryId: 1,
  },
  {
    name: "Versace Eros",
    imageUrl:
      "https://media.douglas.de/medias/Bt0apQ818762-0-dgl-DE.jpg?context=bWFzdGVyfGltYWdlc3wyMjQ5MzJ8aW1hZ2UvanBlZ3xhREEyTDJnNU1TODBPVEF4T1RJeU9UWTJOek0xT0M5Q2REQmhjRkU0TVRnM05qSmZNRjlrWjJ3dFJFVXVhbkJufDE2MzZhOThhNmY0NDU5NzZmODcxNGUzOGJkODNiMTI5YjQ2ZTU4ZGY1NmI0YmQ3MzNjNWEwZTczZjIxZmYzZGU",
    description: "Versace Eros – это страстный и энергичный аромат, который идеально отражает динамику современного мужчины. Композиция аромата построена на ярких и свежих цитрусовых нотах, обогащенных теплыми древесными и пряными аккордами, создающими неповторимый, запоминающийся шлейф. Этот аромат предназначен для тех, кто стремится к свободе, уверен в себе и не боится выделяться из толпы.",
    price: 14,
    available: true,
    gender: Gender.FEMALE,
    concentration: "EAU_DE_TOILETTE",
    brand: "VERSACE",
    notes: ["CITRUS", "WOODY"],
    types: ["CELEBRITY"],
    releaseYear: 2012,
    categoryId: 1,
  },
  {
    name: "Armani Code",
    imageUrl:
      "https://media.douglas.de/medias/VQ1jvL242838-0-global.jpg?context=bWFzdGVyfGltYWdlc3w0ODE3Njl8aW1hZ2UvanBlZ3xhRGd6TDJoaE1DODJNamM0TWpReU9URTJOelkwTmk5V1VURnFka3d5TkRJNE16aGZNRjluYkc5aVlXd3VhbkJufDI1MGFjMDMwNjhjNTFlZjQxY2Q1Yjg4M2VmOTVlYjdmNGFjNzM5ZTk2MWY0YWNkMzE0MTI2MTk3NTU3NzRkMWQ",
    description: "Armani Code – это элегантный и чувственный аромат, который воплощает в себе утонченную гармонию свежести и теплоты. Композиция аромата включает яркие цитрусовые ноты, дополненные пряными аккордами и мягкими древесными оттенками, создавая образ стильного и уверенного в себе мужчины. Этот парфюм подчеркивает индивидуальность и придает дополнительный шарм в любом окружении.",
    price: 16,
    available: true,
    gender: Gender.FEMALE,
    concentration: "EAU_DE_PARFUM",
    brand: "ARMANI",
    notes: ["SPICY", "MUSK"],
    types: ["DESIGNER"],
    releaseYear: 2004,
    categoryId: 1,
  },
  {
    name: "Givenchy Dahlia Divin",
    imageUrl:
      "https://media.douglas.de/medias/83hfnR695892-0-global.jpg?context=bWFzdGVyfGltYWdlc3wyNDA1MTR8aW1hZ2UvanBlZ3xhRE5qTDJnd05DODJNelkwTXpVeE56WXhOakUxT0M4NE0yaG1ibEkyT1RVNE9USmZNRjluYkc5aVlXd3VhbkJufDY2ZmQwNjk5MTI0NGMzNjY5NWUzMzBkMjc1NzViZWJmY2UzYjYyMmZiMTI2YjY2OWY3MTQzNWIzMDFhZjAwN2Q",
    description: "Givenchy Dahlia Divin – это утонченный и изысканный аромат, который рассказывает историю женственности, элегантности и чувственности. Его сложная композиция объединяет в себе свежие цветочные ноты с глубокими и теплыми аккордами, создавая аромат, способный подчеркнуть индивидуальность и изысканный вкус. Этот парфюм оставляет за собой шлейф незабываемых эмоций и является истинным выражением стиля и утонченности.",
    price: 15,
    available: true,
    gender: Gender.FEMALE,
    concentration: "PERFUME",
    brand: "GIVENCHY",
    notes: ["FLORAL", "AQUATIC"],
    types: ["CELEBRITY"],
    releaseYear: 2015,
    categoryId: 1,
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

export const notes: { name: string; value: Notes }[] = [
  {
    name: "Floral",
    value: Notes.FLORAL,
  },
  {
    name: "Citrus",
    value: Notes.CITRUS,
  },
  {
    name: "Green",
    value: Notes.GREEN,
  },
  {
    name: "Fruity",
    value: Notes.FRUITY,
  },
  {
    name: "Spicy",
    value: Notes.SPICY,
  },
  {
    name: "Woody",
    value: Notes.WOODY,
  },
  {
    name: "Oriental",
    value: Notes.ORIENTAL,
  },
  {
    name: "Musk",
    value: Notes.MUSK,
  },
  {
    name: "Aquatic",
    value: Notes.AQUATIC,
  },
];

export const perfumeTypes = [
  {
    name: "Niche",
    value: Types.NICHE,
  },
  {
    name: "Arabian",
    value: Types.ARABIAN,
  },
  {
    name: "Designer",
    value: Types.DESIGNER,
  },
  { name: "Celebrity", value: Types.CELEBRITY },
  { name: "Indie", value: Types.INDIE },
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
 


export const yers = Array.from(
  { length: new Date().getFullYear() - 1990 },
  (_, index) => {
    const year = (index + 1991).toString();
    return { name: year, value: year };
  }
);
