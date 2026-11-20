import { FragranceAccordion } from "./fragrance-accordion";
import { resolveIngredients } from "../../lib/fragrance-ingredients";
export function ProductIngredients({productId,translations,locale}: {productId:number;translations:{language:string;activeIngredients?:string|null}[];locale:string}) {
 const ru=locale==="ru";
 const {inci,review}=resolveIngredients(productId,translations,locale);
 return <><FragranceAccordion id="ingredients" title={ru?"Состав и аллергены (INCI)":"Inhaltsstoffe & Allergene (INCI)"}>
   {inci ? <>
    {review && <p role="status" className="mb-3 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm font-medium text-amber-950">{ru?"Внимание: сохранённый список INCI требует сверки с упаковкой продаваемой партии. В нём обнаружено вещество, требующее проверки актуальности и допустимости состава. До покупки при аллергии запросите состав конкретного флакона.":"Achtung: Diese gespeicherte INCI-Liste muss mit der Verpackung der verkauften Charge abgeglichen werden. Sie enthält einen Stoff, dessen Aktualität und Zulässigkeit geprüft werden müssen. Bei Allergien bitte vor dem Kauf die Inhaltsstoffe der konkreten Charge anfragen."}</p>}
    <p className="whitespace-pre-wrap break-words">{inci}</p>
    <p className="mt-3">{ru?"Состав может различаться в зависимости от партии. Сверяйте список с упаковкой конкретного флакона. При аллергии уточните состав вашей партии у нас до покупки.":"Die Zusammensetzung kann je nach Charge abweichen. Bitte beachte die Liste auf der Verpackung des jeweiligen Flakons. Bei Allergien frage uns vor dem Kauf nach den Angaben zu deiner Charge."}</p>
   </> : <p>{ru?"Уточняем полный состав по упаковке. Если у вас есть аллергия, свяжитесь с нами до покупки — проверим состав конкретного флакона.":"Die vollständige Inhaltsstoffliste wird anhand der Verpackung geprüft. Bei Allergien kontaktiere uns bitte vor dem Kauf, damit wir die Angaben des jeweiligen Flakons prüfen können."}</p>}
 </FragranceAccordion>
 <FragranceAccordion id="warnings" title={ru?"Предупреждения":"Warnhinweise"}>
   <p>{ru?"Общие меры предосторожности при использовании парфюмерии:":"Allgemeine Sicherheitshinweise für die Anwendung von Parfum:"}</p>
   <ul className="list-disc pl-5 space-y-2 text-sm leading-7 text-neutral-600">
    <li>{ru?"Только для наружного применения. Не принимать внутрь.":"Nur zur äußeren Anwendung. Nicht einnehmen."}</li>
    <li>{ru?"Избегайте попадания в глаза и на слизистые оболочки. При попадании в глаза осторожно промывайте водой в течение нескольких минут. По возможности снимите контактные линзы и продолжайте промывание. При сохраняющемся раздражении обратитесь к врачу.":"Kontakt mit Augen und Schleimhäuten vermeiden. Bei Augenkontakt einige Minuten vorsichtig mit Wasser spülen. Kontaktlinsen nach Möglichkeit entfernen und weiter spülen. Bei anhaltender Reizung ärztlichen Rat einholen."}</li>
    <li>{ru?"Не наносите на повреждённую или раздражённую кожу. При появлении раздражения прекратите использование.":"Nicht auf verletzte oder gereizte Haut auftragen. Bei Hautreizungen die Anwendung beenden."}</li>
    <li>{ru?"Храните в недоступном для детей месте.":"Außerhalb der Reichweite von Kindern aufbewahren."}</li>
    <li>{ru?"Спиртосодержащая парфюмерия огнеопасна. Храните вдали от нагрева, искр и открытого огня. Не используйте рядом с источниками воспламенения до полного высыхания.":"Alkoholhaltige Parfums sind entzündbar. Von Hitze, Funken und offenen Flammen fernhalten. Bis zur vollständigen Trocknung Zündquellen meiden."}</li>
   </ul>
   <p>{ru?"Дополнительно соблюдайте предупреждения производителя на упаковке конкретного аромата.":"Bitte zusätzlich die produktspezifischen Warnhinweise des Herstellers auf der Verpackung beachten."}</p>
 </FragranceAccordion></>;
}
