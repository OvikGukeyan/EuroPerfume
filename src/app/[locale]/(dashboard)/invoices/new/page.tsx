import { berlinDate } from "@/src/shared/lib/tax";
import { requireInvoiceAdmin } from "@/src/shared/server-lib/invoice-corrections";
import ManualInvoiceForm from "./manual-invoice-form";

export const dynamic = "force-dynamic";

export default async function NewInvoicePage({ params }: { params: Promise<{ locale: string }> }) {
  await requireInvoiceAdmin();
  const { locale } = await params;
  return <ManualInvoiceForm ru={locale === "ru"} today={berlinDate(new Date())} />;
}
