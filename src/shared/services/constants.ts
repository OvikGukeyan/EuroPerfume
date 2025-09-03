export enum ApiRouts {
    SEARCH_PRODUCTS='/products/search',
    PRODUCTS='/products',
    SLIDES='/slides',
    SLIDES_REORDER='/slides/reorder',
    BY_IDS='/products/by-ids' ,
    CHECK_PROMOCODE='/promocode/validate'
}

export const links = [
    {
      label: {
        ru: "Доставка и оплата",
        de: "Lieferung und Zahlung",
      },
      href: "/delivery-and-payment",
    },
    {
      label: {
        ru: "Возврат и обмен",
        de: "Rückgabe und Austausch",
      },
      href: "/return-and-exchange",
    },
    {
      label: {
        ru: "Отзывы",
        de: "Bewertungen",
      },
      href: "/reviews",
    },
    {
      label: {
        ru: "FAQ",
        de: "FAQ",
      },
      href: "/faq",
    },
    {
      label: {
        ru: "AGB",
        de: "AGB",
      },
      href: "/agb",
    },

    {
      label: {
        ru: "Cookies",
        de: "Cookies",
      },
      href: "/cookies-info",
    }
  ];