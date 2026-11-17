import "../home.css";
import { HomeCatalog } from "@/src/shared/components/shared/home-catalog";
import { HomePriceProvider } from "@/src/shared/components/shared/home-price-note";
import { getHomeCatalog } from "@/src/shared/server-lib/get-home-catalog";
import { Link } from "@/src/i18n/navigation";
import { getLocale } from "next-intl/server";
export const dynamic = "force-dynamic";
export default async function SalePage() {
  const [initialPage, locale] = await Promise.all([getHomeCatalog(undefined, { sale: true }), getLocale()]);
  return <HomePriceProvider><div className="storefront-home bg-white">
    <div className="mx-auto max-w-[1460px] px-[5%] pt-6 text-xs text-neutral-500"><Link href="/" className="hover:underline">{locale === "ru" ? "Главная" : "Startseite"}</Link><span className="mx-2">/</span>SALE</div>
    <HomeCatalog initialPage={initialPage} sale/>
  </div></HomePriceProvider>;
}
