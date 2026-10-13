import { LegalDocument } from "@/src/shared/components/shared/legal-document";
import policies from "@/src/shared/content/legal-policies.json";

export default function Page() {
  return <LegalDocument title="Widerrufsbelehrung" html={policies.returns} returns />;
}
