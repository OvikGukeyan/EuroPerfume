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
  },
];

export const productGroups = [
  {
    name: "Unisex",
    id: 1,
    categoryId: 1,
  },
  {
    name: "Women",
    id: 2,
    categoryId: 1,
  },
  {
    name: "Men",
    id: 3,
    categoryId: 1,
  },
  {
    name: "Atomizers",
    id: 4,
    categoryId: 1,
  },
  {
    name: 'All Makeups',
    id: 5,
    categoryId: 2
  }
];

export const products: Prisma.ProductCreateManyInput[] = [
  {
    name: "Chanel No. 5",
    imageUrl: [
      "https://media.douglas.de/medias/zUsfEz1217085-0-dgl-DE.jpg?context=bWFzdGVyfGltYWdlc3w4Mzg1NnxpbWFnZS9qcGVnfGFHUXdMMmhsTmk4Mk16QTNNelEyT1RnNU1EVTVNQzk2VlhObVJYb3hNakUzTURnMVh6QmZaR2RzTFVSRkxtcHdad3wyYmMxMGVhZGQ5ZjdiNWRjZDMyZDU1Y2QwMTQ4MWY4MzE4NjhkYTJiZjNkODU0MGE3ZTQxOTk4NzA0YWUyYzE4&grid=true&imPolicy=grayScaled&imdensity=1&imwidth=775",
      "https://media.douglas.de/medias/zUsfEz1217085-0-dgl-DE.jpg?context=bWFzdGVyfGltYWdlc3w4Mzg1NnxpbWFnZS9qcGVnfGFHUXdMMmhsTmk4Mk16QTNNelEyT1RnNU1EVTVNQzk2VlhObVJYb3hNakUzTURnMVh6QmZaR2RzTFVSRkxtcHdad3wyYmMxMGVhZGQ5ZjdiNWRjZDMyZDU1Y2QwMTQ4MWY4MzE4NjhkYTJiZjNkODU0MGE3ZTQxOTk4NzA0YWUyYzE4&grid=true&imPolicy=grayScaled&imdensity=1&imwidth=775",
      "https://media.douglas.de/medias/zUsfEz1217085-0-dgl-DE.jpg?context=bWFzdGVyfGltYWdlc3w4Mzg1NnxpbWFnZS9qcGVnfGFHUXdMMmhsTmk4Mk16QTNNelEyT1RnNU1EVTVNQzk2VlhObVJYb3hNakUzTURnMVh6QmZaR2RzTFVSRkxtcHdad3wyYmMxMGVhZGQ5ZjdiNWRjZDMyZDU1Y2QwMTQ4MWY4MzE4NjhkYTJiZjNkODU0MGE3ZTQxOTk4NzA0YWUyYzE4&grid=true&imPolicy=grayScaled&imdensity=1&imwidth=775",
    ],
    description:
      "Chanel No. 5 – это легендарный аромат, который уже более века символизирует изысканную элегантность и неподвластную времени женственность. Его уникальная композиция объединяет свежие цитрусовые и зеленые ноты с насыщенными аккордами цветочных букетов, в которых жасмин и роза играют главные роли. Тонкие нюансы древесных и амбровых оттенков создают ощущение глубины и загадочности, превращая аромат в настоящий шедевр парфюмерного искусства. Этот парфюм – идеальный выбор для тех, кто стремится подчеркнуть свою индивидуальность и безупречный вкус.",
    price: 5,
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
    imageUrl: [
      "https://media.douglas.de/medias/teTvKF1217080-0-dgl-DE.png?context=bWFzdGVyfGltYWdlc3w3OTYzMjN8aW1hZ2UvcG5nfGFHTTRMMmhrWVM4Mk1qQTJNamMxTURRek16TXhNQzkwWlZSMlMwWXhNakUzTURnd1h6QmZaR2RzTFVSRkxuQnVad3w4NTlmNDNkOWI2ODAyODZhOGI1Mjc1ZTFkMDlhNGE1ZmFiNGZmYzU1YThlOWI0ZmQ1MmFlMTRhNjczMjhhNzRm",
      "https://media.douglas.de/medias/teTvKF1217080-0-dgl-DE.png?context=bWFzdGVyfGltYWdlc3w3OTYzMjN8aW1hZ2UvcG5nfGFHTTRMMmhrWVM4Mk1qQTJNamMxTURRek16TXhNQzkwWlZSMlMwWXhNakUzTURnd1h6QmZaR2RzTFVSRkxuQnVad3w4NTlmNDNkOWI2ODAyODZhOGI1Mjc1ZTFkMDlhNGE1ZmFiNGZmYzU1YThlOWI0ZmQ1MmFlMTRhNjczMjhhNzRm",
      "https://media.douglas.de/medias/teTvKF1217080-0-dgl-DE.png?context=bWFzdGVyfGltYWdlc3w3OTYzMjN8aW1hZ2UvcG5nfGFHTTRMMmhrWVM4Mk1qQTJNamMxTURRek16TXhNQzkwWlZSMlMwWXhNakUzTURnd1h6QmZaR2RzTFVSRkxuQnVad3w4NTlmNDNkOWI2ODAyODZhOGI1Mjc1ZTFkMDlhNGE1ZmFiNGZmYzU1YThlOWI0ZmQ1MmFlMTRhNjczMjhhNzRm",
    ],
    description:
      "Dior Sauvage – это современный, смелый и динамичный аромат, созданный для мужчин, ценящих свободу и приключения. Его композиция начинается с ярких цитрусовых аккордов, плавно переходящих в теплые, слегка пряные ноты, которые затем обволакиваются глубокими древесными оттенками. Этот аромат обладает высокой стойкостью и эволюционирует на коже, оставляя за собой незабываемый шлейф, который подчеркивает харизму и уверенность в себе.",
    price: 6,
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
    imageUrl: [
      "https://media.douglas.de/medias/1W3Iiz1206949-0-dgl-DE.jpg?context=bWFzdGVyfGltYWdlc3w3MjQwNHxpbWFnZS9qcGVnfGFETmhMMmczTUM4Mk1qZzJNell4TkRBeE56VTJOaTh4VnpOSmFYb3hNakEyT1RRNVh6QmZaR2RzTFVSRkxtcHdad3w2ZTFjNjA1ZGE1OGY2NjQ4Zjk5NmI5OGUxYWE3NTE2ZmRiYWNmMjcyYjA5NGY5OGU5MjM1ZTgyZTUxY2Y5OGIy",
      "https://media.douglas.de/medias/1W3Iiz1206949-0-dgl-DE.jpg?context=bWFzdGVyfGltYWdlc3w3MjQwNHxpbWFnZS9qcGVnfGFETmhMMmczTUM4Mk1qZzJNell4TkRBeE56VTJOaTh4VnpOSmFYb3hNakEyT1RRNVh6QmZaR2RzTFVSRkxtcHdad3w2ZTFjNjA1ZGE1OGY2NjQ4Zjk5NmI5OGUxYWE3NTE2ZmRiYWNmMjcyYjA5NGY5OGU5MjM1ZTgyZTUxY2Y5OGIy",
      "https://media.douglas.de/medias/1W3Iiz1206949-0-dgl-DE.jpg?context=bWFzdGVyfGltYWdlc3w3MjQwNHxpbWFnZS9qcGVnfGFETmhMMmczTUM4Mk1qZzJNell4TkRBeE56VTJOaTh4VnpOSmFYb3hNakEyT1RRNVh6QmZaR2RzTFVSRkxtcHdad3w2ZTFjNjA1ZGE1OGY2NjQ4Zjk5NmI5OGUxYWE3NTE2ZmRiYWNmMjcyYjA5NGY5OGU5MjM1ZTgyZTUxY2Y5OGIy",
    ],
    description:
      "Gucci Bloom – это богатый, женственный аромат, который переносит вас в сад свежих, нежных цветов. Его уникальная композиция сочетает яркость и силу цветочных нот с мягкой, романтичной базой, создавая аромат, полный свежести и элегантности. Gucci Bloom идеально подходит для современной женщины, которая ценит утонченность, а его стойкость и насыщенность оставляют долгий, чарующий шлейф.",
    price: 9,
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
    imageUrl: [
      "https://media.douglas.de/medias/fX36ww289690-0-dgl-DE.jpg?context=bWFzdGVyfGltYWdlc3w4NTg3MHxpbWFnZS9qcGVnfGFEQTVMMmhrTXk4ek5EWTNNVEV5TXpreU1qazNOQzltV0RNMmQzY3lPRGsyT1RCZk1GOWtaMnd0UkVVdWFuQm58OTA0MDJmM2NkYTRmYWY2M2Y4MDAyZTdiNDZkZGY3MmY2OTU2ZmUzODgyZWQ5OWRjYjFjM2I5MTQzYmRiODU0OQ",
      "https://media.douglas.de/medias/fX36ww289690-0-dgl-DE.jpg?context=bWFzdGVyfGltYWdlc3w4NTg3MHxpbWFnZS9qcGVnfGFEQTVMMmhrTXk4ek5EWTNNVEV5TXpreU1qazNOQzltV0RNMmQzY3lPRGsyT1RCZk1GOWtaMnd0UkVVdWFuQm58OTA0MDJmM2NkYTRmYWY2M2Y4MDAyZTdiNDZkZGY3MmY2OTU2ZmUzODgyZWQ5OWRjYjFjM2I5MTQzYmRiODU0OQ",
      "https://media.douglas.de/medias/fX36ww289690-0-dgl-DE.jpg?context=bWFzdGVyfGltYWdlc3w4NTg3MHxpbWFnZS9qcGVnfGFEQTVMMmhrTXk4ek5EWTNNVEV5TXpreU1qazNOQzltV0RNMmQzY3lPRGsyT1RCZk1GOWtaMnd0UkVVdWFuQm58OTA0MDJmM2NkYTRmYWY2M2Y4MDAyZTdiNDZkZGY3MmY2OTU2ZmUzODgyZWQ5OWRjYjFjM2I5MTQzYmRiODU0OQ"
    ],
    description:
      "Tom Ford Black Orchid – это роскошный и загадочный аромат, созданный для тех, кто ищет неповторимую экстравагантность. В его композиции чувственные нотки черной орхидеи сочетаются с глубокими, насыщенными оттенками шоколада, специй и древесных нот, создавая атмосферу таинственности и элегантности. Этот аромат – настоящий символ утонченного вкуса и изысканной роскоши.",
    price: 10,
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
    imageUrl: [
      "https://media.douglas.de/medias/https-media-prod-eu-1.mirakl.net-SOURCE-c25f678b853d40cf8426baeffbc0051a.jpg?context=bWFzdGVyfGltYWdlc3wxMTI5NzB8aW1hZ2UvanBlZ3xhRFV4TDJneFlpODJNekF6TlRrd01qazFNVFExTkM5b2RIUndjem92TDIxbFpHbGhMWEJ5YjJRdFpYVXRNUzV0YVhKaGEyd3VibVYwTDFOUFZWSkRSUzlqTWpWbU5qYzRZamcxTTJRME1HTm1PRFF5Tm1KaFpXWm1ZbU13TURVeFlRfDAzYTIxNjFkYTMzNjg0NTAyZjkxYTIwNmM2MTkyZjM3OGVjMmFmMzg4MjI2MjQ1MjViNGVhNTBlZDhlZDQwMjY",
      "https://media.douglas.de/medias/https-media-prod-eu-1.mirakl.net-SOURCE-c25f678b853d40cf8426baeffbc0051a.jpg?context=bWFzdGVyfGltYWdlc3wxMTI5NzB8aW1hZ2UvanBlZ3xhRFV4TDJneFlpODJNekF6TlRrd01qazFNVFExTkM5b2RIUndjem92TDIxbFpHbGhMWEJ5YjJRdFpYVXRNUzV0YVhKaGEyd3VibVYwTDFOUFZWSkRSUzlqTWpWbU5qYzRZamcxTTJRME1HTm1PRFF5Tm1KaFpXWm1ZbU13TURVeFlRfDAzYTIxNjFkYTMzNjg0NTAyZjkxYTIwNmM2MTkyZjM3OGVjMmFmMzg4MjI2MjQ1MjViNGVhNTBlZDhlZDQwMjY",
      "https://media.douglas.de/medias/https-media-prod-eu-1.mirakl.net-SOURCE-c25f678b853d40cf8426baeffbc0051a.jpg?context=bWFzdGVyfGltYWdlc3wxMTI5NzB8aW1hZ2UvanBlZ3xhRFV4TDJneFlpODJNekF6TlRrd01qazFNVFExTkM5b2RIUndjem92TDIxbFpHbGhMWEJ5YjJRdFpYVXRNUzV0YVhKaGEyd3VibVYwTDFOUFZWSkRSUzlqTWpWbU5qYzRZamcxTTJRME1HTm1PRFF5Tm1KaFpXWm1ZbU13TURVeFlRfDAzYTIxNjFkYTMzNjg0NTAyZjkxYTIwNmM2MTkyZjM3OGVjMmFmMzg4MjI2MjQ1MjViNGVhNTBlZDhlZDQwMjY",
    ],
    description:
      "YSL Libre – это современный и смелый аромат, который объединяет в себе свежесть и чувственность. Его композиция наполнена яркими цветочными нотами, дополненными свежими цитрусовыми аккордами и теплой базой, создающей впечатление свободы и дерзости. Аромат Libre предназначен для уверенной в себе женщины, которая ценит стиль и индивидуальность.",
    price: 5,
    available: true,
    gender: Gender.FEMALE,
    concentration: "EAU_DE_PARFUM",
    brand: "YVES_SAINT_LAURENT",
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
    imageUrl: [
      "https://media.douglas.de/medias/Bt0apQ818762-0-dgl-DE.jpg?context=bWFzdGVyfGltYWdlc3wyMjQ5MzJ8aW1hZ2UvanBlZ3xhREEyTDJnNU1TODBPVEF4T1RJeU9UWTJOek0xT0M5Q2REQmhjRkU0TVRnM05qSmZNRjlrWjJ3dFJFVXVhbkJufDE2MzZhOThhNmY0NDU5NzZmODcxNGUzOGJkODNiMTI5YjQ2ZTU4ZGY1NmI0YmQ3MzNjNWEwZTczZjIxZmYzZGU",
      "https://media.douglas.de/medias/Bt0apQ818762-0-dgl-DE.jpg?context=bWFzdGVyfGltYWdlc3wyMjQ5MzJ8aW1hZ2UvanBlZ3xhREEyTDJnNU1TODBPVEF4T1RJeU9UWTJOek0xT0M5Q2REQmhjRkU0TVRnM05qSmZNRjlrWjJ3dFJFVXVhbkJufDE2MzZhOThhNmY0NDU5NzZmODcxNGUzOGJkODNiMTI5YjQ2ZTU4ZGY1NmI0YmQ3MzNjNWEwZTczZjIxZmYzZGU",
      "https://media.douglas.de/medias/Bt0apQ818762-0-dgl-DE.jpg?context=bWFzdGVyfGltYWdlc3wyMjQ5MzJ8aW1hZ2UvanBlZ3xhREEyTDJnNU1TODBPVEF4T1RJeU9UWTJOek0xT0M5Q2REQmhjRkU0TVRnM05qSmZNRjlrWjJ3dFJFVXVhbkJufDE2MzZhOThhNmY0NDU5NzZmODcxNGUzOGJkODNiMTI5YjQ2ZTU4ZGY1NmI0YmQ3MzNjNWEwZTczZjIxZmYzZGU",
    ],
    description:
      "Versace Eros – это страстный и энергичный аромат, который идеально отражает динамику современного мужчины. Композиция аромата построена на ярких и свежих цитрусовых нотах, обогащенных теплыми древесными и пряными аккордами, создающими неповторимый, запоминающийся шлейф. Этот аромат предназначен для тех, кто стремится к свободе, уверен в себе и не боится выделяться из толпы.",
    price: 4,
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
    imageUrl: [
      "https://media.douglas.de/medias/VQ1jvL242838-0-global.jpg?context=bWFzdGVyfGltYWdlc3w0ODE3Njl8aW1hZ2UvanBlZ3xhRGd6TDJoaE1DODJNamM0TWpReU9URTJOelkwTmk5V1VURnFka3d5TkRJNE16aGZNRjluYkc5aVlXd3VhbkJufDI1MGFjMDMwNjhjNTFlZjQxY2Q1Yjg4M2VmOTVlYjdmNGFjNzM5ZTk2MWY0YWNkMzE0MTI2MTk3NTU3NzRkMWQ",
      "https://media.douglas.de/medias/VQ1jvL242838-0-global.jpg?context=bWFzdGVyfGltYWdlc3w0ODE3Njl8aW1hZ2UvanBlZ3xhRGd6TDJoaE1DODJNamM0TWpReU9URTJOelkwTmk5V1VURnFka3D5TkRJNE16aGZNRjluYkc5aVlXd3VhbkJufDI1MGFjMDMwNjhjNTFlZjQxY2Q1Yjg4M2VmOTVlYjdmNGFjNzM5ZTk2MWY0YWNkMzE0MTI2MTk3NTU3NzRkMWQ",
      "https://media.douglas.de/medias/VQ1jvL242838-0-global.jpg?context=bWFzdGVyfGltYWdlc3w0ODE3Njl8aW1hZ2UvanBlZ3xhRGd6TDJoaE1DODJNamM0TWpReU9URTJOelkwTmk5V1VURnFka3D5TkRJNE16aGZNRjluYkc5aVlXd3VhbkJufDI1MGFjMDMwNjhjNTFlZjQxY2Q1Yjg4M2VmOTVlYjdmNGFjNzM5ZTk2MWY0YWNkMzE0MTI2MTk3NTU3NzRkMWQ",
    ],
    description:
      "Armani Code – это элегантный и чувственный аромат, который воплощает в себе утонченную гармонию свежести и теплоты. Композиция аромата включает яркие цитрусовые ноты, дополненные пряными аккордами и мягкими древесными оттенками, создавая образ стильного и уверенного в себе мужчины. Этот парфюм подчеркивает индивидуальность и придает дополнительный шарм в любом окружении.",
    price: 6,
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
    imageUrl: [
      "https://media.douglas.de/medias/83hfnR695892-0-global.jpg?context=bWFzdGVyfGltYWdlc3wyNDA1MTR8aW1hZ2UvanBlZ3xhRE5qTDJnd05DODJNelkwTXpVeE56WXhOakUxT0M4NE0yaG1ibEkyT1RVNE9USmZNRjluYkc5aVlXd3VhbkJufDY2ZmQwNjk5MTI0NGMzNjY5NWUzMzBkMjc1NzViZWJmY2UzYjYyMmZiMTI2YjY2OWY3MTQzNWIzMDFhZjAwN2Q",
      "https://media.douglas.de/medias/83hfnR695892-0-global.jpg?context=bWFzdGVyfGltYWdlc3wyNDA1MTR8aW1hZ2UvanBlZ3xhRE5qTDJnd05DODJNelkwTXpVeE56WXhOakUxT0M4NE0yaG1ibEkyT1RVNE9USmZNRjluYkc5aVlXd3VhbkJufDY2ZmQwNjk5MTI0NGMzNjY5NWUzMzBkMjc1NzViZWJmY2UzYjYyMmZiMTI2YjY2OWY3MTQzNWIzMDFhZjAwN2Q",
      "https://media.douglas.de/medias/83hfnR695892-0-global.jpg?context=bWFzdGVyfGltYWdlc3wyNDA1MTR8aW1hZ2UvanBlZ3xhRE5qTDJnd05DODJNelkwTXpVeE56WXhOakUxT0M4NE0yaG1ibEkyT1RVNE9USmZNRjluYkc5aVlXd3VhbkJufDY2ZmQwNjk5MTI0NGMzNjY5NWUzMzBkMjc1NzViZWJmY2UzYjYyMmZiMTI2YjY2OWY3MTQzNWIzMDFhZjAwN2Q",
    ],
    description:
      "Givenchy Dahlia Divin – это утонченный и изысканный аромат, который рассказывает историю женственности, элегантности и чувственности. Его сложная композиция объединяет свежие цветочные ноты с глубокими и теплыми аккордами, создавая аромат, способный подчеркнуть индивидуальность и изысканный вкус. Этот парфюм оставляет за собой шлейф незабываемых эмоций и является истинным выражением стиля и утонченности.",
    price: 9,
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
  { name: "Aedes de Venustas", value: Brands.AEADESVENUSTAS },
  { name: "Aether", value: Brands.AETHER },
  { name: "Affinessence", value: Brands.AFFINESSENCE },
  { name: "Agar Aura", value: Brands.AGAR_AURA },
  { name: "Akro", value: Brands.AKRO },
  { name: "Alexandria Fragrances", value: Brands.ALEXANDRIA_FRAGRANCES },
  { name: "Alexandre.J", value: Brands.ALEXANDRE_J },
  { name: "Allsaints (Metal Wave, Incense City)", value: Brands.ALLSAINTS },
  { name: "Amouage", value: Brands.AMOUAGE },
  { name: "Andrea Maack", value: Brands.ANDREA_MAACK },
  { name: "Andy Tauer", value: Brands.ANDY_TAUER },
  { name: "Anima Mundi", value: Brands.ANIMA_MUNDI },
  { name: "Annick Goutal", value: Brands.ANNICK_GOUTAL },
  { name: "April Aromatics", value: Brands.APRIL_AROMATICS },
  { name: "Armani", value: Brands.ARMANI },
  { name: "Armani Prive", value: Brands.ARMANI_PRIVE },
  { name: "Atelier Cologne", value: Brands.ATELIER_COLOGNE },
  { name: "Atelier des Ors", value: Brands.ATELIER_DES_ORS },
  { name: "Atkinsons", value: Brands.ATKINSONS },
  { name: "Aura Concept", value: Brands.AURA_CONCEPT },
  { name: "Avestan", value: Brands.AVESTAN },
  { name: "BDK Parfums", value: Brands.BDK_PARFUMS },
  { name: "BeauFort London", value: Brands.BEAUFORT_LONDON },
  { name: "Berdoues", value: Brands.BERDOUES },
  { name: "Biehl Parfumkunstwerke", value: Brands.BIEHL_PARFUMKUNSTWERKE },
  { name: "Björk & Berries", value: Brands.BJORK_AND_BERRIES },
  { name: "Boadicea the Victorious", value: Brands.BOADICEA_THE_VICTORIOUS },
  { name: "Bogue Profumo", value: Brands.BOGUE_PROFUMO },
  { name: "Bois 1920", value: Brands.BOIS_1920 },
  { name: "Bon Parfumeur", value: Brands.BON_PARFUMEUR },
  { name: "Bond No. 9", value: Brands.BOND_NO_9 },
  { name: "Bortnikoff", value: Brands.BORTNIKOFF },
  { name: "Bruno Fazzolari", value: Brands.BRUNO_FAZZOLAR },
  { name: "By Kilian", value: Brands.BY_KILIAN },
  { name: "Byredo", value: Brands.BYREDO },
  { name: "Calvin Klein", value: Brands.CALVIN_KLEIN },
  { name: "Cartier (Les Heures de Parfum)", value: Brands.CARTIER },
  { name: "Cacharel (Les Senteurs Gourmandes)", value: Brands.CACHAREL },
  { name: "Caron", value: Brands.CARON },
  { name: "Carner Barcelona", value: Brands.CARNER_BARCELONA },
  { name: "Casamorati (Xerjoff)", value: Brands.CASAMORATI },
  { name: "Chabaud Maison de Parfum", value: Brands.CHABAUD_MAISON_DE_PARFUM },
  { name: "Chanel", value: Brands.CHANEL },
  { name: "Chanel Les Exclusifs", value: Brands.CHANEL_LES_EXCLUSIFS },
  { name: "Chris Collins", value: Brands.CHRIS_COLLINS },
  { name: "Clive Christian", value: Brands.CLIVE_CHRISTIAN },
  { name: "Comme des Garçons Parfum", value: Brands.COMME_DES_GARCONS_PARFUM },
  { name: "Creed", value: Brands.CREED },
  { name: "Creed Vintage (старые партии)", value: Brands.CREED_VINTAGE },
  { name: "D.S. & Durga", value: Brands.DS_AND_DURGA },
  { name: "Dame Perfumery", value: Brands.DAME_PERFUMERY },
  { name: "Dasein", value: Brands.DASEIN },
  { name: "David Jourquin", value: Brands.DAVID_JOURQUIN },
  { name: "Dear Polly", value: Brands.DEAR_POLLY },
  { name: "Dior", value: Brands.DIOR },
  { name: "Dior La Collection Privée", value: Brands.DIOR_LA_COLLECTION_PRIVEE },
  { name: "Diptyque (нишевая линия)", value: Brands.DIPTYQUE },
  { name: "Dixit & Zak", value: Brands.DIXIT_AND_ZAK },
  { name: "Dries Van Noten (парфюмерия)", value: Brands.DRIES_VAN_NOTEN },
  { name: "Dr. Vranjes", value: Brands.DR_VRANJES },
  { name: "Dusita", value: Brands.DUSITA },
  { name: "E. Coudray", value: Brands.E_COUDRAY },
  { name: "Eau d’Italie", value: Brands.EAU_DITALIE },
  { name: "Electimuss", value: Brands.ELECTIMUSS },
  { name: "ELDO (Etat Libre d'Orange)", value: Brands.ELDO },
  { name: "Ellis Brooklyn", value: Brands.ELLIS_BROOKLYN },
  { name: "Embruns", value: Brands.EMBRUNS },
  { name: "Ensar Oud", value: Brands.ENSAR_OUD },
  { name: "Erbario Toscano", value: Brands.ERBARIO_TOSCANO },
  { name: "Escentric Molecules", value: Brands.ESCENTRIC_MOLECULES },
  { name: "Ex Idolo", value: Brands.EX_IDOLO },
  { name: "Ex Nihilo", value: Brands.EX_NIHILO },
  { name: "Faconnable", value: Brands.FACONNABLE },
  { name: "Farmacia SS. Annunziata", value: Brands.FARMACIA_SS_ANNUNZIATA },
  { name: "Filippo Sorcinelli", value: Brands.FILIPPO_SORCINELLI },
  { name: "Floris London", value: Brands.FLORIS_LONDON },
  { name: "Fort & Manle", value: Brands.FORT_AND_MANLE },
  { name: "Francesca Bianchi", value: Brands.FRANCESCA_BIANCHI },
  { name: "Frederic Malle", value: Brands.FREDERIC_MALLE },
  { name: "Fueguia 1833", value: Brands.FUEGUIA_1833 },
  { name: "Gallivant", value: Brands.GALLIVANT },
  { name: "Ganache Parfums", value: Brands.GANACHE_PARFUMS },
  { name: "Giorgio Armani Privé", value: Brands.GIORGIO_ARMANI_PRIVÉ },
  { name: "Giardino Benessere", value: Brands.GIARDINO_BENESSERE },
  { name: "Givenchy", value: Brands.GIVENCHY },
  { name: "Goutal Paris", value: Brands.GOUTAL_PARIS },
  { name: "Gritti", value: Brands.GRITTI },
  { name: "Guerlain (эксклюзивные выпуски)", value: Brands.GUERLAIN_EXCLUSIVE },
  { name: "Guerlain Les Absolus d’Orient", value: Brands.GUERLAIN_LES_ABSOLUS_D_ORIENT },
  { name: "Gucci", value: Brands.GUCCI },
  { name: "Heeley", value: Brands.HEELEY },
  { name: "Henry Jacques", value: Brands.HENRY_JACQUES },
  { name: "Hermetica", value: Brands.HERMETICA },
  { name: "Hiram Green", value: Brands.HIRAM_GREEN },
  { name: "Histoires de Parfums", value: Brands.HISTOIRES_DE_PARFUMS },
  { name: "Hugo Boss The Private Line", value: Brands.HUGO_BOSS_PRIVATE },
  { name: "Imaginary Authors", value: Brands.IMAGINARY_AUTHORS },
  { name: "Initio Parfums", value: Brands.INITIO_PARFUMS },
  { name: "Isabey", value: Brands.ISABEY },
  { name: "Issey Miyake (L'Eau d'Issey Noir Argent и др.)", value: Brands.ISSEY_MIYAKE },
  { name: "Jacques Fath", value: Brands.JACQUES_FATH },
  { name: "James Heeley", value: Brands.JAMES_HEELEY },
  { name: "Jardin d’Ecrivains", value: Brands.JARDIN_DE_ECRIVAINS },
  { name: "Jazmin Saraï", value: Brands.JAZMIN_SARAI },
  { name: "Jean-Claude Ellena (личные проекты)", value: Brands.JEAN_CLAUDE_ELLENA },
  { name: "Jeanne en Provence (люкс-линия)", value: Brands.JEANNE_EN_PROVENCE },
  { name: "Jeroboam", value: Brands.JEROBOAM },
  { name: "Jersey (Chanel Exclusifs)", value: Brands.JERSEY },
  { name: "Jovoy Paris", value: Brands.JOVOY_PARIS },
  { name: "Jul et Mad", value: Brands.JUL_ET_MAD },
  { name: "Kerosene", value: Brands.KEROSENE },
  { name: "Kilian (By Kilian)", value: Brands.KILIAN },
  { name: "Krigler", value: Brands.KRIGLER },
  { name: "L'Artisan Parfumeur", value: Brands.L_ARTISAN_PARFUMEUR },
  { name: "La Via del Profumo (AbdesSalaam Attar)", value: Brands.LA_VIA_DEL_PROFUMO },
  { name: "Laboratorio Olfattivo", value: Brands.LABORATORIO_OLFATTIVO },
  { name: "Lancôme (La Collection)", value: Brands.LANCOME },
  { name: "Le Galion", value: Brands.LE_GALION },
  { name: "Le Jardin Retrouvé", value: Brands.LE_JARDIN_RETROUVE },
  { name: "Les Indemodables", value: Brands.LES_INDEMODABLES },
  { name: "Les Liquides Imaginaires", value: Brands.LES_LIQUIDES_IMAGINAIRES },
  { name: "Liquides Imaginaires", value: Brands.LIQUIDES_IMAGINAIRES },
  { name: "Loewe (эксклюзивная линия)", value: Brands.LOEWE },
  { name: "Lubin", value: Brands.LUBIN },
  { name: "LVNEA", value: Brands.LVNEA },
  { name: "L'Orchestre Parfum", value: Brands.L_ORCHESTRE_PARFUM },
  { name: "Maison Crivelli", value: Brands.MAISON_CRIVELLI },
  { name: "Maison Francis Kurkdjian", value: Brands.MAISON_FRANCIS_KURKDJKIAN },
  { name: "Maison Lancôme", value: Brands.MAISON_LANCOME },
  { name: "Maison Margiela Replica", value: Brands.MAISON_MARGIELA_REPLICA },
  { name: "Maison Martin Margiela (Replica)", value: Brands.MAISON_MARTIN_MARGIELA },
  { name: "Maison Rebatchi", value: Brands.MAISON_REBATCHI },
  { name: "Maison Tahité", value: Brands.MAISON_TAHITE },
  { name: "Majda Bekkali", value: Brands.MAJDA_BEKKALI },
  { name: "Mancera", value: Brands.MANCERA },
  { name: "Manos Gerakinis", value: Brands.MANOS_GERAKINIS },
  { name: "Marc-Antoine Barrois", value: Brands.MARC_ANTOINE_BARROIS },
  { name: "Maria Candida Gentile", value: Brands.MARIA_CANDIDA_GENTILE },
  { name: "Marissa Zappas", value: Brands.MARISSA_ZAPPAS },
  { name: "Mark Buxton", value: Brands.MARK_BUXTON },
  { name: "Masque Milano", value: Brands.MASQUE_MILANO },
  { name: "Matière Première", value: Brands.MATIERE_PREMIERE },
  { name: "MDCI Parfums", value: Brands.MDCI_PARFUMS },
  { name: "Memo Paris", value: Brands.MEMO_PARIS },
  { name: "Mendittorosa", value: Brands.MENDITTOROSA },
  { name: "Miller Harris", value: Brands.MILLER_HARRIS },
  { name: "Miya Shinma", value: Brands.MIYA_SHINMA },
  { name: "Montale", value: Brands.MONTALIE },
  { name: "Monograph", value: Brands.MONOGRAPH },
  { name: "Moresque", value: Brands.MORESQUE },
  { name: "Mugler Les Exceptions", value: Brands.MUGLER_LES_EXCEPTIONS },
  { name: "Myrrhe & Délires", value: Brands.MYRRE_AND_DELIRES },
  { name: "Narciso Rodriguez (For Her & For Him)", value: Brands.NARCISO_RODRIGUEZ },
  { name: "Nasomatto", value: Brands.NASOMATTO },
  { name: "Nicolai Parfumeur Createur", value: Brands.NICOLAI_PARFUMEUR_CREATEUR },
  { name: "Nishane", value: Brands.NISHANE },
  { name: "Note di Profumum", value: Brands.NOTE_DI_PROFUMUM },
  { name: "O’Driù", value: Brands.ODRIU },
  { name: "Olfactive Studio", value: Brands.OLFACTIVE_STUDIO },
  { name: "Olibere Parfums", value: Brands.OLIBERE_PARFUMS },
  { name: "Ormonde Jayne", value: Brands.ORMONDE_JAYNE },
  { name: "Ormonde Jayne Montabaco", value: Brands.ORMONDE_JAYNE_MONTABACO },
  { name: "Ormonde Man", value: Brands.ORMONDE_MAN },
  { name: "Oscar de la Renta (эксклюзивная линия)", value: Brands.OSCAR_DE_LA_RENTA },
  { name: "Osmofolia", value: Brands.OSMOFOLIA },
  { name: "P. Seven", value: Brands.P_SEVEN },
  { name: "Paco Rabanne (эксклюзивные выпуски)", value: Brands.PACO_RABANNE },
  { name: "Parfum d’Empire", value: Brands.PARFUM_D_EMPIRE },
  { name: "Parfum d’Orsay", value: Brands.PARFUM_D_ORSAY },
  { name: "Parfums de Marly", value: Brands.PARFUMS_DE_MARLY },
  { name: "Parfums Dusita", value: Brands.PARFUMS_DUSITA },
  { name: "Parfums MDCI", value: Brands.PARFUMS_MDCI },
  { name: "Parle Moi de Parfum", value: Brands.PARLE_MOI_DE_PARFUM },
  { name: "Pekji", value: Brands.PEKJI },
  { name: "Penhaligon’s", value: Brands.PENHALIGONS },
  { name: "Perris Monte Carlo", value: Brands.PERRIS_MONTE_CARLO },
  { name: "Phuong Dang", value: Brands.PHUONG_DANG },
  { name: "Pierre Guillaume", value: Brands.PIERRE_GUILLAUME },
  { name: "Pineward Perfumes", value: Brands.PINEWARD_PERFUMES },
  { name: "Prissana", value: Brands.PRISSANA },
  { name: "Profumum Roma", value: Brands.PROFUMUM_ROMA },
  { name: "Puredistance", value: Brands.PUREDISTANCE },
  { name: "Quartana", value: Brands.QUARTANA },
  { name: "Ramon Monegal", value: Brands.RAMON_MONEGAL },
  { name: "Rania J", value: Brands.RANIA_J },
  { name: "Régime des Fleurs", value: Brands.REGIME_DES_FLEURS },
  { name: "Robert Piguet", value: Brands.ROBERT_PIGUET },
  { name: "Roja Dove", value: Brands.ROJA_DOVE },
  { name: "Room 1015", value: Brands.ROOM_1015 },
  { name: "Royal Crown", value: Brands.ROYAL_CROWN },
  { name: "Salle Privée", value: Brands.SALLE_PRIVEE },
  { name: "Santa Maria Novella", value: Brands.SANTA_MARIA_NOVELLA },
  { name: "Santi Burgas", value: Brands.SANTI_BURGAS },
  { name: "Scentrique", value: Brands.SCENTRIQUE },
  { name: "Serge Lutens", value: Brands.SERGE_LUTENS },
  { name: "Sixteen92", value: Brands.SIXTEEN92 },
  { name: "Slumberhouse", value: Brands.SLUMBERHOUSE },
  { name: "Stephane Humbert Lucas 777", value: Brands.STEPHANE_HUMBERT_LUCAS_777 },
  { name: "Strangers Parfumerie", value: Brands.STRANGERS_PARFUMERIE },
  { name: "Stora Skuggan", value: Brands.STORA_SKUGGAN },
  { name: "Sultan Pasha Attars", value: Brands.SULTAN_PASHA_ATTARS },
  { name: "Tauer Perfumes", value: Brands.TAUER_PERFUMES },
  { name: "The Different Company", value: Brands.THE_DIFFERENT_COMPANY },
  { name: "The House of Oud", value: Brands.THE_HOUSE_OF_OUD },
  { name: "The Nue Co.", value: Brands.THE_NUE_CO },
  { name: "Tom Daxon", value: Brands.TOM_DAXON },
  { name: "Tom Ford", value: Brands.TOM_FORD },
  { name: "Versace", value: Brands.VERSACE },
  { name: "Yves Saint Laurent", value: Brands.YVES_SAINT_LAURENT },
];
export const classifications: {
  value: Classifications;
  label: { ru: string; de: string };
}[] = [
  {
    value: Classifications.PROFESSIONAL,
    label: { ru: "Профессиональная", de: "Professionell" },
  },
  { value: Classifications.LUXURY, label: { ru: "Люкс", de: "Luxus" } },
  {
    value: Classifications.MASS_MARKET,
    label: { ru: "Масс-маркет", de: "Mass Market" },
  },
  { value: Classifications.NICHE, label: { ru: "Ниша", de: "Nische" } },
  { value: Classifications.ARABIAN, label: { ru: "Арабский", de: "Arabisch" } },
  {
    value: Classifications.DESIGNER,
    label: { ru: "Дизайнерский", de: "Designer" },
  },
  {
    value: Classifications.CELEBRITY,
    label: { ru: "Селебрити", de: "Celebrity" },
  },
  { value: Classifications.INDIE, label: { ru: "Инди", de: "Indie" } },
];

export const deliveryTypes = [
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
  {
    name: "Paket bis Haftung",
    value: DeliveryTypes.PBH,
    price: 6.2,
  },
];

export const purposes: { value: Purpose; label: { ru: string; de: string } }[] =
  [
    { value: Purpose.FACE, label: { ru: "Для лица", de: "Für das Gesicht" } },
    { value: Purpose.EYES, label: { ru: "Для глаз", de: "Für die Augen" } },
    { value: Purpose.LIPS, label: { ru: "Для губ", de: "Für die Lippen" } },
    { value: Purpose.BODY, label: { ru: "Для тела", de: "Für den Körper" } },
  ];

export const finishes: { value: Finish; label: { ru: string; de: string } }[] =
  [
    { value: Finish.MATTE, label: { ru: "Матовый", de: "Matt" } },
    { value: Finish.GLOSSY, label: { ru: "Глянцевый", de: "Glänzend" } },
    { value: Finish.SATIN, label: { ru: "Сатиновый", de: "Satin" } },
    { value: Finish.METALLIC, label: { ru: "Металлик", de: "Metallic" } },
    { value: Finish.SHIMMER, label: { ru: "Шиммер", de: "Schimmernd" } },
  ];

export const textures: { value: Texture; label: { ru: string; de: string } }[] =
  [
    { value: Texture.CREAMY, label: { ru: "Кремовая", de: "Cremig" } },
    { value: Texture.GEL, label: { ru: "Гелевая", de: "Gelartig" } },
    { value: Texture.POWDERY, label: { ru: "Пудровая", de: "Pudrig" } },
    { value: Texture.LIQUID, label: { ru: "Жидкая", de: "Flüssig" } },
  ];

export const formulas: { value: Formula; label: { ru: string; de: string } }[] =
  [
    {
      value: Formula.LONG_LASTING,
      label: { ru: "Стойкая", de: "Langanhaltend" },
    },
    {
      value: Formula.HYDRATING,
      label: { ru: "Увлажняющая", de: "Feuchtigkeitsspendend" },
    },
    { value: Formula.LIGHT, label: { ru: "Легкая", de: "Leicht" } },
    {
      value: Formula.WATERPROOF,
      label: { ru: "Водостойкая", de: "Wasserfest" },
    },
    {
      value: Formula.NON_COMEDOGENIC,
      label: { ru: "Некомедогенная", de: "Nicht komedogen" },
    },
  ];

export const effects: { value: Effects; label: { ru: string; de: string } }[] =
  [
    {
      value: Effects.HYDRATING,
      label: { ru: "Увлажняет", de: "Spendet Feuchtigkeit" },
    },
    {
      value: Effects.VOLUMIZING,
      label: { ru: "Придаёт объём", de: "Verleiht Volumen" },
    },
    {
      value: Effects.TONE_BALANCING,
      label: { ru: "Выравнивает тон", de: "Gleicht den Teint aus" },
    },
    {
      value: Effects.DEFINING,
      label: { ru: "Подчеркивает форму", de: "Betont Konturen" },
    },
    { value: Effects.SMOOTHING, label: { ru: "Сглаживает", de: "Glättet" } },
    { value: Effects.MATIFYING, label: { ru: "Матирует", de: "Mattiert" } },
    {
      value: Effects.ILLUMINATING,
      label: { ru: "Придаёт сияние", de: "Verleiht Strahlkraft" },
    },
    {
      value: Effects.ANTIAGING,
      label: { ru: "Антивозрастной", de: "Anti-Aging" },
    },
  ];

export const applicationMethods: {
  value: ApplicationMethod;
  label: { ru: string; de: string };
}[] = [
  { value: ApplicationMethod.BRUSH, label: { ru: "Кисть", de: "Pinsel" } },
  {
    value: ApplicationMethod.APPLICATOR,
    label: { ru: "Аппликатор", de: "Applikator" },
  },
  {
    value: ApplicationMethod.FINGERS,
    label: { ru: "Пальцами", de: "Mit den Fingern" },
  },
  {
    value: ApplicationMethod.BOTTLE,
    label: { ru: "Из флакона", de: "Aus dem Flakon" },
  },
  { value: ApplicationMethod.PENCIL, label: { ru: "Карандаш", de: "Stift" } },
];

export const packagingFormats: {
  value: PackagingFormat;
  label: { ru: string; de: string };
}[] = [
  { value: PackagingFormat.STICK, label: { ru: "Стик", de: "Stick" } },
  { value: PackagingFormat.PENCIL, label: { ru: "Карандаш", de: "Stift" } },
  { value: PackagingFormat.TUBE, label: { ru: "Тюбик", de: "Tube" } },
  { value: PackagingFormat.BOTTLE, label: { ru: "Флакон", de: "Flakon" } },
  { value: PackagingFormat.JAR, label: { ru: "Баночка", de: "Dose" } },
];

export const skinTypes: {
  value: SkinType;
  label: { ru: string; de: string };
}[] = [
  {
    value: SkinType.ALL,
    label: { ru: "Для всех типов", de: "Für alle Hauttypen" },
  },
  { value: SkinType.DRY, label: { ru: "Сухая", de: "Trocken" } },
  { value: SkinType.OILY, label: { ru: "Жирная", de: "Ölig" } },
  {
    value: SkinType.SENSITIVE,
    label: { ru: "Чувствительная", de: "Empfindlich" },
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

export const notes: { value: Notes; label: { ru: string; de: string } }[] = [
  // Базовые элементы, уже имеющиеся в массиве:
  { value: Notes.FLORAL, label: { ru: "Цветочный", de: "Blumig" } },
  { value: Notes.CITRUS, label: { ru: "Цитрусовый", de: "Zitrus" } },
  { value: Notes.GREEN, label: { ru: "Зелёный", de: "Grün" } },
  { value: Notes.FRUITY, label: { ru: "Фруктовый", de: "Fruchtig" } },
  { value: Notes.SPICY, label: { ru: "Пряный", de: "Würzig" } },
  { value: Notes.WOODY, label: { ru: "Древесный", de: "Holzig" } },
  { value: Notes.ORIENTAL, label: { ru: "Восточный", de: "Oriental" } },
  { value: Notes.MUSK, label: { ru: "Мускусный", de: "Moschus" } },
  { value: Notes.AQUATIC, label: { ru: "Водный", de: "Aquatisch" } },
  // Группа 1. Свежие / цитрусовые ноты
  { value: Notes.BERGAMOT, label: { ru: "Бергамот", de: "Bergamotte" } },
  { value: Notes.LEMON, label: { ru: "Лимон", de: "Zitrone" } },
  { value: Notes.ORANGE, label: { ru: "Апельсин", de: "Orange" } },
  { value: Notes.MANDARIN, label: { ru: "Мандарин", de: "Mandarine" } },
  { value: Notes.GRAPEFRUIT, label: { ru: "Грейпфрут", de: "Grapefruit" } },
  { value: Notes.YUZU, label: { ru: "Юзу", de: "Yuzu" } },
  { value: Notes.LIME, label: { ru: "Лайм", de: "Limette" } },
  { value: Notes.NEROLI, label: { ru: "Нероли", de: "Neroli" } },
  { value: Notes.VIOLET_LEAF, label: { ru: "Лист фиалки", de: "Veilchenblatt" } },
  { value: Notes.GALBANUM, label: { ru: "Гальбанум", de: "Galbanum" } },
  { value: Notes.PETITGREY, label: { ru: "Петитгрей", de: "Petitgrain" } },
  { value: Notes.GREEN_APPLE, label: { ru: "Зелёное яблоко", de: "Grüner Apfel" } },
  { value: Notes.MINT, label: { ru: "Мята", de: "Minze" } },
  { value: Notes.GINGER, label: { ru: "Имбирь", de: "Ingwer" } },
  { value: Notes.RHUBARB, label: { ru: "Ревень", de: "Rhabarber" } },
  { value: Notes.BLACK_CURRANT, label: { ru: "Черная смородина", de: "Schwarze Johannisbeere" } },
  { value: Notes.WATERMELON, label: { ru: "Арбуз", de: "Wassermelone" } },
  { value: Notes.CUCUMBER, label: { ru: "Огурец", de: "Gurke" } },
  { value: Notes.BASIL, label: { ru: "Базилик", de: "Basilikum" } },
  { value: Notes.TARAGON, label: { ru: "Эстрагон", de: "Estragon" } },
  { value: Notes.ROSEMARY, label: { ru: "Розмарин", de: "Rosmarin" } },
  { value: Notes.LAVENDER, label: { ru: "Лаванда", de: "Lavendel" } },
  { value: Notes.TEA, label: { ru: "Чай", de: "Tee" } },
  { value: Notes.ALDEHYDES, label: { ru: "Альдегиды", de: "Aldehydisch" } },
  { value: Notes.SAFFRON, label: { ru: "Шафран", de: "Safran" } },
  { value: Notes.CARDAMOM, label: { ru: "Кардамон", de: "Kardamom" } },
  // Группа 2. Цветочные / фруктовые ноты
  { value: Notes.ROSE, label: { ru: "Роза", de: "Rose" } },
  { value: Notes.JASMINE, label: { ru: "Жасмин", de: "Jasmin" } },
  { value: Notes.LILY_OF_THE_VALLEY, label: { ru: "Ландыш", de: "Maiglöckchen" } },
  { value: Notes.IRIS, label: { ru: "Ирис", de: "Iris" } },
  { value: Notes.TUBEROSE, label: { ru: "Тубероза", de: "Tuberose" } },
  { value: Notes.ORANGEBLOSSOM, label: { ru: "Апельсиновый цвет", de: "Orangenblüte" } },
  { value: Notes.NARCISSUS, label: { ru: "Нарцисс", de: "Narzisse" } },
  { value: Notes.PEONY, label: { ru: "Пион", de: "Pfingstrose" } },
  { value: Notes.VIOLET, label: { ru: "Фиалка", de: "Veilchen" } },
  { value: Notes.MAGNOLIA, label: { ru: "Магнолия", de: "Magnolie" } },
  { value: Notes.GARDENIA, label: { ru: "Гардения", de: "Gardenie" } },
  { value: Notes.RASPBERRY, label: { ru: "Малина", de: "Himbeere" } },
  { value: Notes.PEACH, label: { ru: "Персик", de: "Pfirsich" } },
  { value: Notes.APPLE, label: { ru: "Яблоко", de: "Apfel" } },
  { value: Notes.PLUM, label: { ru: "Слива", de: "Pflaume" } },
  { value: Notes.PEAR, label: { ru: "Груша", de: "Birne" } },
  { value: Notes.HONEY, label: { ru: "Мед", de: "Honig" } },
  { value: Notes.CINNAMON, label: { ru: "Корица", de: "Zimt" } },
  { value: Notes.CLAVY, label: { ru: "Гвоздика", de: "Nelke" } },
  { value: Notes.PEPPER, label: { ru: "Перец", de: "Pfeffer" } },
  { value: Notes.COCOA, label: { ru: "Какао", de: "Kakao" } },
  { value: Notes.COFFEE, label: { ru: "Кофе", de: "Kaffee" } },
  { value: Notes.COCONUT, label: { ru: "Кокос", de: "Kokosnuss" } },
  { value: Notes.RUM, label: { ru: "Ром", de: "Rum" } },
  { value: Notes.RED_BERRIES, label: { ru: "Красные ягоды", de: "Rote Beeren" } },
  { value: Notes.ANISE, label: { ru: "Анис", de: "Anis" } },
  { value: Notes.LIQUORICE, label: { ru: "Лакричник", de: "Lakritze" } },
  { value: Notes.PASSIONFRUIT, label: { ru: "Маракуйя", de: "Passionsfrucht" } },
  // Группа 3. Базовые / древесные ноты
  { value: Notes.VANILLA, label: { ru: "Ваниль", de: "Vanille" } },
  { value: Notes.AMBER, label: { ru: "Амбра", de: "Amber" } },
  { value: Notes.PATCHOULI, label: { ru: "Пачули", de: "Patschouli" } },
  { value: Notes.VETIVER, label: { ru: "Ветивер", de: "Vetiver" } },
  { value: Notes.SANDALWOOD, label: { ru: "Сандаловое дерево", de: "Sandelholz" } },
  { value: Notes.CEDAR, label: { ru: "Кедр", de: "Zeder" } },
  { value: Notes.MUSK_DUP, label: { ru: "Мускус", de: "Moschus" } },
  { value: Notes.TONKA_BEANS, label: { ru: "Бобы тонка", de: "Tonkabohnen" } },
  { value: Notes.LABDANUM, label: { ru: "Лабданум", de: "Labdanum" } },
  { value: Notes.RESINS, label: { ru: "Смолы", de: "Harze" } },
  { value: Notes.OAK_MOSS, label: { ru: "Дубовый мох", de: "Eichenmoos" } },
  { value: Notes.TOBACCO, label: { ru: "Табак", de: "Tabak" } },
  { value: Notes.LEATHER_DUP, label: { ru: "Кожа", de: "Leder" } },
  { value: Notes.FIG, label: { ru: "Инжир", de: "Feige" } },
  { value: Notes.CHOCOLATE, label: { ru: "Шоколад", de: "Schokolade" } },
  { value: Notes.BENZOIN, label: { ru: "Бензоин", de: "Benzoin" } },
  { value: Notes.MYRRH, label: { ru: "Мирра", de: "Myrrhe" } },
  { value: Notes.OPOPONAX, label: { ru: "Опопонакс", de: "Opoponax" } },
  { value: Notes.CASHMERAN, label: { ru: "Кашмеран", de: "Cashmeran" } },
  { value: Notes.NAGARMOTA, label: { ru: "Нагармота", de: "Nagarmotha" } },
  { value: Notes.CIVET, label: { ru: "Цивет", de: "Zibet" } },
  { value: Notes.CASTOREUM, label: { ru: "Кастореум", de: "Castoréum" } },
  { value: Notes.OUD, label: { ru: "Уд", de: "Oud" } },
  { value: Notes.INCENSE, label: { ru: "Ладан", de: "Weihrauch" } },
  { value: Notes.SPICES, label: { ru: "Пряности", de: "Gewürze" } },
  { value: Notes.WOODY_NOTES, label: { ru: "Древесные ноты", de: "Holzige Noten" } },
  { value: Notes.SUGAR, label: { ru: "Сахар", de: "Zucker" } },
  { value: Notes.CARAMEL, label: { ru: "Карамель", de: "Karamell" } },
  { value: Notes.CASHMERE, label: { ru: "Кашемир", de: "Kaschmir" } },
];

export const perfumeAromas: { value: Aromas; label: { ru: string; de: string } }[] = [
  { value: Aromas.ANIMALIC, label: { ru: "Анималистический", de: "Animalisch" } },
  { value: Aromas.ALDHYDE, label: { ru: "Альдегидный", de: "Aldehydisch" } },
  { value: Aromas.AROMATIC, label: { ru: "Ароматический", de: "Aromatisch" } },
  { value: Aromas.CITRUS, label: { ru: "Цитрусовый", de: "Zitrus" } },
  { value: Aromas.COFFEE, label: { ru: "Кофейный", de: "Kaffeeartig" } },
  { value: Aromas.CARAMEL, label: { ru: "Карамельный", de: "Karamellig" } },
  { value: Aromas.CHOCOLATE, label: { ru: "Шоколадный", de: "Schokoladig" } },
  { value: Aromas.CHYPRE, label: { ru: "Шипровый", de: "Chypre" } },
  { value: Aromas.DUSTY, label: { ru: "Пыльный", de: "Staubig" } },
  { value: Aromas.EARTHY, label: { ru: "Землистый", de: "Erdig" } },
  { value: Aromas.FRUITY, label: { ru: "Фруктовый", de: "Fruchtig" } },
  { value: Aromas.FLORAL, label: { ru: "Цветочный", de: "Blumig" } },
  { value: Aromas.FOUGERE, label: { ru: "Фужерный", de: "Fougère" } },
  { value: Aromas.GOURMAND, label: { ru: "Гурманский", de: "Gourmand" } },
  { value: Aromas.LEATHER, label: { ru: "Кожаный", de: "Leder" } },
  { value: Aromas.METALLIC, label: { ru: "Металлический", de: "Metallisch" } },
  { value: Aromas.MILKY, label: { ru: "Молочный", de: "Milchig" } },
  { value: Aromas.MUSKY, label: { ru: "Мускусный", de: "Moschusartig" } },
  { value: Aromas.OZONE, label: { ru: "Озоновый", de: "Ozonisch" } },
  { value: Aromas.ORIENTAL_AMBER, label: { ru: "Восточный (амбровый)", de: "Oriental (Amber)" } },
  { value: Aromas.SPICY, label: { ru: "Пряный", de: "Würzig" } },
  { value: Aromas.POWDERY, label: { ru: "Пудровый", de: "Pudrig" } },
  { value: Aromas.SWEET, label: { ru: "Сладкий", de: "Süß" } },
  { value: Aromas.RESINOUS, label: { ru: "Смолистый", de: "Harzig" } },
  { value: Aromas.MARITIME, label: { ru: "Морской", de: "Maritim" } },
  { value: Aromas.AQUATIC, label: { ru: "Акватический", de: "Aquatisch" } },
  { value: Aromas.WOODY, label: { ru: "Древесный", de: "Holzig" } },
  { value: Aromas.GREEN, label: { ru: "Зелёный", de: "Grün" } },
  { value: Aromas.TOBACCO, label: { ru: "Табачный", de: "Tabakartig" } },
];
export type AromasType = typeof perfumeAromas;

export const yers = Array.from(
  { length: new Date().getFullYear() - 1990 },
  (_, index) => {
    const year = (index + 1991).toString();
    return { name: year, value: year };
  }
);
