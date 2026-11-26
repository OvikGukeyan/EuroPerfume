import prisma from "@/prisma/prisma-client";
import { Link } from "@/src/i18n/navigation";
import { MANUAL_ORDER_PREFIX } from "@/src/shared/lib/manual-invoice";
import { requireInvoiceAdmin } from "@/src/shared/server-lib/invoice-corrections";

export const dynamic = "force-dynamic";
const PAGE_SIZE = 30;

export default async function InvoiceArchive({ params, searchParams }: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string; number?: string }>;
}) {
  await requireInvoiceAdmin();
  const { locale } = await params;
  const ru = locale === "ru";
  const tr = (r: string, d: string) => ru ? r : d;
  const { number, page: rawPage } = await searchParams;
  const query = typeof number === "string" ? number.trim().slice(0, 40) : "";
  const parsedPage = Number(rawPage);
  const page = Number.isInteger(parsedPage) && parsedPage >= 1 && parsedPage < 1000 ? parsedPage : 1;
  const invoices = await prisma.invoice.findMany({
    where: query ? { invoiceNumber: { contains: query, mode: "insensitive" } } : {},
    orderBy: [{ issuedAt: "desc" }, { id: "desc" }],
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE + 1,
    select: {
      id: true, invoiceNumber: true, issuedAt: true, orderId: true,
      order: { select: { fullName: true, token: true } },
      document: { select: { invoiceId: true } },
    },
  });
  const dates = new Intl.DateTimeFormat(ru ? "ru-RU" : "de-DE", { timeZone: "Europe/Berlin", dateStyle: "short" });
  const paginationLink = (n: number) => ({ pathname: "/invoices" as const, query: { ...(query ? { number: query } : {}), page: n } });
  return <div className="mx-auto max-w-6xl space-y-5 p-4 sm:p-8">
    <header className="flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-2xl font-semibold">{tr("Архив счетов", "Rechnungsarchiv")}</h1>
      <Link href="/invoices/new" className="rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white">{tr("＋ Создать Rechnung", "＋ Rechnung erstellen")}</Link>
    </header>
    <p className="text-sm text-neutral-600">{tr("Счета из соцсетей и с сайта в одной серии. Скачивается сохранённый PDF, а не новый документ.", "Rechnungen vom Shop und aus externen Verkäufen in einer Nummernserie. Heruntergeladen wird das archivierte PDF.")}</p>
    <form method="get" className="flex flex-wrap gap-2">
      <input className="rounded-md border p-2 text-sm" name="number" maxLength={40} defaultValue={query} aria-label={tr("Номер счёта", "Rechnungsnummer")} placeholder="EP-…" />
      <button className="rounded-md border px-4 text-sm">{tr("Найти", "Suchen")}</button>
      {query && <Link className="self-center text-sm underline" href="/invoices">{tr("Сбросить", "Zurücksetzen")}</Link>}
    </form>
    {!invoices.length && <p>{tr("Счета не найдены.", "Keine Rechnungen gefunden.")}</p>}
    <ul className="divide-y rounded-lg border bg-white">
      {invoices.slice(0, PAGE_SIZE).map(invoice => <li className="flex flex-wrap items-center justify-between gap-3 p-4 text-sm" key={invoice.id}>
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
    </ul>
    <nav className="flex gap-5 text-sm" aria-label={tr("Страницы архива", "Archivseiten")}>
      {page > 1 && <Link className="underline" href={paginationLink(page - 1)}>{tr("← Назад", "← Zurück")}</Link>}
      {invoices.length > PAGE_SIZE && <Link className="underline" href={paginationLink(page + 1)}>{tr("Далее →", "Weiter →")}</Link>}
    </nav>
  </div>;
}
