import { Nunito } from "next/font/google";
import "../globals.css";
import { CookieConsentModal, Providers } from "@/src/shared/components";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/src/i18n/routing";
import { cookies } from "next/headers";
import Script from "next/script";
import { Metadata } from "next";

const nunito = Nunito({
  subsets: ["cyrillic"],
  variable: "--font-nunito",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "Euro Perfume",
    template: "%s | Euro Perfume",
  },
  description: "Perfume store.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: "https://www.euro-perfume.com",
  },
};

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
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-YWQF5HZNPJ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-YWQF5HZNPJ');
          `}
        </Script>
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
