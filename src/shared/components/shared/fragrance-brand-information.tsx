import React from "react";
import { fragranceBrandContact } from "../../lib/fragrance-brand-contacts";
import { FragranceAccordion } from "./fragrance-accordion";

export function FragranceBrandInformation({brandName, locale}:{brandName:string; locale:string}) {
 const ru=locale==="ru";
 const brand=fragranceBrandContact(brandName);
 return <FragranceAccordion id="brand-information" title={ru?"Бренд и информация о товаре":"Marke und Produktinformationen"}>
  <p className="font-medium">{brandName}</p>
  {brand ? <dl className="mt-2 grid gap-2">
   <div>
    <dt>{ru?"Официальный сайт":"Offizielle Website"}</dt>
    <dd className="break-all">{brand.website}</dd>
   </div>
   {brand.email && <div>
    <dt>{ru?"Email бренда":"E-Mail der Marke"}</dt>
    <dd className="break-all">{brand.email}</dd>
   </div>}
   <div>
    <dt>{ru?"Страница контактов бренда":"Kontaktseite der Marke"}</dt>
    <dd className="break-all">{brand.contact}</dd>
   </div>
  </dl> : null}
  <p className="mt-3">{ru
   ? "Контакты бренда не заменяют данные производителя или ответственного лица. Если вам нужны данные с маркировки конкретного товара, уточните их у EURO PERFUME перед заказом."
   : "Markenkontakte ersetzen keine Angaben zum Hersteller oder zur verantwortlichen Person. Angaben auf der Kennzeichnung des konkreten Produkts kannst du vor der Bestellung bei EURO PERFUME erfragen."}</p>
 </FragranceAccordion>;
}
