import {
  Prisma,
  Languages,
  Gender,
  PerfumeConcentration,
  Brands,
  Notes,
  Types,
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
    description: "Classic perfume by Chanel.",
    price: 150,
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
    description: "Fresh and spicy fragrance for men by Dior.",
    price: 160,
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
      "https://media.douglas.de/medias/1W3Iiz1206949-0-dgl-DE.jpg?context=bWFzdGVyfGltYWdlc3w3MjQwNHxpbWFnZS9qcGVnfGFETmhMMmczTUM4Mk1qZzJNell4TkRBeE56VTJOaTh4VnpOSmFYb3hNakEyT1RRNVh6QmZaR2RzTFVSRkxtcHdad3w2ZTFjNjA1ZGE1OGY2NjQ4Zjk5NmI5OGUxYWE3NTE2ZmRiYWNmMjcyYjA5NGY5OGU5MjM1ZTgyZTUxY2Y5OGIy&grid=true&imPolicy=grayScaled&imdensity=1&imwidth=775",
    description: "A rich white floral scent from Gucci.",
    price: 140,
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
      "https://media.douglas.de/medias/fX36ww289690-0-dgl-DE.jpg?context=bWFzdGVyfGltYWdlc3w4NTg3MHxpbWFnZS9qcGVnfGFEQTVMMmhrTXk4ek5EWTNNVEV5TXpreU1qazNOQzltV0RNMmQzY3lPRGsyT1RCZk1GOWtaMnd0UkVVdWFuQm58OTA0MDJmM2NkYTRmYWY2M2Y4MDAyZTdiNDZkZGY3MmY2OTU2ZmUzODgyZWQ5OWRjYjFjM2I5MTQzYmRiODU0OQ&grid=true&imPolicy=grayScaled&imdensity=1&imwidth=775",
    description: "Opulent and luxurious fragrance by Tom Ford.",
    price: 200,
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
      "https://media.douglas.de/medias/https-media-prod-eu-1.mirakl.net-SOURCE-c25f678b853d40cf8426baeffbc0051a.jpg?context=bWFzdGVyfGltYWdlc3wxMTI5NzB8aW1hZ2UvanBlZ3xhRFV4TDJneFlpODJNekF6TlRrd01qazFNVFExTkM5b2RIUndjem92TDIxbFpHbGhMWEJ5YjJRdFpYVXRNUzV0YVhKaGEyd3VibVYwTDFOUFZWSkRSUzlqTWpWbU5qYzRZamcxTTJRME1HTm1PRFF5Tm1KaFpXWm1ZbU13TURVeFlRfDAzYTIxNjFkYTMzNjg0NTAyZjkxYTIwNmM2MTkyZjM3OGVjMmFmMzg4MjI2MjQ1MjViNGVhNTBlZDhlZDQwMjY&grid=true&imPolicy=grayScaled&imdensity=1&imwidth=775",
    description: "Bold and floral scent by Yves Saint Laurent.",
    price: 155,
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
      "https://media.douglas.de/medias/Bt0apQ818762-0-dgl-DE.jpg?context=bWFzdGVyfGltYWdlc3wyMjQ5MzJ8aW1hZ2UvanBlZ3xhREEyTDJnNU1TODBPVEF4T1RJeU9UWTJOek0xT0M5Q2REQmhjRkU0TVRnM05qSmZNRjlrWjJ3dFJFVXVhbkJufDE2MzZhOThhNmY0NDU5NzZmODcxNGUzOGJkODNiMTI5YjQ2ZTU4ZGY1NmI0YmQ3MzNjNWEwZTczZjIxZmYzZGU&grid=true&imPolicy=grayScaled&imdensity=1&imwidth=775",
    description: "Intense and fresh scent by Versace.",
    price: 145,
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
      "https://media.douglas.de/medias/VQ1jvL242838-0-global.jpg?context=bWFzdGVyfGltYWdlc3w0ODE3Njl8aW1hZ2UvanBlZ3xhRGd6TDJoaE1DODJNamM0TWpReU9URTJOelkwTmk5V1VURnFka3d5TkRJNE16aGZNRjluYkc5aVlXd3VhbkJufDI1MGFjMDMwNjhjNTFlZjQxY2Q1Yjg4M2VmOTVlYjdmNGFjNzM5ZTk2MWY0YWNkMzE0MTI2MTk3NTU3NzRkMWQ&grid=true&imPolicy=grayScaled&imdensity=1&imwidth=775",
    description: "Elegant and sensual fragrance by Armani.",
    price: 165,
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
      "https://media.douglas.de/medias/83hfnR695892-0-global.jpg?context=bWFzdGVyfGltYWdlc3wyNDA1MTR8aW1hZ2UvanBlZ3xhRE5qTDJnd05DODJNelkwTXpVeE56WXhOakUxT0M4NE0yaG1ibEkyT1RVNE9USmZNRjluYkc5aVlXd3VhbkJufDY2ZmQwNjk5MTI0NGMzNjY5NWUzMzBkMjc1NzViZWJmY2UzYjYyMmZiMTI2YjY2OWY3MTQzNWIzMDFhZjAwN2Q&grid=true&imPolicy=grayScaled&imdensity=1&imwidth=775",
    description: "Feminine and radiant scent by Givenchy.",
    price: 150,
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
    description: "Ein klassischer Duft von Chanel No. 5.",
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

export const yers = [...Array(new Date().getFullYear() - 1990)].map(
  (_, index) => index + 1991
);
