import { Nunito } from "next/font/google";
import "../globals.css";
import { CookieConsentModal, Providers } from "@/src/shared/components";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/src/i18n/routing";
import { OptionalAnalytics } from "@/src/shared/components/shared/optional-analytics";
import { cookies } from "next/headers";

const nunito = Nunito({
  subsets: ["cyrillic"],
  variable: "--font-nunito",
  weight: ["400", "500", "600", "700", "800", "900"],
});

// export const metadata: Metadata = {
//   title: {
//     default: "Euro Perfume",
//     template: "%s | Euro Perfume",
//   },
//   description: "Perfume store.",
//   robots: {
//     index: true,
//     follow: true,
//     googleBot: {
//       index: true,
//       follow: true,
//     },
//   },
//   alternates: {
//     canonical: "https://euro-perfume-inky.vercel.app",
//   },
// };

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
  // Preserve the original per-request rendering for sessions and cart cookies.
  await cookies();

  return (
    <html lang={locale}>
      <head>
        <link data-rh="true" rel="icon" href="/logo.png" />
      </head>

      <body className={nunito.className}>
        <OptionalAnalytics />
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
