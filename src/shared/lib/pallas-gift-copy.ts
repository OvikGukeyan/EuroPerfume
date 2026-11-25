import { PALLAS_GIFT } from "./pallas-gift-rules";

// Shared by the banner and terms page. Gift allocation remains in pallas-gift.ts.
export const PALLAS_GIFT_HREF = `/offers/${PALLAS_GIFT.slug}`;
export function pallasGiftCopy(locale: string) {
  const ru = locale === "ru";
  const amount = PALLAS_GIFT.thresholdCents / 100;
  return {
    eyebrow: ru ? "Искусство дарить" : "Die Kunst des Schenkens",
    threshold: ru ? `При заказе от ${amount} €` : `Ab ${amount} € Bestellwert`,
    gift: ru ? `${PALLAS_GIFT.ml} мл в подарок` : `${PALLAS_GIFT.ml} ml als Geschenk`,
    name: PALLAS_GIFT.name,
    limit: ru ? `Только первые ${PALLAS_GIFT.slots} подходящих заказов` : `Nur für die ersten ${PALLAS_GIFT.slots} qualifizierten Bestellungen`,
    cta: ru ? "Подробнее об акции" : "Mehr zur Aktion",
    summary: ru
      ? `При заказе от ${amount} € получите отливант ${PALLAS_GIFT.name} ${PALLAS_GIFT.ml} мл в подарок. Выбирайте отливанты, полные флаконы или сочетайте их — подарок добавится автоматически.`
      : `Ab ${amount} € Bestellwert erhältst du eine ${PALLAS_GIFT.ml}-ml-Abfüllung von ${PALLAS_GIFT.name} als Geschenk. Wähle Abfüllungen, Originalflakons oder beides — das Geschenk wird automatisch hinzugefügt.`,
    illustration: ru ? "Подарок — отливант 5 мл. Полный флакон показан для знакомства с ароматом." : "Geschenk: 5-ml-Abfüllung. Der Originalflakon dient zur Illustration des Duftes.",
    terms: ru ? [
      `Участвуют любые товары: отливанты и полноразмерные флаконы. Стоимость товаров — от ${amount} € после скидок и списания бонусных баллов, без доставки.`,
      `Всего ${PALLAS_GIFT.slots} подарков — для первых подходящих заявок. Один подарок на клиента.`,
      "Подарок отображается в корзине автоматически и закрепляется при успешной отправке заявки, пока подарки доступны. Промокод не нужен.",
      "Если после изменения корзины, применения скидки или баллов сумма товаров становится ниже порога, подарок не предоставляется.",
      "Онлайн-оплата не требуется: заказ согласовывается с вами, затем оплачивается по счёту."
    ] : [
      `Alle Produkte nehmen teil: Abfüllungen und Originalflakons. Der Warenwert muss nach Rabatten und Bonuspunkten mindestens ${amount} € betragen, ohne Versandkosten.`,
      `Insgesamt ${PALLAS_GIFT.slots} Geschenke für die ersten qualifizierten Anfragen. Ein Geschenk pro Kunde.`,
      "Das Geschenk erscheint automatisch im Warenkorb und wird beim erfolgreichen Absenden der Anfrage reserviert, solange Geschenke verfügbar sind. Kein Aktionscode erforderlich.",
      "Sinkt der Warenwert durch Änderungen, Rabatte oder Bonuspunkte unter den Mindestbetrag, entfällt das Geschenk.",
      "Keine Online-Zahlung erforderlich: Die Bestellung wird mit dir abgestimmt und anschließend per Rechnung bezahlt."
    ],
    unavailable: ru ? "Сейчас подарки по этой акции недоступны." : "Die Geschenke dieser Aktion sind derzeit nicht verfügbar.",
    shop: ru ? "Выбрать ароматы" : "Düfte entdecken"
  };
}

