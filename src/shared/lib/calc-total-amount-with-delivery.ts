export const euCountriesAlpha3 = [
  "AUT",
  "BEL",
  "BGR",
  "HRV",
  "CYP",
  "CZE",
  "DNK",
  "EST",
  "FIN",
  "FRA",
  "DEU",
  "GRC",
  "HUN",
  "IRL",
  "ITA",
  "LVA",
  "LTU",
  "LUX",
  "MLT",
  "NLD",
  "POL",
  "PRT",
  "ROU",
  "SVK",
  "SVN",
  "ESP",
  "SWE",
];

function getDeliveryPrice(country: string): number {
  if (country === "DEU") return 5.95;
  if (euCountriesAlpha3.includes(country)) return 14.49;
  return 20;
}
export const calcTotlalAmountWithDelivery = (
  totlalAmount: number,
  country: string,

  discount?: number
) => {
  let totalAmountWithDelivery = 0;
  let deliveryPrice = getDeliveryPrice(country);
  const totalAmountWithDiscount = discount
    ? totlalAmount - totlalAmount * (discount / 100)
    : totlalAmount;
  if (totlalAmount > 100 && country === "DEU") {
    deliveryPrice = 0;
    totalAmountWithDelivery = Number(totalAmountWithDiscount) ;
  } else {
    totalAmountWithDelivery = Number(totalAmountWithDiscount) + deliveryPrice;
  }
  totalAmountWithDelivery = Number(totalAmountWithDelivery.toFixed(2));
  return { totalAmountWithDelivery, deliveryPrice };
};
