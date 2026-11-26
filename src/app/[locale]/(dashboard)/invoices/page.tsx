import prisma from "@/prisma/prisma-client";
import { Link } from "@/src/i18n/navigation";
import { berlinOfferTime } from "@/src/shared/lib/day-offer";
import { MANUAL_ORDER_PREFIX } from "@/src/shared/lib/manual-invoice";
import { requireInvoiceAdmin } from "@/src/shared/server-lib/invoice-corrections";

export const dynamic = "force-dynamic";
const PAGE_SIZE = 30;

export default async function InvoiceArchive({ params, searchParams }: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string; number?: string; period?: string }>;
}) {
  await requireInvoiceAdmin();
  const { locale } = await params;
  const ru = locale === "ru";
  const tr = (r: string, d: string) => ru ? r : d;
  const { number, page: rawPage, period: rawPeriod } = await searchParams;
  const period = typeof rawPeriod === "string" && /^20\d{2}(-(0[1-9]|1[0-2]))?$/.test(rawPeriod) ? rawPeriod : "";
  const year = period.slice(0, 4);
  const month = period.slice(5, 7);
  const query = typeof number === "string" ? number.trim().slice(0, 40) : "";
  const showInvoices = Boolean(month || query);
  const paginate = !month;
  const months = await prisma.$queryRaw<{ period: string; count: number }[]>`
    SELECT to_char(("issuedAt" AT TIME ZONE 'UTC') AT TIME ZONE 'Europe/Berlin', 'YYYY-MM') AS period,
           count(*)::int AS count
    FROM "Invoice"
    GROUP BY 1 ORDER BY 1 DESC
  `;
  const years = new Map<string, number>();
  for (const record of months) {
    const key = record.period.slice(0, 4);
    years.set(key, (years.get(key) ?? 0) + record.count);
  }
  const dateRange = period ? {
    gte: berlinOfferTime(`${year}-${month || "01"}-01T00:00`),
    lt: berlinOfferTime(month && month !== "12" ? `${year}-${String(Number(month) + 1).padStart(2, "0")}-01T00:00` : `${Number(year) + 1}-01-01T00:00`),
  } : undefined;
  const parsedPage = Number(rawPage);
  const page = Number.isInteger(parsedPage) && parsedPage >= 1 && parsedPage <= 10000 ? parsedPage : 1;
  const invoices = showInvoices ? await prisma.invoice.findMany({
    where: { ...(dateRange ? { issuedAt: dateRange } : {}), ...(query ? { invoiceNumber: { contains: query, mode: "insensitive" as const } } : {}) },
    orderBy: [{ issuedAt: "desc" }, { id: "desc" }],
    ...(paginate ? { skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE + 1 } : {}),
    select: {
      id: true, invoiceNumber: true, issuedAt: true, orderId: true,
      order: { select: { fullName: true, token: true } },
      document: { select: { invoiceId: true } },
    },
  }) : [];
  const dates = new Intl.DateTimeFormat(ru ? "ru-RU" : "de-DE", { timeZone: "Europe/Berlin", dateStyle: "short" });
  const paginationLink = (n: number) => ({ pathname: "/invoices" as const, query: { ...(query ? { number: query } : {}), ...(period ? { period } : {}), page: n } });
  const folder = (value: string) => ({ pathname: "/invoices" as const, query: value ? { period: value } : {} });
  const monthNames = new Intl.DateTimeFormat(ru ? "ru-RU" : "de-DE", { month: "long", timeZone: "UTC" });
  const monthTitle = (value: string) => monthNames.format(new Date(`${value}-01T12:00:00Z`));
  return <div className="mx-auto max-w-6xl space-y-5 p-4 sm:p-8">
    <header className="flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-2xl font-semibold">{tr("Архив счетов", "Rechnungsarchiv")}</h1>
      <Link href="/invoices/new" className="rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white">{tr("＋ Создать Rechnung", "＋ Rechnung erstellen")}</Link>
    </header>
    <p className="text-sm text-neutral-600">{tr("Счета из соцсетей и с сайта в одной серии. Скачивается сохранённый PDF, а не новый документ.", "Rechnungen vom Shop und aus externen Verkäufen in einer Nummernserie. Heruntergeladen wird das archivierte PDF.")}</p>
    {period && <nav className="flex flex-wrap items-center gap-2 text-sm" aria-label={tr("Папки по датам", "Datumsordner")}>
      <Link className="underline" href={folder("")}>{tr("Все годы", "Alle Jahre")}</Link>
      <span aria-hidden> / </span>
      {month ? <><Link className="underline" href={folder(year)}>{year}</Link><span aria-hidden> / </span><strong className="capitalize">{monthTitle(period)}</strong></> : <strong>{year}</strong>}
    </nav>}
    <form method="get" className="flex flex-wrap gap-2">
      {period && <input type="hidden" name="period" value={period} />}
      <input className="rounded-md border p-2 text-sm" name="number" maxLength={40} defaultValue={query} aria-label={tr("Номер счёта", "Rechnungsnummer")} placeholder="EP-…" />
      <button className="rounded-md border px-4 text-sm">{tr("Найти", "Suchen")}</button>
      {query && <Link className="self-center text-sm underline" href={folder(period)}>{tr("Сбросить", "Zurücksetzen")}</Link>}
    </form>
    {!showInvoices ? <section>
      <h2 className="mb-3 font-semibold">{year ? tr("Месяцы", "Monate") : tr("Годы", "Jahre")}</h2>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {(year ? months.filter(record => record.period.startsWith(year + "-")).map(record => ({ value: record.period, label: monthTitle(record.period), count: record.count }))
          : Array.from(years, ([value, count]) => ({ value, label: value, count }))).map(item => <li key={item.value}>
          <Link href={folder(item.value)} className="flex items-center justify-between gap-2 rounded-lg border bg-white px-4 py-3 hover:bg-neutral-50">
            <span className="font-semibold capitalize">{item.label}</span>
            <span className="text-sm text-neutral-600">{item.count} {tr("сч.", item.count === 1 ? "Rechnung" : "Rechnungen")}</span>
          </Link>
        </li>)}
      </ul>
      {!months.some(record => record.period.startsWith(year)) && <p>{tr("Счета не найдены.", "Keine Rechnungen gefunden.")}</p>}
    </section> : <>
    {!invoices.length && <p>{tr("Счета не найдены.", "Keine Rechnungen gefunden.")}</p>}
    {!!invoices.length && <ul className="divide-y rounded-lg border bg-white">
      {(paginate ? invoices.slice(0, PAGE_SIZE) : invoices).map(invoice => <li className="flex flex-wrap items-center justify-between gap-3 p-4 text-sm" key={invoice.id}>
        <div>
          <p className="font-semibold">{invoice.invoiceNumber} <span className="font-normal text-neutral-600">· {dates.format(invoice.issuedAt)}</span></p>
          <p className="break-words text-neutral-600">{invoice.order.fullName} · {invoice.order.token.startsWith(MANUAL_ORDER_PREFIX) ? tr("Вручную", "Manuell") : tr("Сайт", "Shop")}</p>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <Link className="underline" href={`/order/${invoice.orderId}`}>{tr("Заказ", "Bestellung")} #{invoice.orderId}</Link>
          {invoice.document ? <a className="font-semibold underline" href={`/api/invoices/${invoice.orderId}`}>{tr("Оригинал PDF", "Original-PDF")}</a> :
            <span className="text-neutral-600">{tr("Оригинал не найден в архиве", "Kein Original-PDF im Archiv")}</span>}
        </div>
      </li>)}
    </ul>}
    {paginate && <nav className="flex gap-5 text-sm" aria-label={tr("Страницы архива", "Archivseiten")}>
      {page > 1 && <Link className="underline" href={paginationLink(page - 1)}>{tr("← Назад", "← Zurück")}</Link>}
      {invoices.length > PAGE_SIZE && <Link className="underline" href={paginationLink(page + 1)}>{tr("Далее →", "Weiter →")}</Link>}
    </nav>}</>}
  </div>;
}
