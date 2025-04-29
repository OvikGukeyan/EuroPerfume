import { Footer, Header } from "@/src/shared/components";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Euro Perfume",
  description: "Perfume store",
};

export default function HomeLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <Header className="sticky top-0 z-50 bg-white" />
      </Suspense>

      <div className="flex-grow">
        {children}
        {modal}
      </div>

      <Footer />
    </div>
  );
}
