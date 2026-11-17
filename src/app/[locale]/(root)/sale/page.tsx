import "../home.css";
import { Suspense } from "react";
import { Container, PaginationComponent, ProductsGroupList, TopBar } from "@/src/shared/components";
import { Link } from "@/src/i18n/navigation";
import { getLocale } from "next-intl/server";
export const dynamic = "force-dynamic";
export default async function SalePage() {
  const locale = await getLocale();
  return <div className="storefront-home bg-white">
    <div className="mx-auto max-w-[1460px] px-[5%] pt-6 text-xs text-neutral-500"><Link href="/" className="hover:underline">{locale === "ru" ? "Главная" : "Startseite"}</Link><span className="mx-2">/</span>SALE</div>
    <section className="mx-auto px-5 pb-3 pt-8 text-center md:pb-5 md:pt-10">
      <p className="home-eyebrow">EURO PERFUME</p>
      <h1 className="text-[28px] font-medium tracking-tight md:text-[34px]">{locale === "ru" ? "Парфюмерия со скидкой" : "Parfum-Sale"}</h1>
    </section>
    <Suspense fallback={null}><TopBar /></Suspense>
    <Container className="pb-10 pt-4 md:pt-5">
      <Suspense fallback={null}><ProductsGroupList sale /></Suspense>
      <PaginationComponent className="mt-8" />
    </Container>
  </div>;
}
