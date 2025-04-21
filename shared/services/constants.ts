export enum ApiRouts {
    SEARCH_PRODUCTS='/products/search',
    PRODUCTS='/products'
}

export const links = [
    {
      label: {
        ru: "Доставка",
        de: "Lieferung",
      },
      href: "/delivery-info",
    },
    {
      label: {
        ru: "Возврат",
        de: "Rückgabe",
      },
      href: "/payment-info",
    },
    {
      label: {
        ru: "Оплата",
        de: "Zahlung",
      },
      href: "/payment-info",
    },
  ];