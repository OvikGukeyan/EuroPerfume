import { Link } from "@/src/i18n/navigation";
import { getLocale } from "next-intl/server";
import { CookieSettingsButton } from "./cookie-settings-button";

export async function LegalDocument({ title, html, returns = false, privacy = false }: {
  title: string;
  html: string;
  returns?: boolean;
  privacy?: boolean;
}) {
  const locale = await getLocale();
  const ru = locale === "ru";
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 text-gray-800">
      <h1 className="mb-8 text-3xl font-semibold">{title}</h1>
      {ru && <p className="mb-6 text-sm text-gray-600">Юридическая версия документа приведена на немецком языке — языке договора.</p>}
      {returns && (
        <div className="mb-8 flex flex-wrap gap-4 rounded-lg border bg-gray-50 p-5">
          <Link href="/withdrawal" className="rounded-md bg-gray-900 px-5 py-3 font-semibold text-white">
            {ru ? "Отказаться от договора" : "Vertrag widerrufen"}
          </Link>
          <a href="/withdrawal-form.pdf" download className="rounded-md border px-5 py-3 font-medium">
            {ru ? "Скачать бланк возврата (PDF)" : "Muster-Widerrufsformular (PDF)"}
          </a>
        </div>
      )}
      {/* Trusted, sanitized static policy content; never customer input. */}
      <div className="leading-relaxed [&_a]:underline [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mb-3 [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_li]:mb-2 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6" dangerouslySetInnerHTML={{ __html: html }} />
      {privacy && <div className="mt-8"><CookieSettingsButton /></div>}
    </main>
  );
}
