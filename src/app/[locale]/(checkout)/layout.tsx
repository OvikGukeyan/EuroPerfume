import {
  Container,
  Footer,
  Header,
  Recommendations,
} from "@/src/shared/components";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Checkout",
};

export default function CheckoutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-[#F4F1EE]">
      <Suspense fallback={<div>Loading...</div>}>
        <Header
          hasSearch={false}
          hasCart={false}
          className="border-b-gray-200"
        />
      </Suspense>
      <Container>
        {children}
        <Footer />
      </Container>
    </main>
  );
}
