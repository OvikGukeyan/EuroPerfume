"use client";

import { FormEvent, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { business } from "@/src/shared/constants/business";
import { WithdrawalReceipt, withdrawalSchema } from "@/src/shared/lib/withdrawal";
import { Link } from "@/src/i18n/navigation";

const copy = {
  de: {
    title: "Vertrag widerrufen", intro: "Sie können Ihren Widerruf hier ohne Kundenkonto erklären. Ein Grund ist nicht erforderlich. Prüfen Sie Ihre Angaben im nächsten Schritt und bestätigen Sie anschließend den Widerruf.",
    name: "Vor- und Nachname", email: "E-Mail für die Eingangsbestätigung", contract: "Bestellnummer oder Angaben zum Vertrag / den betroffenen Waren", help: "Geben Sie die Bestellung oder die Waren an, auf die sich Ihr Widerruf bezieht. Für einen teilweisen Widerruf nennen Sie bitte die betroffenen Artikel.",
    next: "Angaben prüfen", review: "Widerruf prüfen", back: "Angaben bearbeiten", confirm: "Widerruf bestätigen", sending: "Widerruf wird übermittelt …",
    declaration: "Hiermit widerrufe ich den von mir abgeschlossenen Vertrag über den Kauf der angegebenen Waren beziehungsweise den angegebenen Teil des Vertrags.",
    success: "Ihre Widerrufserklärung ist eingegangen.", sent: "Die Eingangsbestätigung wurde an die angegebene E-Mail-Adresse versandt. Sie können zusätzlich eine Kopie herunterladen.",
    pending: "Ihre Erklärung wurde mit Datum und Uhrzeit gespeichert. Die E-Mail-Bestätigung konnte noch nicht versandt werden. Laden Sie jetzt eine dauerhafte Kopie herunter; Sie können den E-Mail-Versand erneut versuchen.", retry: "E-Mail-Bestätigung erneut senden",
    download: "Eingangsbestätigung herunterladen", required: "Bitte prüfen Sie die Pflichtangaben und die E-Mail-Adresse.",
    error: "Die Übermittlung konnte nicht bestätigt werden. Bitte versuchen Sie es erneut oder erklären Sie Ihren Widerruf direkt per E-Mail.",
    limited: "Bitte versuchen Sie es später erneut oder senden Sie Ihren Widerruf direkt per E-Mail.",
    received: "Eingegangen am", reference: "Referenz", policy: "Widerrufsbelehrung", alternative: "Sie können Ihren Widerruf auch per Brief oder E-Mail erklären:", privacy: "Informationen zur Datenverarbeitung",
  },
  ru: {
    title: "Отказаться от договора", intro: "Здесь можно заявить об отказе от договора без входа в аккаунт. Указывать причину не требуется. На следующем шаге проверьте данные и подтвердите отправку заявления.",
    name: "Имя и фамилия", email: "E-mail для подтверждения получения", contract: "Номер заказа или сведения о договоре / возвращаемых товарах", help: "Укажите заказ или товары, к которым относится отказ. Если возвращаете часть заказа, перечислите соответствующие позиции.",
    next: "Проверить данные", review: "Проверка заявления", back: "Изменить данные", confirm: "Подтвердить отказ от договора", sending: "Отправляем заявление…",
    declaration: "Настоящим я отказываюсь от заключённого мной договора покупки указанных товаров либо от указанной части договора.",
    success: "Заявление об отказе от договора получено.", sent: "Подтверждение отправлено на указанный e-mail. Вы также можете скачать копию.",
    pending: "Заявление зарегистрировано с датой и временем получения. Письмо пока не удалось отправить. Скачайте копию подтверждения; отправку письма можно повторить.", retry: "Повторить отправку подтверждения",
    download: "Скачать подтверждение", required: "Проверьте обязательные поля и адрес электронной почты.",
    error: "Не удалось подтвердить отправку. Попробуйте ещё раз или направьте заявление непосредственно по электронной почте.",
    limited: "Попробуйте позднее или отправьте заявление непосредственно по электронной почте.",
    received: "Дата получения", reference: "Номер заявления", policy: "Правила отказа от договора", alternative: "Вы также можете направить заявление письмом или по электронной почте:", privacy: "Обработка персональных данных",
  },
};

export function WithdrawalForm() {
  const locale = useLocale() === "ru" ? "ru" : "de";
  const t = copy[locale];
  const [values, setValues] = useState({ fullName: "", email: "", contractIdentifier: "", website: "" });
  const [review, setReview] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const requestId = useRef<string | null>(null);
  const [receipt, setReceipt] = useState<WithdrawalReceipt | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const inFlight = useRef(false);
  const inputClass = "mt-2 w-full rounded-md border border-gray-400 bg-white px-3 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900";

  function check(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const id = requestId.current ?? crypto.randomUUID();
    const parsed = withdrawalSchema.safeParse({ ...values, locale, requestId: id });
    if (!parsed.success) { setError(t.required); return; }
    setValues({ fullName: parsed.data.fullName, email: parsed.data.email, contractIdentifier: parsed.data.contractIdentifier, website: "" });
    requestId.current = id;
    setError(""); setReview(true);
    requestAnimationFrame(() => heading.current?.focus());
  }

  async function submit() {
    if (inFlight.current) return;
    inFlight.current = true; setBusy(true); setError("");
    try {
      const response = await fetch("/api/withdrawal", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, locale, requestId: requestId.current }),
      });
      if (!response.ok) throw new Error(response.status === 429 ? "LIMITED" : "FAILED");
      const data = await response.json();
      if (!data.receipt?.reference || !data.receipt?.receivedAt || !data.receipt?.text) throw new Error("FAILED");
      setReceipt(data.receipt);
      setEmailSent(data.emailSent === true);
      if (data.emailSent !== true) download(data.receipt);
      requestAnimationFrame(() => heading.current?.focus());
    } catch (e) {
      setError(e instanceof Error && e.message === "LIMITED" ? t.limited : t.error);
    } finally { inFlight.current = false; setBusy(false); }
  }

  function download(value: WithdrawalReceipt | null = receipt) {
    if (!value) return;
    const url = URL.createObjectURL(new Blob([value.text], { type: "text/plain;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url; anchor.download = `EURO-PERFUME-Widerruf-${value.reference}.txt`;
    anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 text-gray-800">
      <h1 className="mb-4 text-3xl font-semibold">{t.title}</h1>
      <p className="mb-6 leading-relaxed">{t.intro}</p>
      {receipt ? (
        <section className="rounded-lg border border-green-700 bg-green-50 p-6" role="status">
          <h2 ref={heading} tabIndex={-1} className="mb-3 text-xl font-semibold">{t.success}</h2>
          <p className="mb-4">{emailSent ? t.sent : t.pending}</p>
          <p className="break-all">{t.reference}: {receipt.reference}</p>
          <p className="my-3">{t.received}: {new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "de-DE", { dateStyle: "long", timeStyle: "long", timeZone: "Europe/Berlin" }).format(new Date(receipt.receivedAt))}</p>
          <button type="button" onClick={() => download()} className="mt-3 rounded-md border border-gray-900 bg-white px-5 py-3 font-medium">{t.download}</button>
          {!emailSent && <button type="button" disabled={busy} onClick={submit} className="mt-3 rounded-md border border-gray-900 bg-white px-5 py-3 font-medium disabled:opacity-50">{busy ? t.sending : t.retry}</button>}
        </section>
      ) : review ? (
        <section className="rounded-lg border bg-gray-50 p-6">
          <h2 ref={heading} tabIndex={-1} className="mb-5 text-xl font-semibold">{t.review}</h2>
          <dl className="space-y-4 break-words">
            <div><dt className="font-semibold">{t.name}</dt><dd>{values.fullName}</dd></div>
            <div><dt className="font-semibold">{t.email}</dt><dd>{values.email}</dd></div>
            <div><dt className="font-semibold">{t.contract}</dt><dd className="whitespace-pre-wrap">{values.contractIdentifier}</dd></div>
          </dl>
          <p className="my-6 rounded-md border bg-white p-4">{t.declaration}</p>
          <div className="flex flex-wrap gap-3">
            <button type="button" disabled={busy} onClick={() => { setReview(false); setError(""); requestId.current = null; }} className="rounded-md border border-gray-500 px-5 py-3 disabled:opacity-50">{t.back}</button>
            <button type="button" disabled={busy} onClick={submit} className="rounded-md bg-gray-900 px-5 py-3 font-semibold text-white disabled:opacity-50">{busy ? t.sending : t.confirm}</button>
          </div>
        </section>
      ) : (
        <form onSubmit={check} className="space-y-6">
          <div><label htmlFor="withdrawal-name" className="font-medium">{t.name} *</label><input id="withdrawal-name" name="fullName" autoComplete="name" required maxLength={150} value={values.fullName} onChange={e => setValues(v => ({ ...v, fullName: e.target.value }))} className={inputClass} /></div>
          <div><label htmlFor="withdrawal-email" className="font-medium">{t.email} *</label><input id="withdrawal-email" name="email" type="email" autoComplete="email" required maxLength={254} value={values.email} onChange={e => setValues(v => ({ ...v, email: e.target.value }))} className={inputClass} /></div>
          <div><label htmlFor="withdrawal-contract" className="font-medium">{t.contract} *</label><textarea id="withdrawal-contract" name="contractIdentifier" rows={4} required maxLength={1000} aria-describedby="withdrawal-contract-help" value={values.contractIdentifier} onChange={e => setValues(v => ({ ...v, contractIdentifier: e.target.value }))} className={inputClass} /><p id="withdrawal-contract-help" className="mt-2 text-sm text-gray-600">{t.help}</p></div>
          <div className="hidden" aria-hidden="true"><label htmlFor="withdrawal-website">Website</label><input id="withdrawal-website" tabIndex={-1} autoComplete="off" value={values.website} onChange={e => setValues(v => ({ ...v, website: e.target.value }))} /></div>
          <button type="submit" className="rounded-md bg-gray-900 px-6 py-3 font-semibold text-white">{t.next}</button>
        </form>
      )}
      {error && <div role="alert" className="mt-5 rounded-md border border-red-500 bg-red-50 p-4"><p>{error}</p><a href={`mailto:${business.email}`} className="mt-2 inline-block underline">{business.email}</a></div>}
      <div className="mt-8 space-y-3 border-t pt-6 text-sm leading-relaxed">
        <p>{t.alternative}</p>
        <p>{business.name}, {business.proprietor}<br />{business.street}, {business.city}, {business.country}<br /><a href={`mailto:${business.email}`} className="underline">{business.email}</a></p>
        <div className="flex flex-wrap gap-5"><Link href="/return-and-exchange" className="underline">{t.policy}</Link><Link href="/data-protection" className="underline">{t.privacy}</Link></div>
      </div>
    </main>
  );
}
