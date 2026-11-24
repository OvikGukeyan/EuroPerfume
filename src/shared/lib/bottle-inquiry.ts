import { business } from "../constants/business";

// Opens the customer's mail app only. Does not create an order, invoice or stock reservation.
export function bottleInquiry(input: { id: number; name: string; ml: number; locale: string }) {
  if (!Number.isSafeInteger(input.id) || input.id <= 0 || !Number.isFinite(input.ml) || input.ml <= 0) return null;
  const name = input.name.replace(/[\r\n]/g, " ").trim().slice(0, 200);
  const ru = input.locale === "ru";
  const subject = `${ru ? "Запрос наличия" : "Verfügbarkeitsanfrage"}: ${name} ${input.ml} ml`;
  const body = ru
    ? `Здравствуйте! Прошу подтвердить наличие, конечную цену и срок доставки полного флакона: ${name}, ${input.ml} мл (товар №${input.id}).`
    : `Guten Tag! Bitte bestätigen Sie Verfügbarkeit, Endpreis und Lieferzeit für den Originalflakon: ${name}, ${input.ml} ml (Artikel ${input.id}).`;
  return `mailto:${business.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
