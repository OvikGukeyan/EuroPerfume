import { resolveIngredients } from "../../lib/fragrance-ingredients";
export function ProductIngredients({productId,translations,locale}: {productId:number;translations:{language:string;activeIngredients?:string|null}[];locale:string}) {
 const ru=locale==="ru";
 const {inci,source,review}=resolveIngredients(productId,translations,locale);
 return <section className="fragrance-reading fragrance-inci" id="ingredients">
  <details>
   <summary>{ru?"Состав и аллергены (INCI)":"Inhaltsstoffe & Allergene (INCI)"}</summary>
   {inci && !review ? <>
    <p>{inci}</p>
    {source && <p>{ru?"Состав опубликован производителем: ":"Veröffentlichte Herstellerangaben: "}<a href={source.url} target="_blank" rel="noopener noreferrer">{source.brand}</a> · 16.11.2026</p>}
    <p>{ru?"Состав может различаться в зависимости от партии. Сверяйте список с упаковкой конкретного флакона. При аллергии уточните состав вашей партии у нас до покупки.":"Die Zusammensetzung kann je nach Charge abweichen. Bitte beachte die Liste auf der Verpackung des jeweiligen Flakons. Bei Allergien frage uns vor dem Kauf nach den Angaben zu deiner Charge."}</p>
   </> : <p>{ru?"Уточняем полный состав по упаковке. Если у вас есть аллергия, свяжитесь с нами до покупки — проверим состав конкретного флакона.":"Die vollständige Inhaltsstoffliste wird anhand der Verpackung geprüft. Bei Allergien kontaktiere uns bitte vor dem Kauf, damit wir die Angaben des jeweiligen Flakons prüfen können."}</p>}
  </details>
 </section>;
}
