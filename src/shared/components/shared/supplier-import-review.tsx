"use client";
import { useMemo, useState } from "react";
import { exportReview, MAX_IMPORT_BYTES, parseReview, type Decision, type Offer } from "../../lib/supplier-import";

export default function SupplierImportReview({ locale }: { locale: string }) {
  const t = (ru: string, de: string) => locale === "ru" ? ru : de;
  const [offers, setOffers] = useState<Offer[]>([]);
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [filename, setFilename] = useState("");
  const filtered = useMemo(() => offers.filter(row =>
    `${row.name} ${row.brand} ${row.sku} ${row.supplier}`.toLowerCase().includes(query.toLowerCase()) &&
    (filter === "all" || decisions[row.key]?.disposition === filter)), [offers, query, filter, decisions]);
  const lastPage = Math.max(0, Math.ceil(filtered.length / 25) - 1);
  const activePage = Math.min(page, lastPage);
  async function open(file: File | undefined) {
    if (!file || busy) return;
    setBusy(true); setError("");
    try {
      if (file.size > MAX_IMPORT_BYTES) throw new Error("10 MB");
      const parsed = parseReview(await file.text());
      setOffers(parsed.offers); setDecisions(parsed.decisions); setFilename(file.name); setPage(0);
    } catch {
      setError(t("Файл не принят: проверьте JSON, цены, уникальность SKU и размер до 10 МБ. Предыдущий список сохранён.", "Datei nicht angenommen: JSON, Preise, eindeutige SKUs und maximal 10 MB prüfen. Vorherige Liste bleibt erhalten."));
    } finally { setBusy(false); }
  }
  function update(key: string, change: Partial<Decision>) {
    setDecisions(old => ({ ...old, [key]: { ...old[key], ...change } }));
  }
  function download() {
    const url = URL.createObjectURL(new Blob([exportReview(offers, decisions)], { type: "application/json" }));
    const a = document.createElement("a"); a.href = url; a.download = "supplier-review-draft.json"; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  const labels: Record<string, string> = {
    identity: t("Проверить объём и концентрацию", "Größe und Konzentration prüfen"),
    current_stock: t("Подтвердить наличие", "Verfügbarkeit bestätigen"), image: t("Нужно фото", "Bild fehlt"),
    inci: "INCI", image_rights: t("Права на фото", "Bildrechte"), catalog_mapping: t("Сопоставить карточку", "Katalog zuordnen"),
    gtin: t("Ошибка EAN", "EAN prüfen"), stock_date: t("Нет даты остатков", "Bestandsdatum fehlt"),
    stock_quantity: t("Остаток неизвестен или нулевой", "Bestand fehlt oder ist null"),
    price_mismatch: t("Цена в файле отличается от расчёта", "Dateipreis weicht von Berechnung ab"), source_issue: t("Ошибка исходных данных", "Quelldaten prüfen"),
  };
  return <section className="mx-auto max-w-7xl space-y-6 p-4 md:p-8">
    <header><p className="text-sm font-medium text-teal-800">{t("Черновик импорта", "Importentwurf")}</p>
      <h1 className="mt-2 text-2xl font-semibold">{t("Проверка предложений поставщиков", "Lieferantenangebote prüfen")}</h1>
      <p className="mt-3 max-w-3xl leading-7">{t("Откройте shortlist.json, draft-offers.json или сохранённую проверку. Файл обрабатывается в этом браузере. Выбор для пилота не публикует товар и не подтверждает готовность к продаже.", "shortlist.json, draft-offers.json oder gespeicherte Prüfung öffnen. Verarbeitung erfolgt in diesem Browser. Pilotauswahl veröffentlicht kein Produkt und bestätigt keine Verkaufsfreigabe.")}</p>
    </header>
    <div className="rounded-lg border bg-white p-4">
      <label htmlFor="supplier-file" className="mb-2 block font-medium">{t("Файл предложений (JSON, до 10 МБ)", "Angebotsdatei (JSON, bis 10 MB)")}</label>
      <input id="supplier-file" type="file" accept=".json,application/json" disabled={busy} onChange={e => { void open(e.target.files?.[0]); e.target.value = ""; }} />
      <p className="mt-3 text-sm">{t("Перед заменой файла или закрытием страницы скачайте проверку: автоматического сохранения нет.", "Vor Dateitausch oder Schließen die Prüfung herunterladen: keine automatische Speicherung.")}</p>
      <p role="status" className="mt-2">{busy ? t("Проверяю файл…", "Datei wird geprüft…") : filename}</p>
      {error && <p role="alert" className="mt-2 text-red-700">{error}</p>}
    </div>
    {offers.length > 0 && <>
      <div className="flex flex-wrap items-end gap-4">
        <label className="flex-1">{t("Поиск", "Suche")}<input className="mt-1 block w-full rounded border p-2" value={query} onChange={e => { setQuery(e.target.value); setPage(0); }} /></label>
        <label>{t("Решение", "Entscheidung")}<select className="mt-1 block rounded border p-2" value={filter} onChange={e => { setFilter(e.target.value); setPage(0); }}>
          <option value="all">{t("Все", "Alle")}</option><option value="pending">{t("Не проверены", "Offen")}</option><option value="pilot">{t("В пилот", "Pilot")}</option><option value="hold">{t("Отложены", "Zurückgestellt")}</option>
        </select></label>
        <button type="button" onClick={download} className="rounded bg-teal-900 px-4 py-3 text-white">{t("Скачать проверку", "Prüfung herunterladen")}</button>
      </div>
      <p role="status">{t("Найдено", "Gefunden")}: {filtered.length} / {offers.length}. {t("В пилот", "Pilot")}: {Object.values(decisions).filter(d => d.disposition === "pilot").length}.</p>
      <p className="rounded border border-amber-200 bg-amber-50 p-4">{t("Цена 2027: (закупка + €5) × 1,30 × 1,19. В 2026 при Kleinunternehmer НДС не выделяется. Остаток поставщика не является вашим складом.", "Preis 2027: (Einkauf + 5 €) × 1,30 × 1,19. 2026 bei Kleinunternehmerbefreiung kein Umsatzsteuerausweis. Lieferantenbestand ist kein Eigenbestand.")}</p>
      <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b">
        {[t("Предложение", "Angebot"), t("Цена и остаток", "Preis und Bestand"), t("Проверка", "Prüfung"), t("Решение и заметки", "Entscheidung und Notizen")].map(x => <th key={x} className="p-3">{x}</th>)}
      </tr></thead><tbody>{filtered.slice(activePage * 25, activePage * 25 + 25).map(row => <tr key={row.key} className="border-b align-top">
        <td className="min-w-56 max-w-sm p-3"><strong>{row.name}</strong><p className="mt-2">{row.supplier} · {row.sku}</p><p className="mt-2 break-all">EAN: {row.eans.join(", ") || "—"}</p><p>{row.volume} · {row.concentration || "—"}</p></td>
        <td className="min-w-44 p-3"><p>{t("Закупка", "Einkauf")}: €{row.cost}</p><p className="mt-2 font-semibold">2027: €{row.calculatedPrice}</p><p className="mt-2">{t("У поставщика", "Beim Lieferanten")}: {row.supplierStock ?? "—"}</p><p>{row.stockAsOf || t("Дата неизвестна", "Datum unbekannt")}</p></td>
        <td className="min-w-60 p-3"><ul className="list-disc space-y-1 pl-4">{row.blockers.map(b => <li key={b}>{labels[b]}</li>)}</ul>
          <p className="mt-3">{t("Кандидаты по названию, не подтверждены", "Namenskandidaten, nicht bestätigt")}: {row.candidateProductIds?.join(", ") || "—"}</p>
          {row.issues?.map((issue, i) => <p key={i} className="mt-1 break-words text-amber-900">{issue}</p>)}
        </td>
        <td className="min-w-56 p-3"><label className="block">{t("Решение", "Entscheidung")}<select className="mt-1 block w-full rounded border p-2" value={decisions[row.key].disposition} onChange={e => update(row.key, { disposition: e.target.value as Decision["disposition"] })}>
          <option value="pending">{t("Не проверено", "Offen")}</option><option value="pilot">{t("Выбрать для пилота", "Für Pilot auswählen")}</option><option value="hold">{t("Отложить", "Zurückstellen")}</option>
        </select></label><label className="mt-3 block">{t("Заметка", "Notiz")}<textarea className="mt-1 block w-full rounded border p-2" rows={4} maxLength={2000} value={decisions[row.key].note} onChange={e => update(row.key, { note: e.target.value })} /></label></td>
      </tr>)}</tbody></table></div>
      <nav aria-label={t("Страницы предложений", "Angebotsseiten")} className="flex items-center gap-4">
        <button className="rounded border px-4 py-2 disabled:opacity-40" disabled={activePage === 0} onClick={() => setPage(activePage - 1)}>{t("Назад", "Zurück")}</button><span>{activePage + 1} / {lastPage + 1}</span>
        <button className="rounded border px-4 py-2 disabled:opacity-40" disabled={activePage === lastPage} onClick={() => setPage(activePage + 1)}>{t("Далее", "Weiter")}</button>
      </nav>
    </>}
  </section>;
}
