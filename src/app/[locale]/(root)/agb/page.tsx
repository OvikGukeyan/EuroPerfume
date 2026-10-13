import { LegalDocument } from "@/src/shared/components/shared/legal-document";
import { taxPolicyAt } from "@/src/shared/lib/tax";
import policies from "@/src/shared/content/legal-policies.json";

export const dynamic = "force-dynamic";

export default function Page() {
  const vat = taxPolicyAt(new Date()).mode === "vat";
  const html = vat ? policies.agb.replace(
    "Die angegebenen Preise sind Endpreise. Aufgrund der Kleinunternehmerregelung gemäß § 19 Abs. 1 UStG sind unsere Umsätze von der Umsatzsteuer befreit. Umsatzsteuer wird nicht ausgewiesen.",
    "Die angegebenen Preise sind Endpreise einschließlich der gesetzlichen Umsatzsteuer."
  ) : policies.agb;
  return <LegalDocument title="Allgemeine Geschäftsbedingungen" html={html} />;
}
