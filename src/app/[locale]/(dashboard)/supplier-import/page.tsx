import { notFound, redirect } from "next/navigation";
import { getUserSession } from "@/src/shared/server-lib/get-user-session";
import { reviewEnabled } from "@/src/shared/lib/supplier-import";
import SupplierImportReview from "@/src/shared/components/shared/supplier-import-review";

export const dynamic = "force-dynamic";
export const metadata = { title: "Supplier import review", robots: { index: false, follow: false } };
export default async function SupplierImportPage({ params }: { params: Promise<{ locale: string }> }) {
  if (!reviewEnabled({ VERCEL_ENV: process.env.VERCEL_ENV, SUPPLIER_IMPORT_REVIEW_ENABLED: process.env.SUPPLIER_IMPORT_REVIEW_ENABLED })) notFound();
  const session = await getUserSession();
  if (!session || session.role !== "ADMIN") redirect("/not-auth");
  const { locale } = await params;
  return <SupplierImportReview locale={locale} />;
}
