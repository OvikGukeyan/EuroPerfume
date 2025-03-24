import type { Metadata } from "next";
import { Footer, Header } from "@/shared/components/shared";
import { Suspense } from "react";



export const metadata: Metadata = {
  title: "Euro Perfume",
  description: "Perfume store",
};

export default function HomeLayout({
  children,
  modal
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode
}>) {
  return (
      <main className="min-h-screen">
        <Suspense fallback={<div>Loading...</div>}>
          <Header 
          className="sticky top-0 z-50 bg-white"
          />
        </Suspense>
        {children}
        {modal}
        <Footer />
      </main>
  );
}
