"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import { FlaskConical, Search } from "lucide-react";
import { Link } from "@/src/i18n/navigation";
import { linePrice } from "@/src/shared/lib/day-offer";
import { euCountriesAlpha3 } from "@/src/shared/lib/calc-total-amount-with-delivery";
import { euroInputToCents, manualInvoiceInput, type ManualInvoiceCatalogItem, type ManualInvoiceInput } from "@/src/shared/lib/manual-invoice";
import { createManualRechnung, searchInvoiceCatalog } from "../actions";

type Row = { key: number; item: ManualInvoiceCatalogItem; variation: string; quantity: string; amount: string; edited: boolean };
const field = "w-full rounded-md border border-neutral-300 bg-white p-2.5 text-sm";
const button = "rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50";
function price(item: ManualInvoiceCatalogItem, quantity: string) {
  const value = Number(quantity);
  return Number.isInteger(value) && value > 0 && value <= 500 ? linePrice(item.price, value, item.onTap).toFixed(2) : "";
}

export default function ManualInvoiceForm({ ru, today }: { ru: boolean; today: string }) {
  const tr = (r: string, d: string) => ru ? r : d;
  const locale = ru ? "ru-RU" : "de-DE";
  const money = (cents: number) => new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(cents / 100);
  const [query, setQuery] = useState("");
  const [lookup, setLookup] = useState<{ query: string; items: ManualInvoiceCatalogItem[]; failed: boolean } | null>(null);
  const [searchVersion, setSearchVersion] = useState(0);
  const searchBox = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [shipping, setShipping] = useState("0.00");
  const [review, setReview] = useState<ManualInvoiceInput | null>(null);
  const [receipt, setReceipt] = useState<{ invoiceNumber: string; invoiceUrl: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [uncertain, setUncertain] = useState(false);
  const [error, setError] = useState("");
  const rowKey = useRef(0);
  const requestId = useRef("");
  const issueLock = useRef(false);

  const searchTerm = query.trim();
  const canSearch = searchTerm.length >= 2 || /^\d$/.test(searchTerm);
  const current = canSearch && lookup?.query === searchTerm ? lookup : null;
  useEffect(() => {
    if (!canSearch || review || receipt) return;
    let active = true;
    const timer = window.setTimeout(async () => {
      try {
        const items = await searchInvoiceCatalog(searchTerm);
        if (active) setLookup({ query: searchTerm, items, failed: false });
      } catch {
        if (active) setLookup({ query: searchTerm, items: [], failed: true });
      }
    }, 250);
    return () => { active = false; window.clearTimeout(timer); };
  }, [canSearch, searchTerm, searchVersion, review, receipt]);
  function add(item: ManualInvoiceCatalogItem) {
    const key = ++rowKey.current;
    setRows(previous => previous.length >= 30 ? previous : [...previous, {
      key, item, variation: item.variations.length === 1 ? String(item.variations[0].id) : "",
      quantity: "1", amount: price(item, "1"), edited: false,
    }]);
    setQuery(""); setLookup(null); searchBox.current?.focus();
  }
  function update(key: number, patch: Partial<Row>) {
    setRows(previous => previous.map(row => row.key !== key ? row : { ...row, ...patch }));
  }
  const subtotal = rows.reduce((sum, row) => sum + euroInputToCents(row.amount), 0);
  const total = subtotal + euroInputToCents(shipping);
  const labels = {
    name: tr("Имя и фамилия / компания", "Vor- und Nachname / Firma"),
    street: tr("Улица", "Straße"), house: tr("Дом", "Hausnummer"),
    zip: tr("Индекс", "PLZ"), city: tr("Город", "Ort"), country: tr("Страна", "Land"),
    email: tr("Email (необязательно)", "E-Mail (optional)"),
  };
  const errors: Record<string, string> = {
    INVALID_INPUT: tr("Проверьте реквизиты и суммы. Для каждой позиции укажите формат, если он есть.", "Bitte Adressen, Beträge und ggf. Varianten prüfen."),
    ORDER_DATE: tr("Проверьте дату заказа.", "Bitte das Bestelldatum prüfen."),
    SUPPLY_DATE: tr("Дата поставки должна быть между датой заказа и сегодняшним днём.", "Das Leistungsdatum muss zwischen Bestelldatum und heute liegen."),
    TAX_REVIEW: tr("Для этой страны не настроен режим НДС. Счёт не выпущен.", "Für dieses Land fehlt die USt-Konfiguration. Keine Rechnung ausgestellt."),
    PRODUCT_VARIATION: tr("Вариант больше не совпадает с каталогом. Добавьте позицию заново.", "Die Variante passt nicht mehr zum Katalog. Artikel erneut auswählen."),
    ZERO_SUBTOTAL: tr("Укажите положительную стоимость товаров.", "Bitte einen positiven Warenwert angeben."),
    REQUEST_ALREADY_EXISTS: tr("По этой операции уже есть запись. Проверьте архив, прежде чем создавать ещё один счёт.", "Zu diesem Vorgang gibt es bereits einen Eintrag. Bitte zuerst das Archiv prüfen."),
    FAILED: tr("Нет подтверждения выпуска. Повторите ту же операцию или проверьте архив.", "Ausstellung nicht bestätigt. Vorgang erneut versuchen oder Archiv prüfen."),
  };
  function preview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const get = (key: string) => String(values.get(key) ?? "");
    requestId.current ||= crypto.randomUUID();
    const parsed = manualInvoiceInput.safeParse({
      requestId: requestId.current, orderDate: get("orderDate"), supplyDate: get("supplyDate"),
      customer: { name: get("name"), street: get("street"), house: get("house"), zip: get("zip"), city: get("city"), country: get("country"), email: get("email") },
      shippingCents: euroInputToCents(shipping),
      rows: rows.map(row => ({ productId: row.item.id, variationId: row.variation ? Number(row.variation) : null, quantity: Number(row.quantity), grossCents: euroInputToCents(row.amount) })),
    });
    if (!parsed.success || rows.some(row => row.item.variations.length > 0 && !row.variation)) {
      setError(errors.INVALID_INPUT); return;
    }
    if (subtotal <= 0) { setError(errors.ZERO_SUBTOTAL); return; }
    setError(""); setReview(parsed.data);
  }
  async function issue() {
    if (!review || issueLock.current) return;
    issueLock.current = true;
    setBusy(true); setError("");
    try {
      const result = await createManualRechnung(review);
      if (result.ok) {
        setReceipt(result);
        setUncertain(false);
      } else {
        setError(errors[result.error] || errors.FAILED);
        setUncertain(result.error === "FAILED" || result.error === "REQUEST_ALREADY_EXISTS");
      }
    } catch {
      setError(errors.FAILED); setUncertain(true);
    } finally {
      issueLock.current = false; setBusy(false);
    }
  }

  return <div className="mx-auto w-full max-w-4xl space-y-5 p-4 sm:p-8">
    <Link className="text-sm underline" href="/invoices">{tr("← Архив счетов", "← Rechnungsarchiv")}</Link>
    <h1 className="text-2xl font-semibold">{tr("Новый счёт из соцсетей", "Neue Rechnung für einen externen Verkauf")}</h1>
    <p className="text-sm text-neutral-600">{tr("Счёт получает следующий номер из общей серии сайта и сохраняется в архиве. Оплата и письмо покупателю не запускаются.", "Die Rechnung erhält die nächste Nummer des Shops und wird archiviert. Es wird weder eine Zahlung noch eine Kunden-E-Mail ausgelöst.")}</p>
    {receipt ? <section className="space-y-4 rounded-lg border bg-emerald-50 p-5">
      <p role="status" className="font-semibold">{tr("Счёт выпущен:", "Rechnung ausgestellt:")} {receipt.invoiceNumber}</p>
      <div className="flex flex-wrap gap-4">
        <a className={button} href={receipt.invoiceUrl}>{tr("Скачать оригинал PDF", "Original-PDF herunterladen")}</a>
        <Link className="self-center underline" href="/invoices">{tr("Открыть архив", "Archiv öffnen")}</Link>
        <button type="button" className="underline" onClick={() => window.location.reload()}>{tr("Создать ещё счёт", "Weitere Rechnung erstellen")}</button>
      </div>
    </section> : <>
      <section className="space-y-3 rounded-lg border bg-white p-4" hidden={!!review}>
        <label className="block text-sm">
          {tr("Добавить аромат по названию, бренду или ID", "Duft hinzufügen: Name, Marke oder ID")}
          <span className="relative mt-1 block">
            <Search aria-hidden size={17} className="pointer-events-none absolute left-3 top-3 text-neutral-500" />
            <input ref={searchBox} className={field + " pl-9"} type="search" maxLength={100} autoComplete="off"
              placeholder={tr("Начни вводить название…", "Namen eingeben…")} value={query}
              onChange={event => { setQuery(event.currentTarget.value); setLookup(null); }} />
          </span>
        </label>
        <div aria-live="polite" aria-atomic="true" className="text-sm text-neutral-600">
          {canSearch && !current ? tr("Ищу…", "Suche…") : current?.failed ? tr("Не удалось загрузить список.", "Die Liste konnte nicht geladen werden.") :
            current?.items.length === 0 ? tr("Ничего не найдено", "Keine Artikel gefunden") : ""}
        </div>
        {current?.failed && <button type="button" className="text-sm underline" onClick={() => { setLookup(null); setSearchVersion(v => v + 1); }}>{tr("Повторить поиск", "Suche wiederholen")}</button>}
        {!!current?.items.length && <ul className="max-h-80 overflow-auto divide-y rounded-md border" aria-label={tr("Найденные ароматы", "Gefundene Düfte")}>
          {current.items.map(item => <li key={item.id}>
            <button type="button" className="flex w-full items-center gap-3 p-2.5 text-left text-sm hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-inset disabled:opacity-50"
              disabled={rows.length >= 30} onClick={() => add(item)}>
              <span className="relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-md bg-neutral-100 text-neutral-400">
                <FlaskConical aria-hidden size={17} />
                {item.imageUrl && <Image src={item.imageUrl} alt="" width={48} height={48} unoptimized
                  className="absolute inset-0 h-full w-full bg-neutral-100 object-contain"
                  onError={event => { event.currentTarget.hidden = true; }} />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-medium">{item.title}</span>
                <small className="block text-neutral-600">#{item.id} · {item.onTap ? tr("отливант", "Abfüllung") : tr("флакон / шт.", "Flakon / Stück")}</small>
              </span>
              <span aria-hidden className="shrink-0 font-semibold">＋</span>
            </button>
          </li>)}
        </ul>}
      </section>
      <form onSubmit={preview} className="space-y-4" hidden={!!review}>
        <fieldset className="space-y-3 rounded-lg border bg-white p-4">
          <legend className="px-2 font-semibold">{tr("Позиции", "Positionen")}</legend>
          {rows.length === 0 && <p className="text-sm text-neutral-600">{tr("Найди и добавь позиции из каталога.", "Artikel aus dem Katalog suchen und hinzufügen.")}</p>}
          {rows.map((row, index) => <div key={row.key} className="space-y-2 rounded-md border p-3">
            <div className="flex justify-between gap-3 text-sm">
              <strong>{index + 1}. {row.item.title}</strong>
              <button type="button" onClick={() => setRows(previous => previous.filter(i => i.key !== row.key))} className="underline">{tr("Удалить", "Entfernen")}</button>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              {!!row.item.variations.length && <label className="text-sm">{tr("Вариант", "Variante")}
                <select className={field} required value={row.variation} onChange={event => update(row.key, { variation: event.currentTarget.value })}>
                  <option value="">{tr("Выбрать", "Bitte wählen")}</option>
                  {row.item.variations.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
              </label>}
              <label className="text-sm">{row.item.onTap ? tr("Объём, мл", "Füllmenge, ml") : tr("Количество, шт.", "Menge, Stück")}
                <input className={field} type="number" min={1} max={500} required value={row.quantity} onChange={event => {
                  const quantity = event.currentTarget.value;
                  update(row.key, { quantity, ...(!row.edited ? { amount: price(row.item, quantity) } : {}) });
                }} />
              </label>
              <label className="text-sm">{tr("Сумма за позицию, €", "Tatsächlicher Positionsbetrag, €")}
                <input className={field} required inputMode="decimal" value={row.amount} onChange={event => update(row.key, { amount: event.currentTarget.value, edited: true })} />
              </label>
            </div>
          </div>)}
          <p className="text-xs text-neutral-600">{tr("Цена подставляется из каталога. Если договаривались о другой сумме, укажи фактическую цену за всю позицию.", "Der Katalogpreis ist vorausgefüllt. Bei abweichenden Vereinbarungen den tatsächlichen Gesamtpreis je Position eintragen.")}</p>
        </fieldset>
        <fieldset className="grid gap-3 rounded-lg border bg-white p-4 sm:grid-cols-2">
          <legend className="px-2 font-semibold">{tr("Адрес выставления счёта", "Rechnungsadresse")}</legend>
          {(["name", "street", "house", "zip", "city", "email"] as const).map(key => <label key={key} className="text-sm">
            {labels[key]}<input className={field} name={key} required={key !== "email"} type={key === "email" ? "email" : "text"} maxLength={{name:100, street:100, house:20, zip:16, city:80, email:254}[key]} />
          </label>)}
          <label className="text-sm">{labels.country}
            <select name="country" className={field} defaultValue="DEU">
              {euCountriesAlpha3.map(code => <option value={code} key={code}>{code === "DEU" ? tr("Германия (DEU)", "Deutschland (DEU)") : code}</option>)}
            </select>
          </label>
        </fieldset>
        <fieldset className="grid gap-3 rounded-lg border bg-white p-4 sm:grid-cols-3">
          <legend className="px-2 font-semibold">{tr("Даты и доставка", "Daten und Versand")}</legend>
          <label className="text-sm">{tr("Дата заказа", "Bestelldatum")}<input className={field} type="date" name="orderDate" required max={today} defaultValue={today} /></label>
          <label className="text-sm">{tr("Дата поставки", "Leistungsdatum")}<input className={field} type="date" name="supplyDate" required max={today} /></label>
          <label className="text-sm">{tr("Стоимость доставки, €", "Versandkosten, €")}<input className={field} inputMode="decimal" value={shipping} required onChange={event => setShipping(event.currentTarget.value)} /></label>
        </fieldset>
        <p className="font-semibold">{tr("Итого:", "Gesamtbetrag:")} {Number.isFinite(total) ? money(total) : "—"}</p>
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        <button className={button} disabled={!rows.length}>{tr("Проверить счёт", "Rechnung prüfen")}</button>
      </form>
      {review && <section className="space-y-4 rounded-lg border bg-white p-5">
        <h2 className="text-lg font-semibold">{tr("Проверь данные перед выпуском", "Daten vor der Ausstellung prüfen")}</h2>
        <p className="text-sm">{review.customer.name}<br />{review.customer.street} {review.customer.house}<br />{review.customer.zip} {review.customer.city}, {review.customer.country}</p>
        <p className="text-sm">{tr("Дата заказа:", "Bestelldatum:")} {review.orderDate} · {tr("Дата поставки:", "Leistungsdatum:")} {review.supplyDate}</p>
        <ul className="space-y-2 text-sm">
          {review.rows.map((line, index) => <li key={rows[index].key} className="flex justify-between gap-2 border-b pb-1">
            <span>{rows[index].item.title}{line.variationId ? " · " + (rows[index].item.variations.find(v => v.id === line.variationId)?.name ?? "") : ""} · {line.quantity} {rows[index].item.onTap ? "ml" : tr("шт.", "Stk.")}</span>
            <strong className="whitespace-nowrap">{money(line.grossCents)}</strong>
          </li>)}
        </ul>
        <p>{tr("Доставка:", "Versand:")} {money(review.shippingCents)} · <strong>{tr("Итого:", "Gesamt:")} {money(total)}</strong></p>
        <p className="text-sm text-neutral-600">{tr("Номер присваивается только при выпуске. Сохранённый PDF не пересоздаётся; исправления делаются через Storno.", "Die Nummer wird erst bei der Ausstellung vergeben. Das Original bleibt unverändert; Korrekturen erfolgen über Storno.")}</p>
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        <div className="flex flex-wrap gap-4">
          <button type="button" className={button} onClick={issue} disabled={busy}>{busy ? tr("Выпускаю…", "Wird ausgestellt…") : uncertain ? tr("Повторить ту же операцию", "Denselben Vorgang erneut versuchen") : tr("Выпустить Rechnung", "Rechnung ausstellen")}</button>
          {uncertain ? <Link className="self-center underline" href="/invoices">{tr("Проверить архив", "Archiv prüfen")}</Link> : <button type="button" className="underline" disabled={busy} onClick={() => { setReview(null); setError(""); }}>{tr("Редактировать", "Bearbeiten")}</button>}
        </div>
      </section>}
    </>}
  </div>;
}
