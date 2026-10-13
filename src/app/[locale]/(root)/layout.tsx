import { Footer, Header } from "@/src/shared/components";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Euro Perfume",
  description: "EURO PERFUME – Designer- und Nischendüfte, Duftabfüllungen und Probierkollektionen. Versand innerhalb Deutschlands und der EU.",
};

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <Header className="sticky top-0 z-50 bg-white" />
      </Suspense>

      <div className="flex-grow">
        {children}
      </div>

      <Footer />
    </div>
  );
}
