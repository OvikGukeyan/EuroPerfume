import { Nunito } from "next/font/google";
import "../globals.css";
import { CookieConsentModal, Providers } from "@/src/shared/components";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/src/i18n/routing";
import { cookies } from "next/headers";

const nunito = Nunito({
  subsets: ["cyrillic"],
  variable: "--font-nunito",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  const consentCookie = (await cookies()).get("cookie-consent")?.value ?? null;

  return (
    <html lang="en">
      <head>
        <link data-rh="true" rel="icon" href="/logo.png" />
      </head>

      <body className={nunito.className}>
        <NextIntlClientProvider>
          <Providers>
            {children}
            <CookieConsentModal />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
