import { getLocale } from "next-intl/server";
import { Link } from "@/src/i18n/navigation";
import { pallasGiftCopy } from "@/src/shared/lib/pallas-gift-copy";
import { pallasGiftState } from "@/src/shared/server-lib/pallas-gift";
export const dynamic = "force-dynamic";

export default async function PallasGiftOfferPage() {
  const [locale, state] = await Promise.all([getLocale(), pallasGiftState(null)]);
  const copy = pallasGiftCopy(locale);
  return <main className="mx-auto max-w-3xl px-5 py-10 md:py-16">
    <p className="mb-3 text-sm uppercase tracking-widest text-emerald-900">EURO PERFUME</p>
    <h1 className="font-serif text-3xl leading-tight md:text-5xl">{copy.name} — {copy.gift}</h1>
    <p className="my-6 text-lg leading-relaxed">{copy.summary}</p>
    {state !== "eligible" && <p role="status" className="my-5 rounded-lg bg-amber-50 p-4">{copy.unavailable}</p>}
    <h2 className="mt-8 text-xl font-semibold">{locale === "ru" ? "Условия акции" : "Aktionsbedingungen"}</h2>
    <ul className="my-5 list-disc space-y-4 pl-5 leading-relaxed">{copy.terms.map(term => <li key={term}>{term}</li>)}</ul>
    <p className="my-6 text-sm text-neutral-600">{copy.illustration}</p>
    <Link href="/items" className="inline-block rounded-full bg-emerald-950 px-7 py-3 text-white">{copy.shop}</Link>
  </main>;
}

