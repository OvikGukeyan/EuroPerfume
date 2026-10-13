// Current merchant details from europerfume.eu/policies/legal-notice.
export const business = {
  name: "EURO PERFUME",
  proprietor: "Vitalii Saiian",
  street: "Schillerstrasse 40",
  city: "49811 Lingen",
  country: "Deutschland",
  email: "europerfumeshop@gmail.com",
  phone: "+49 1523 1651047",
  vatId: "DE457176300",
} as const;

export const businessAddress = [business.name, business.proprietor, business.street, business.city, business.country].join("\n");
